const express = require("express");
const usersService = require("./user-service");
const { hasUserWithUsername, hashPassword } = require("./user-service");

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
	id: user.id,
	email: user.email,
	username: user.username,
	password: user.password,
	post_id: user.post_id,
});

usersRouter
	.route("/")
	.get((req, res, next) => {
		const knexInstance = req.app.get("db");
		usersService
			.getAllUsers(knexInstance)
			.then((users) => {
				res.json(users.map(serializeUser));
			})
			.catch(next);
	})
	.post(jsonParser, (req, res, next) => {
		//validation & object deconstruction
		const { email, password, username } = req.body;
		const newUser = { email, password, username };

		for (const [key, value] of Object.entries(newUser))
			if (value == null)
				return res.status(400).json({
					error: { message: `Missing '${value}' in request` },
				});

		const passwordError = usersService.validatePassword(password);
		if(passwordError) return res.status(400).json({
			error: { message: passwordError }
		})

		usersService
			.hasUserWithUsername(req.app.get("db"), username)
			.then(hasUserWithUsername => {
				if(hasUserWithUsername)
					return res.status(400).json({
						error: { message: `Username is already taken` }
					})
			});
		
			return usersService.hashPassword(password).then(hashedPassword => {
					const newUser = {
						username,
						password: hashedPassword,
						email,
					}
					return usersService
						.insertUsers(req.app.get("db"), newUser)
						.then((users) => {
							res
								.status(201).json(serializeUser(users))
						})
						.catch(next);
			})

	});
module.exports = usersRouter;