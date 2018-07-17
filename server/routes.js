const express = require('express');
const FlixMixRouter = express.Router();

/* Controllers w/ Model Functions */
const UserController = require('./controllers/user.js');
const MovieController = require('./controllers/movies.js');
const PlaylistController = require('./controllers/playlist.js')


FlixMixRouter.route('/login')
    .post(UserController.checkUserCredentials)

FlixMixRouter.route('/signup')
    .post(UserController.signup)

FlixMixRouter.route('/myMovielists/:userID')
    .get(PlaylistController.fetchUsersMoviesList)

FlixMixRouter.route('/createPlaylist')
    .post(MovieController.addMoviesToDatabaseAndCreatePlaylist)



module.exports = FlixMixRouter