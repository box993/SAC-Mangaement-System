require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { application } = require("express");
const {
  validateUserToken,
  validateAdminToken,
} = require("../middlewares/AuthMiddleware");

const saltRounds = 10;

// TODO
// Implement pages in admin history
// Implement pop-up when you click register on student dash
// Require password for editing person limit
// Restrict admin URLs to only rooms which exist (drop down)
// Add constraints to password either through form validation or mysql
// Read about tokens (jwt, etc)
// Use lodash everywhere for consistency
// Remove console.logs
// Ask jaju about random behavior (not giving alerts)
// Doesn't res.json end the request

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "sacdb",
});

// API for student creating user (not using in main app)
router.post("/createUser", (req, res) => {
  const { bitsmail, fName, lName, DOB, Address, password } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => {
    try {
      db.query(
        // Why does vscode say await is unnecessary here?
        "INSERT INTO sacdb.users (bitsmail, fName, lName, DOB, Address, password) VALUES (?, ?, ?, ?, ?, ?)",
        [bitsmail, fName, lName, DOB, Address, hash],
        (err, result) => {
          if (err) {
            console.log("F LMAO DED");
            console.log(err);
          } else {
            console.log(result);
            res.send("User Created!");
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.send("error, please check console!");
    }
  });
});

// API for creating admins (not in main app)
router.post("/createAdmin", (req, res) => {
  const { id, fName, lName, DOB, Address, password } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => {
    try {
      db.query(
        "INSERT INTO sacdb.admins (fName, lName, DOB, Address, password) VALUES (?, ?, ?, ?, ?)",
        [fName, lName, DOB, Address, hash],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result.insertId);
            res.send("User Created!");
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.send("error, please check console!");
    }
  });
});

// API for logging in student
router.post("/login", (req, res) => {
  const { bitsmail, password } = req.body;
  try {
    db.query(
      "SELECT bitsmail, password FROM sacdb.users WHERE bitsmail=?",
      [bitsmail],
      (err, result) => {
        if (err) {
          res.send({ error: err });
        }
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password).then((match) => {
            if (!match) {
              res.json({ error: "Wrong username and password combination" });
            } else {
              const accessToken = sign(
                { id: bitsmail, role: "user" },
                process.env.JWTSECRET
              );
              res.json({ token: accessToken, username: bitsmail });
            }
          });
        } else {
          res.json({ error: "User does not exist!" });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// API for admin login
router.post("/adminlogin", (req, res) => {
  const { id, password, room } = req.body;
  try {
    db.query(
      "SELECT x.ID, x.password, r.Name FROM sacdb.rooms as r JOIN (SELECT m.ID, a.password, m.RoomID FROM sacdb.manages as m JOIN sacdb.admins as a on m.ID=a.id) as x ON x.RoomID=r.RoomID WHERE ID=? AND Name=?",
      [id, room],
      (err, result) => {
        if (err) {
          res.send({ error: err });
        }
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password).then((match) => {
            if (!match) {
              res.json({ error: "Wrong username and password combination" });
            } else {
              if (result[0].Name === room) {
                const accessToken = sign(
                  { id: id, role: "admin", room: room },
                  process.env.JWTSECRET
                );
                res.json({ token: accessToken, room: room });
              } else {
                res.json({ error: "Room not authorized!" });
              }
            }
          });
        } else {
          res.json({ error: "User does not exist!" });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// // API for getting data on homepage
router.get("/home", (req, res) => {
  try {
    db.query(
      "SELECT rooms.RoomID, Name, IFNULL(Current, 0) as Current, PersonLimit as Capacity FROM rooms LEFT JOIN (SELECT RoomID, COUNT(*) AS Current FROM sacdb.users GROUP BY RoomID) r ON rooms.RoomID = r.RoomID",
      (err, result) => {
        if (err) {
          res.json({ error: err });
        }
        res.json(result);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

// API for getting student dashboard
router.get("/studentdash", validateUserToken, (req, res) => {
  try {
    const bitsmail = req.user.id;
    db.query(
      "SELECT name,id,personLimit AS capacity,current,!ISNULL(bitsmail) AS registered, cost FROM (SELECT cost, name,rooms.roomid AS id,personlimit,COUNT(bitsmail) AS current FROM rooms LEFT JOIN users ON rooms.RoomID=users.roomID GROUP BY rooms.roomid) AS t LEFT JOIN registered ON t.id=registered.roomid AND registered.bitsmail=?",
      [bitsmail],
      (err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(result);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// to get req.user
// router.get("/auth", validateToken, (req, res) => {
//   res.json(req.user);
// });

// API to get profile of a user
router.get("/profile", validateUserToken, (req, res) => {
  const bitsmail = req.user.id;
  db.query(
    "SELECT u.bitsmail, fName, lName, DOB, Address, phoneNumber FROM sacdb.users AS u LEFT JOIN sacdb.users_phone AS p on u.bitsmail=p.bitsmail WHERE u.bitsmail=?",
    [bitsmail],
    (err, result) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.send(result);
      }
    }
  );
});

// API to get profile of an admin
router.get("/adminprofile", validateAdminToken, (req, res) => {
  const id = req.user.id;
  db.query(
    "SELECT a.id, fName, lName, DOB, Address, phoneNumber FROM sacdb.admins AS a LEFT JOIN sacdb.admin_phone AS p on a.id=p.id WHERE a.id=?",
    [id],
    (err, result) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.send(result);
      }
    }
  );
});

// API to get data on admindash
router.get("/admindash", validateAdminToken, (req, res) => {
  try {
    const { room } = req.user;
    db.query(
      "SELECT bitsmail, fName, lName, CheckIn, r.Name, CASE WHEN TimeLimit = 0 THEN 0 ELSE SUBTIME(TimeLimit ,CAST(TIMEDIFF(NOW(), CheckIn) AS TIME)) END AS TimeLeft FROM sacdb.users AS u LEFT JOIN sacdb.rooms AS r ON u.RoomID=r.RoomID WHERE r.Name=? AND CheckIn IS NOT NULL ORDER BY CheckIn",
      [room],
      (err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(result);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// API to get student history data
router.get("/studenthistory", validateUserToken, (req, res) => {
  try {
    const bitsmail = req.user.id;
    db.query(
      "SELECT id, bitsmail as bitsID, fName, lName, RoomName as room, CheckIn as checkIn, CheckOut as checkOut FROM sacdb.history WHERE bitsmail=? ORDER BY checkOut DESC",
      [bitsmail],
      (err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(result);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// API to get admin history data
router.get("/adminhistory", validateAdminToken, (req, res) => {
  const { room } = req.user;
  try {
    db.query(
      "SELECT id, bitsmail as bitsID, fName, lName, RoomName as room, CheckIn as checkIn, CheckOut as checkOut FROM sacdb.history WHERE RoomName=? ORDER BY checkIn DESC",
      [room],
      (err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json(result);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// API to check-in a user
router.post("/checkin", validateAdminToken, (req, res) => {
  const { room } = req.user;
  const { bitsID } = req.body;
  try {
    db.query(
      "SELECT count(*) >= r.PersonLimit AS cntlimit, r.RoomID FROM sacdb.users AS u RIGHT JOIN sacdb.rooms AS r ON r.RoomID=u.RoomID WHERE r.Name=?",
      [room],
      (err, result1) => {
        if (err) {
          res.json({ error: err });
        } else if (result1[0].cntlimit) {
          console.log(result1[0]);
          res.json({
            error:
              "Person limit of the room exceeded. Please wait till someone checks out!",
          });
        } else {
          const roomid = result1[0].RoomID;
          db.query(
            "SELECT u.RoomID IS NULL AS free FROM sacdb.users AS u WHERE u.bitsmail=?",
            [bitsID],
            (err, result2) => {
              if (err) {
                res.json({ error: err });
              } else if (result2.length == 0) {
                res.json({ error: "User doesn't exist!" });
              } else if (!result2[0].free) {
                res.json({
                  error:
                    "User is already checked into another room. Check out before checking into other rooms",
                });
              } else {
                db.query(
                  "SELECT !ISNULL(bitsmail) OR t.cost=0 AS registered FROM (SELECT cost,rooms.roomid AS id FROM rooms LEFT JOIN users ON rooms.RoomID=users.roomID GROUP BY rooms.roomid) AS t LEFT JOIN registered ON t.id=registered.roomid AND registered.bitsmail=? WHERE t.id=?",
                  [bitsID, roomid],
                  (err, result3) => {
                    if (err) {
                      res.json({ error: err });
                    }
                    if (!result3[0].registered) {
                      res.json({ error: "User not registered" });
                    } else {
                      db.query(
                        "UPDATE sacdb.users SET CheckIn=NOW(), RoomID=? WHERE bitsmail=?",
                        [roomid, bitsID],
                        (err, result) => {
                          if (err) {
                            res.json({ error: err });
                          }
                          res.json(result);
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// API to checkout a user
router.post("/checkout", validateAdminToken, (req, res) => {
  const { room } = req.user;
  const { bitsID } = req.body;
  try {
    db.query(
      "SELECT RoomID FROM sacdb.rooms WHERE Name=?",
      [room],
      (err, result) => {
        if (err) {
          res.json({ error: err });
        }
        const roomid = result[0].RoomID;
        db.query(
          "INSERT INTO sacdb.history (bitsmail, fName, lName, RoomID, RoomName, CheckIn, CheckOut) (SELECT bitsmail, fName, lName, r.RoomID, Name, CheckIn, NOW() FROM sacdb.users AS u LEFT JOIN sacdb.rooms AS r ON r.RoomID=u.RoomID WHERE bitsmail=? AND u.RoomID=?)",
          [bitsID, roomid],
          (err, result) => {
            if (err) {
              res.json({ error: err });
            }
            // res.json(result); // test
            db.query(
              "UPDATE sacdb.users SET CheckIn=NULL, RoomID=NULL WHERE bitsmail=? AND RoomID=?",
              [bitsID, roomid],
              (err, result) => {
                if (err) {
                  res.json({ error: err });
                } else if (result.affectedRows === 0) {
                  res.json({
                    error: "Cannot checkout a user who is not in the room!",
                  });
                } else res.json(result);
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// API to change person limit of a room
router.post("/editPersonLimit", validateAdminToken, (req, res) => {
  const { room } = req.user;
  const { personLimit } = req.body;
  try {
    db.query(
      "UPDATE sacdb.rooms SET PersonLimit=? WHERE Name=?;",
      [personLimit, room],
      (err, result) => {
        if (err) {
          res.json({ error: err });
        }
        res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// API to register for a room (student)
router.post("/registerRoom", validateUserToken, (req, res) => {
  const { room } = req.body;
  const { id } = req.user;
  try {
    db.query(
      "INSERT INTO sacdb.registered (bitsmail, RoomID) SELECT ?, RoomID FROM sacdb.rooms WHERE Name=?",
      [id, room],
      (err, result) => {
        if (err) {
          res.json({ error: err });
        }
        res.json(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
