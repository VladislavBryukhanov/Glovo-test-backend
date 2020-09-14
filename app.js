const express = require('express');
const app = express();
require('dotenv').config();

const indexRouter = require('./routes/index');

app.use(express.json());
app.use('/', indexRouter);

module.exports = app;