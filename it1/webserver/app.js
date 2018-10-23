// @ts-check
const CONNECTSTRING = "postgres://audun:123@localhost/bibliotek";

const PORT = 3000;

const express = require("express");
const pgp = require("pg-promise")();
const db = pgp(CONNECTSTRING);

const app = express();
const bodyParser = require("body-parser");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes.
app.get("/", function (req, res) {
  res.send({ msg: "ok" });
});

app.post("/runsql", function (req, res) {
  let data = req.body;
  runsql(res, data);
});

app.listen(3000, function () {
  console.log(`Quiz server started on port ${PORT}`);
});

async function runsql(res, obj) {
  let results;
  let sql = obj.sql;
  let data = obj.data;
  await db.many(
    sql,data
  )
    .then(data => {
      results = data;
    })
    .catch(error => {
      console.log("ERROR:", sql, ":", error.message); // print error;
      results = {};
    });
  res.send({ results });
}


/* another file */

/*
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
*/
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