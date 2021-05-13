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

    order: [Comment, "createdAt", "DESC"],
  });

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

// this is gonna get me the comments
router.get("/comments", authMiddleware, async (req, res) => {
  const response = await axios.get(url);
  const articles = response.data.articles;
  res.status(200).send({ articles });
});

//This router is gonna post articles for me

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
});

// this router is gonna insert comments for me
router.post("/insertcomment", async (req, res) => {
  const { userId, articleId, comment } = req.body;

  const newComment = await Comment.create({
    userId,
    articleId,
    comment,
  });
  res.status(201).json({ newComment });
  res.status(200).send(console.log("the comment was published"), newComment);
});

module.exports = router;
