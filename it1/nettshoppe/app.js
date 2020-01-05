// @ts-check
const CONNECTSTRING = "postgres://shop:123@localhost/shop";
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

// userlist will always contain admin - see lagBrukerliste()
const userlist = {};
const _username2id = {};

const newusers = {}; // need confirming

const _usersById = id => {
  return userlist[id] || { username: "none", password: "" };
};

async function lagBrukerliste() {
  let sql = `select u.*,k.kundeid from users u left join kunde k
            on (u.userid = k.userid)`;
  await db
    .any(sql)
    .then(data => {
      if (data && data.length) {
        data.forEach(({ userid, username, role, password, kundeid }) => {
          userlist[userid] = { id: userid, username, role, password, kundeid };
          _username2id[username] = userid;
        });
      }
    })
    .catch(error => {
      console.log("ERROR:", sql, ":", error.message); // print error;
    });
  // ensure admin user always exists
  if (!_username2id["admin"]) {
    let sql = `insert into users (username,role,password)
     values ('admin','admin','${umd5("1230")}') returning userid`;
    let { userid } = await db.one(sql);
    userlist[userid] = {
      id: userid,
      username: "admin",
      password: umd5("1230")
    };
    _username2id["admin"] = userid;
  }
  console.log(userlist);
}

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
  res.redirect("/users/login.html");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/index.html",
    failureRedirect: "/users/login.html"
  })
);

app.post("/signup", function(req, res) {
  let user = req.body;
  if (
    user.username &&
    user.fornavn &&
    user.etternavn &&
    user.etternavn &&
    user.epost &&
    user.adresse &&
    user.password
  ) {
    // gyldig bruker
    if (_username2id[user.username]) {
      res.redirect("/users/signup.html?message=taken");
    } else {
      // lag ny bruker
      let token; // lager ny token - sjekker at den er ledig
      do {
        token = ("" + Math.random()).substr(2, 6);
      } while (newusers[token]);
      newusers[token] = user;
      res.redirect(`/users/verify.html?token=${token}`);
    }
  } else {
    res.redirect("/users/signup.html?message=missing");
  }
});

async function makeNewUser(token) {
  let user = newusers[token];
  let sql = `insert into users (username,role,password)
  values ('${user.username}','user','${umd5(user.password)}') returning userid`;
  let { userid } = await db.one(sql);
  userlist[userid] = {
    id: userid,
    username: user.username,
    password: umd5(user.password)
  };
  _username2id[user.username] = userid;
  // insert new user as kunde
  delete newusers[token];
  sql = `insert into kunde (userid,fornavn,etternavn,adresse,epost)
  values (${userid},'${user.fornavn}',
           '${user.etternavn}','${user.adresse}','${user.epost}') returning kundeid`;
  let { kundeid } = await db.one(sql);
  userlist[userid].kundeid = kundeid;
}

app.post("/verify", function(req, res) {
  let { token } = req.body;
  if (newusers[token]) {
    // verified new user
    makeNewUser(token);
    res.redirect("/users/login.html");
  } else {
    res.redirect("/users/signup.html");
  }
});

/* runsql kan bare brukes av innlogga bruker */
app.post("/runsql", function(req, res) {
  let user = req.user;
  let data = req.body;
  if (req.isAuthenticated()) {
    // kan også ha sjekk på brukernavn
    let userinfo = userlist[user.id] || {};
    if (userinfo.role === "admin") {
      runsql(res, data);
    } else {
      safesql(user, res, data);
    }
  } else {
    saferSQL(res, data, { tables: "vare,linje,bestilling" });
  }
});

// delivers userinfo about logged in user
app.post("/userinfo", function(req, res) {
  let user = req.user;
  let data = req.body;
  if (req.isAuthenticated()) {
    let sql = data.sql + ` from kunde where userid=${user.id}`;
    getuinf(sql, res);
  } else {
    res.send({ error: "player unknown b." });
  }
});

async function getuinf(sql, res) {
  let userinfo = await db.one(sql);
  res.send(userinfo);
}

async function saferSQL(res, obj, options) {
  const predefined = [];
  let results = { error: "Illegal sql" };
  let tables = options.tables.split(",");
  let sql = obj.sql.replace("inner ", "");
  let data = obj.data;
  let allowed = predefined.concat(tables.map(e => `select * from ${e}`));
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
  let { file } = req.params;
  res.sendFile(__dirname + `/admin/${file}`);
});

app.get("/myself", function(req, res) {
  let user = req.user;
  if (user) {
    let { username } = req.user;
    res.send({ username });
  } else {
    res.send({ username: "" });
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
  lagBrukerliste();
});

async function safesql(user, res, obj) {
  let results;
  let sql = obj.sql;
  let lowsql = "" + sql.toLowerCase();
  let data = obj.data;
  let unsafe = false;
  let personal = false;

  // liste over begrensa sql for vanlig bruker - må gjelde egne bestillinger
  if (user && user.id) {
    let userinfo = userlist[user.id];
    if (userinfo.kundeid) {
      let good = [
        `insert into bestilling (dato,kundeid) values ($[dato],$[kundeid])`,
        `insert into linje (antall,bestillingid,vareid) values ($[antall],$[bestillingid],$[vareid])`,
        `delete from linje where linjeid in`,
        `delete from bestilling where besti`,
      ];
      // du kan lure systemet her - dette er bare en delvis kontroll
      // må sjekke at denne brukeren eier bestillingen
      // og at linje blir lagt til en bestilling som bruker eier
      if (good.includes(lowsql) || good.includes(lowsql.substr(0,34))) {
        personal = true;
      }
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
        results = { error: error.message };
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
      results = { error: error.message };
    });
  res.send({ results });
}
