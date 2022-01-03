require('dotenv').config()
const path = require('path')
const express = require('express')
const hbs = require('express-handlebars')
const db = require('./database/db')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const User = require('../src/models/User')
const Tought = require('../src/models/Tought')


const app = express()

app.engine('handlebars', hbs.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    logFn: () => {},
    path: path.join(require('os').tmpdir(), 'sessions'),  
  }),
  cookie: {
    secure: false,
    maxAge: 360000,
    expires: new Date(Date.now() + 360000),
    httpOnly: true,
  }
}))
app.use(flash())
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session
  }

  next()
})


const toughtRouter = require('./routes/toughtRouter')
app.use('/tought', toughtRouter)

const authRouter = require('./routes/authRouter')
app.use(authRouter)

const globalRouter = require('./routes/globalRouter')
app.use(globalRouter)

app.use((req, res, next) => {
  res.status(404).redirect('/404')
})


db.sync({ force: false })
  .then(() => {
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`\nServer is running in http://localhost:${port}\n`)
    })
  })
  .catch(err => {
    throw console.error(err)
  })
