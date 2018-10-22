
const CONNECTSTRING = siteinf.CONNECTSTRING || "postgres://audun:123@localhost/bibliotek";

const express = require("express");
const pgp = require("pg-promise")();
const db = pgp(CONNECTSTRING);

const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");


app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "darling",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

// Define routes.
app.get("/", function (req, res) {
  res.render("home", { user: req.user });
});


app.get("/profile", Ensure.ensureLoggedIn(), function (req, res) {
  res.render("profile", { user: req.user });
});

app.post("/runsql", function (req, res) {
  let user = req.user;
  let data = req.body;
  runsql(res, user, data);
});

app.listen(3000, function () {
  console.log(`Quiz server started on port ${PORT}`);
});

async function runsql(res, user, data) {
  let now = Date.now();
  let id;
  let type = data.qtype || "multiple";
  await db.one(
    "INSERT INTO quiz_question " +
    "(qtype,teachid,created,modified,subject) " +
    "VALUES(${type},${uid},${now},${now},'TEST') " +
    "RETURNING id", { uid: user.id, now, type }
  )
    .then(data => {
      id = data.id;
    })
    .catch(error => {
      console.log("ERROR:", error); // print error;
      id = 0;
    });
  res.send({ id });
}


/* another file */

async function makeQlist(qlistorder) {
  if (qlistorder.length > 1000) {
    return "Narrow down search - result is " + qlistorder.length;
  }
  let list = [];
  let ids = qlistorder.join(",");
  await fetch(`getQlist/${ids}`, { credentials: "include" })
    .then(r => r.json())
    .then(data => {
      let qlist = data.qlist;
      let qcache = {};
      qlist.forEach(e => {
        qcache[e.id] = e;
      });

      list = qlistorder.map((e, i) => {
        let q = qcache[e];
        return synopsis(q, e, i);
      });
    })
    .catch(e => {
      console.log("Failed to fetch qlist", e);
    });

  return list.join("");
}

/**
 * home pug
 *
 * 
if user
  p Hello #{user.username} please view your
      a(href='/profile')  profile
else
  p welcome, please 
    a(href='/login') login 
    
*/