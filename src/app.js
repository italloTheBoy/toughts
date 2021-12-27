require('dotenv').config()
const path = require('path')
const express = require('express')
const hbs = require('express-handlebars')
const db = require('./database/db')


const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine('handlebars', hbs.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))


db.sync()
  .then(() => {
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`Server is running in http://localhost:${port}`)
    })
  })
  .catch(err => {
    throw console.error(err)
  })
