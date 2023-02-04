const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash =require('express-flash')

const app = express()

const conn = require('./db/conn')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//backend receives body answer
app.use(
    express.urlencoded({
        extended: true
    })
)


//Models
const Tought = require('./models/Tought')
const User = require('./models/User')

//import Routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//import Controller
const ToughtController = require('./controllers/ToughtController')


//middleware receives data-json
app.use(express.json())

//where express save the sessions
//each session can keep logged in local client computer
app.use(
    session({
        name: "session",
        secret: "segredo_bagunça_123",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true,
        }
    }),
)

//flash massages
app.use(flash())

//public path
app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {

    if(req.session.userid){
        res.locals.session = req.session
    }
    
    next()
})

app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)

conn
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(`Houve um erro de escuta do banco de dados : ${err}`))