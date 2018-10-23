var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const collection = require("./routes/collection");
const picture = require("./routes/picture");
const user = require("./routes/user");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Customer
app.get('/collection', collection.findAll);
app.get('/collection/:id', collection.findOneById);
app.get('/collection/names/:name', collection.findOneByName);
app.get('/collection/category/:category', collection.findCategory);
app.get('/picture', picture.findAll);
app.get('/picture/collection/:id', picture.findItsCollection);
app.get('/picture/names/:name', picture.findByName);
app.get('/user', user.findAll);
app.get('/user/:email', user.findOneById);
app.get('/user/names/:name', user.findByName);

app.post('/collection', collection.addCollection);
app.post('/picture', picture.addPicture);
app.post('/user', user.addUser);

app.put('/collection/:id/attentionAdd', collection.incrementFollow);
app.put('/picture/:id/addComment', picture.addComment);
app.put('/picture/:id/changeDescribe', picture.changeDescribe);
app.put('/user/:id/removeFollow', user.removeFollows);
app.put('/user/:id/addFollow', user.addFollows);
app.put('/user/:id/addBoard', user.addBoards);
app.put('/user/:id/removeBoard',user.removeBoards);

app.delete('/collection/:id', collection.deleteCollection);
app.delete('/picture/:id', picture.deletePicture);
app.delete('/user/:id', user.deleteUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
