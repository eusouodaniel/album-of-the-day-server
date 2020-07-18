var express = require('express');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
require('./config/database');

var healthRouter = require('./app/routes/health');
var albumsRouter = require('./app/routes/albums');
var likesRouter = require('./app/routes/likes');
var usersRouter = require('./app/routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', healthRouter);
app.use('/albums', albumsRouter);
app.use('/likes', likesRouter);
app.use('/users', usersRouter);

module.exports = app;
