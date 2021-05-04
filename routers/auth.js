const bcrypt = require("bcrypt");

const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }

  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });

    res.status(201).json({ token, ...newUser.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
// router.get(
//   "/me",
//   // authMiddleware,
//   async (req, res) => {
//     // don't send back the password hash
//     delete req.user.dataValues["password"];
//     res.status(200).send({ ...req.user.dataValues });
//   }
// );

// this router is going to get reserved tables
// router.get("/reservations/tables/:date", async (req, res) => {
//   const searchedDate = req.params.date;
//   console.log(searchedDate);
//   const tables = await Reservation.findAndCountAll({
//     where: { date: searchedDate },
//     include: [Table],
//     order: ["tableId"],
//   });
//   res.status(200).send({ message: "ok", tables });
// });

// this router is going to get all tables
// router.get("/tables/:date", async (req, res) => {
//   const searchedDate = req.params.date;
//   console.log(searchedDate);
//   const tables = await Table.findAndCountAll({});
//   res.status(200).send({ message: "ok", tables });
// });

//this gives me all the users
router.get("/users", async (req, res) => {
  const Users = await User.findAndCountAll({});
  console.log("This is the user", Users.rows);
  res.status(200).send({ message: "oksss", Users });
});

//this gives me all the reservations
// router.get("/reservations", authMiddleware, async (req, res) => {
//   const tables = await Reservation.findAndCountAll({
//     include: [User],
//     order: ["date"],
//   });
//   res.status(200).send({ message: "ok", tables });
// });

// this makes a reservation
// router.post("/makereservation", async (req, res) => {
//   const { date, userId, tableId } = req.body;
//   if (!date || !userId || !tableId) {
//     return res.status(400).send("Please provide a date, user and a tableId");
//   }
//   try {
//     await Reservation.create({
//       date: date,
//       userId: userId,
//       tableId: tableId,
//     });

//     res.status(201).send({ message: "Everything went well." });
//   } catch (error) {
//     return res.status(400).send({ message: "Something went wrong, sorry" });
//   }
// });

// this blocks a user

// router.put(`/blockuser/:id`, authMiddleware, function (req, res, next) {
//   const id = req.params.id;
//   User.update({ accountBlocked: true }, { returning: true, where: { id: id } })
//     .then(res.status(201).send({ message: "Everything went well." }))
//     .catch(next);
// });

// this unblock a user

// router.put(`/unblockuser/:id`, authMiddleware, function (req, res, next) {
//   const id = req.params.id;
//   User.update({ accountBlocked: false }, { returning: true, where: { id: id } })
//     .then(res.status(201).send({ message: "Everything went well." }))
//     .catch(next);
// });

// this deletes a reservation
// router.delete("/deletereservation/:id", authMiddleware, async (req, res) => {
//   const id = req.params.id;

//   const reservation = await Reservation.findByPk(id);

//   if (!reservation) {
//     return res.status(404).send({ message: "Reservation not found" });
//   } else {
//     await reservation.destroy();

//     return res
//       .status(201)
//       .send({ message: "Reservation deleted", reservation });
//   }
// });

module.exports = router;
