require("dotenv").config();
const path = require("path");

const express = require("express");
const postService = require("./post-service");

const { requireAuth } = require("../middleware/jwt-auth");
const xss = require("xss");
const { post } = require("../app");

const postRouter = express.Router();
const jsonParser = express.json();

const serializePost = (post) => ({
	id: post.id,
	date_published: post.date_published,
	title: post.title,
	body: post.body,
});

postRouter
   .route("/")
   .get((req, res, next) => {
      const knexInstance = req.app.get("db");
      postService
         .getAllPost(knexInstance)
         .then(post => {
            res.json(post.map(serializePost));
         })
         .catch(next);
   })
   .post(jsonParser, (req, res, next) => {
      //validation & object deconstruction
      const { title, body } = req.body;
      const newPost = { title, body };

      for(const [key, value ] of Object.entries(newPost))
         if(value == null)
            return res.status(400).json({
               error: { message: `Missing '${key}' in request` }
            })
      postService
         .insertPost(req.app.get("db"), newPost)
         .then(post => {
            res
               .status(201)
               .location(path.posix.join(req.originalUrl,`/${post.id}`))
               .json(serializePost(post));
         })
         .catch(next);
   });

   postRouter
      .route("/:post_id")
      .all((req, res, next) => {
         postService
            .getById(req.app.get("db"), req.params.post_id)
            .then(postEffected => {
               res.status(200).end();
            })
            .catch(next);
      })
module.exports = postRouter;