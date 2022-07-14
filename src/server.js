//--------------------------------------------------------------------------------------//
//·································· proyect moduls·····································//
//--------------------------------------------------------------------------------------//
const express = require('express');
var url = require('url');
const path = require('path');
const methodOverride = require('method-override');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session')


//--------------------------------------------------------------------------------------//
//······························· Initiliazations ······································//
//--------------------------------------------------------------------------------------//
const app = express();


//--------------------------------------------------------------------------------------//
//··································· setting ··········································//
//--------------------------------------------------------------------------------------//
app.set('port', process.env.PORT || 3000)

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//--------------------------------------------------------------------------------------//
//································· Middlewares ········································//
//--------------------------------------------------------------------------------------//
//app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    //store: MongoStore.create({ mongoUrl: config.MONGODB_URI }),
  })
);
//app.use(passport.initialize());
//app.use(passport.session());
app.use(flash());

//--------------------------------------------------------------------------------------//
//······························· Global Variable ······································//
//--------------------------------------------------------------------------------------//
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//--------------------------------------------------------------------------------------//
//··································· routes  ··········································//
//--------------------------------------------------------------------------------------//
//home 
app.use(require('./routes/index.routes'));
app.use(require('./routes/course.routes'));
app.use(require('./routes/debt.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/price.course.routes'));



//--------------------------------------------------------------------------------------//
//································· static Files ·······································
//--------------------------------------------------------------------------------------//
app.use(express.static(path.join(__dirname, "public")));



//--------------------------------------------------------------------------------------//
//····································· exports ········································//
//--------------------------------------------------------------------------------------//
module.exports = app