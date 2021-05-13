const bcrypt = require("bcrypt");
const axios = require("axios");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Comment = require("../models").comment;
const Article = require("../models/").article;
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

    if (!user) {
      return res.status(400).send({
        message: "User with that email not found ",
      });
    }

    if (!user || bcrypt.compareSync(password, user.password)) {
      console.log(password, "this is th password"),
        console.log(user.password, "this is the scrambled thing");
      return res.status(400).send({
        message: "password incorrect",
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
  const { email, password, name, scuderia } = req.body;
  if (!email || !password || !name || !scuderia) {
    return res
      .status(400)
      .send("Please provide an email, password, name and scuderia");
  }

  try {
    const newUser = await User.create({
      email,
      password,
      name,
      scuderia,
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

// This router is going to get all F1 realated news.
// https://newsapi.org/v2/everything?q=apple&from=2021-05-04&to=2021-05-04&sortBy=popularity&apiKey=168611ab2e3d4fbc83964054b839c0c4

router.get("/news", authMiddleware, async (req, res) => {
  const url = `https://newsapi.org/v2/everything?q=%22F1%22and%22Formula%201%22and&%22formula1%22&sortBy=popularity&apiKey=168611ab2e3d4fbc83964054b839c0c4`;
  const response = await axios.get(url);
  const articles = response.data.articles;
  res.status(200).send({ articles });
});

// This router is going to get me all the comments stored
router.get("/comments/:articleurl", authMiddleware, async (req, res) => {
  const articleURL = req.params.articleurl;

  const comments = await Article.findAndCountAll({
    where: { url: articleURL },
    include: [{ model: Comment, include: [User] }],
    // include: [Comment],
  });
  console.log("These are the stored comments", comments.rows.dataValues);
  res.status(200).send({ comments });
});

router.get("/specificarticle/:articleURL", async (req, res) => {
  const articleURL = req.params.articleURL;

  const deco = decodeURIComponent(articleURL);

  const response = await Article.findAndCountAll({
    where: { url: deco },
  });

  if (response.count > 0) {
    const saved = true;
    res.status(200).send({ saved });
  } else {
    const saved = false;
    res.status(200).send({ saved });
  }

  //
});

router.get("/insertarticle/:articleURL", async (req, res) => {
  const articleURL = req.params.articleURL;

  const deco = decodeURIComponent(articleURL);

  const response = await Article.findAndCountAll({
    where: { url: deco },
  });

  if (response.count > 0) {
    const saved = true;
    res.status(200).send({ saved });
  } else {
    const saved = false;
    res.status(200).send({ saved });
  }

  //
});

router.get("/comments", authMiddleware, async (req, res) => {
  // const url = `https://newsapi.org/v2/everything?q=%22F1%22and%22Formula%201%22and&%22formula1%22&sortBy=popularity&apiKey=168611ab2e3d4fbc83964054b839c0c4`;
  const response = await axios.get(url);
  const articles = response.data.articles;
  res.status(200).send({ articles });
});

router.post("/insertarticle", async (req, res) => {
  const {
    titleReady,
    urlReady,
    descriptionReady,
    authorReady,
    contentReady,
    img_urlReady,
  } = req.body;

  const decoTitle = decodeURIComponent(titleReady);
  const decoURL = decodeURIComponent(urlReady);
  const decoDescription = decodeURIComponent(descriptionReady);
  const decoAuthor = decodeURIComponent(authorReady);
  const decoContent = decodeURIComponent(contentReady);
  const decoImageURL = decodeURIComponent(img_urlReady);

  const newArticle = await Article.create({
    url: decoURL,
    author: decoAuthor,
    title: decoTitle,
    content: decoContent,
    img_url: decoImageURL,
    description: decoDescription,
  });
  res.status(201).json({ newArticle });
  res.status(200).send(console.log("the article was published"));

  //
});

// router.post(
//   // "/insertarticle/:encodedurl/:encodedauthor/:encodedtitle/:encodedcontent/:encodedimg_url/:encodeddescription/:token`,",
//   "/insertarticle/:encodedurl`,",
//   async (req, res) => {
//     const url = req.params.encodedurl;
//     // const decodedurl = decodeURIComponent(url);
//     console.log(url, " i am the auth");

//     // const decodedauthor = decodeURIComponent(req.params.encodedauthor);
//     // const decodedauthor = decodeURIComponent(req.params.encodedauthor);
//     // const decodedtitle = decodeURIComponent(req.params.encodedtitle);
//     // const decodedcontent = decodeURIComponent(req.params.encodedcontent);
//     // const decodedimg_url = decodeURIComponent(req.params.encodedimg_url);
//     // const decodeddescription = decodeURIComponent(
//     //   req.params.encodeddescription
//     // );
//     // const token = req.params.token;

//     // const {
//     //   url,
//     //   author,
//     //   title,
//     //   content,
//     //   img_url,
//     //   description,
//     //   token,
//     // } = req.body;
//     // decodedurl = decodeURIComponent(url);
//     // decodedauthor = decodeURIComponent(author);
//     // decodedtitle = decodeURIComponent(title);
//     // decodedcontent = decodeURIComponent(content);
//     // decodedimg_url = decodeURIComponent(img_url);

//     console.log(
//       "I am the url"
//       // decodedurl
//       // "I am the author",
//       // decodedauthor,
//       // "I am the title",
//       // decodedtitle,
//       // "I am the content",
//       // decodedcontent,
//       // "I am the image",
//       // decodedimg_url,
//       // "I am the description",
//       // decodeddescription,
//       // "i am the thoke",
//       // token
//     );
//     if (
//       !url
//       // !decodedauthor ||
//       // !decodedtitle ||
//       // !decodedcontent ||
//       // !decodedimg_url ||
//       // !decodeddescription
//     ) {
//       return res
//         .status(400)
//         .send(
//           "Please provide a url, author, title, content, img_url, description"
//         );
//     }
//     try {
//       await Article.create({
//         url: url,
//         author: "teste",
//         title: "teste",
//         content: "teste",
//         img_url: "teste",
//         description: "teste",
//       });

//       res.status(201).send({ message: "Everything went well." });
//     } catch (error) {
//       return res.status(400).send({ message: "Something went wrong, sorry" });
//     }
//   }
// );

// router.get("/news/:title", async (req, res) => {
//   const title = request.params.title;
//   console.log("this is the title", title);
//   const url = `https://newsapi.org/v2/everything?qInTitle="${title}"&apiKey=168611ab2e3d4fbc83964054b839c0c4`;
//   const response = await axios.get(url);
//   const article = response.data.article;
//   console.log("this is the article", article);
//   res.status(200).send({ article });
// });

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", async (req, res) => {
  // don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues });
});

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
// router.get("/users", async (req, res) => {
//   const Users = await User.findAndCountAll({});
//   console.log("This is the user", Users.rows);
//   res.status(200).send({ message: "oksss", Users });
// });

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
