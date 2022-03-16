const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

//initializations
const app = express();
require('./lib/passport');

//config
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',engine({
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares
app.use(session({
    secret: 'dianastaystoned',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    app.locals.computadora = req.computadora;
    app.locals.laboratorio = req.laboratorio;
    app.locals.ticket = req.ticket;
    app.locals.mantenimiento = req.mantenimiento;
    next();
})

//routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/lab', require('./routes/lab'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
});