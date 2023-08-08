require('dotenv').config();
let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let refreshToken = require('./routes/refreshToken');
let logout = require('./routes/logout');

let app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', refreshToken);
app.use('/logout', logout);

module.exports = app;