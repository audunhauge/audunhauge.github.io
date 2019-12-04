// @ts-check
const CONNECTSTRING = "postgres://bib:123@localhost/bib";
const PORT = 3000;
const express = require("express");
const pgp = require("pg-promise")();
const db = pgp(CONNECTSTRING);
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const Ensure = require("connect-ensure-login");
const crypto = require("crypto");

// fake userdb just for testing - should be stored in db
const userlist = {
  1: { id: 1, username: "admin", password: umd5("1230") },
  2: { id: 2, username: "bib1", password: umd5("1234") },
  3: { id: 3, username: "bib2", password: umd5("1235") }
};
const _username2id = { admin: 1, bib1: 2, bib2: 3 };

const _usersById = id => {
  return userlist[id] || { username: "none", password: "" };
};

function findByUsername(rbody, username, cb) {
  process.nextTick(function() {
    if (_username2id[username]) {
      let userid = _username2id[username];
      let user = _usersById(userid);
      console.log(userlist[userid], userid, user);
      return cb(null, user);
    }
    return cb(null, null);
  });
}
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
passport.use(
  new Strategy({ passReqToCallback: true }, function(
    req,
    username,
    password,
    cb
  ) {
    findByUsername(req.body, username, function(err, user, key = "") {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != umd5(password)) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

function findById(id, cb) {
  process.nextTick(function() {
    if (_usersById(id)) {
      cb(null, _usersById(id));
    } else {
      cb(new Error("User " + id + " does not exist"));
    }
  });
}

function umd5(pwd) {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex");
}

app.use(
  session({
    secret: "butistillloveyoudarling",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get("/login", function(req, res) {
  res.redirect("/login.html");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/index.html",
    failureRedirect: "/login.html"
  })
);

/* runsql kan bare brukes av innlogga bruker */
app.post("/runsql", function(req, res) {
  let user = req.user;
  let data = req.body;
  if (req.isAuthenticated()) {
    // kan også ha sjekk på brukernavn
    if (user.username === "admin") {
      runsql(res, data);
    } else {
      safesql(user, res, data);
    }
  } else {
    saferSQL(res, data, { tables: "bok,forfatter,eksemplar" });
  }
});

async function saferSQL(res, obj, options) {
  const predefined = [
    "select * from bok b join forfatter f on (b.forfatterid = f.forfatterid)",
    "select e.*, b.tittel from eksemplar e join bok b on (e.bokid = b.bokid)"
  ]
  let results = { error:"Illegal sql" };
  let tables = options.tables.split(",");
  let sql = obj.sql.replace("inner ","");
  let data = obj.data;
  let allowed = predefined.concat( tables.map(e => `select * from ${e}`) );
  if (allowed.includes(sql)) {
    await db
      .any(sql, data)
      .then(data => {
        results = data;
      })
      .catch(error => {
        console.log("ERROR:", sql, ":", error.message); // print error;
        results = { error };
      });
  }
  res.send({ results });
}

app.get("/admin/:file", Ensure.ensureLoggedIn(), function(req, res) {
  let user = req.user;
  let { file } = req.params;
  res.sendFile(__dirname + `/admin/${file}`);
});

app.get("/myself", function(req, res) {
  let user = req.user;
  if (user) {
    let { username } = req.user;
    res.send({ username });
  } else {
    res.send({ username: "unknown" });
  }
});

app.get("/htmlfiler/:admin", function(req, res) {
  let path = "public";
  if (req.user) {
    let { username } = req.user;
    let { admin } = req.params;
    if (username && admin === "admin") {
      path = "admin";
    }
  }
  fs.readdir(path, function(err, files) {
    let items = files.filter(e => e.endsWith(".html") && e !== "index.html");
    res.send({ items });
  });
});

app.listen(3000, function() {
  console.log(`Du kan koble deg til på http://localhost:${PORT}`);
});

async function safesql(user, res, obj) {
  let results;
  let sql = obj.sql;
  let lowsql = "" + sql.toLowerCase();
  let data = obj.data;
  let unsafe = false;
  let personal = false;
  // liste over begrensa sql for vanlig bruker - må gjelde egne utlån
  if (user && user.id) {
    let good = [
      `select * from utlaan where laanerid=${user.id}`,
      `select * from laaner where laanerid=${user.id}`
    ];
    if (good.includes(lowsql)) {
      personal = true;
    }
  }
  unsafe = unsafe || !lowsql.startsWith("select");
  unsafe = unsafe || lowsql.substr(6).includes("select");
    // only allow one select - disables subselect
  unsafe = unsafe || lowsql.includes("delete");
  unsafe = unsafe || lowsql.includes(";");
  unsafe = unsafe || lowsql.includes("insert");
  unsafe = unsafe || lowsql.includes("update");
  unsafe = unsafe || lowsql.includes("union");
  unsafe = unsafe || lowsql.includes("alter");
  unsafe = unsafe || lowsql.includes("drop");
  // kan ikke se på andre lånere eller utlån
  unsafe = unsafe || lowsql.includes("laaner");
  unsafe = unsafe || lowsql.includes("utlaan");
  if (unsafe && !personal) {
    results = {};
  } else
    await db
      .any(sql, data)
      .then(data => {
        results = data;
      })
      .catch(error => {
        console.log("ERROR:", sql, ":", error.message); // print error;
        results = {};
      });
  res.send({ results });
}

async function runsql(res, obj) {
  let results;
  let sql = obj.sql;
  let data = obj.data;
  await db
    .any(sql, data)
    .then(data => {
      results = data;
    })
    .catch(error => {
      console.log("ERROR:", sql, ":", error.message); // print error;
      results = {};
    });
  res.send({ results });
}
