const xss = require("xss");
// const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const postService = {
	getAllPost(knex) {
		return knex.select("*").from("posts");
	},
	insertPost(knex, newPost) {
		return knex
			.insert(newPost)
			.into("posts")
			.returning("*")
			.then((rows) => {
				return rows[0];
			});
	},
	getById(knex, id) {
		return knex.from("posts").select("*").where("id", id).first();
	},
	deletePost(knex, id) {
		return knex("posts").where({ id }).delete();
	},
};
module.exports = postService;
