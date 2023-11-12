require('dotenv').config({ path: '.env' })

const express = require('express')
const app = express()
const port = 5000; //Line 3
const bcrypt = require('bcrypt')
const UserModel = require('./models/users')
const passport = require('passport'); // If you are using passport for authentication
const LocalStrategy = require('passport-local').Strategy; // If you are using passport-local strategy
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const schedule = require('node-schedule');
const urlHost = "51.20.120.30"
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


const bodyParser = require('body-parser'); // middleware
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors({
    origin: `http://${urlHost}:3000`,
    credentials: true,
}));

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


const protectRoute = (req,res, next) => {

  const token = req.session.user['token']
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    next()
  })
}

app.get("/profile", protectRoute, (req, res) => {
  if (req.session.user) {
    // User is authenticated, you can access req.session.user here
    res.json(req.session.user);
  } else {
    return res.json({name: "GUEST" , isLoggedIn: false});
  }
});

app.post('/login',  (req, res) => {
  console.log("wykonuej sie logowanie?")
  UserModel.find({name: req.body.userName}).then(user => {
    const selectedUser = Object.values(user)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try{
      if(selectedUser[0].password === req.body.password){
        const user = { name: selectedUser[0].name , isLoggedIn: true, token: ""}
        user['token'] = generateAccessToken(user)        
        req.session.user = user;
        console.log(req.session.user)     
        console.log("poprawnie zalgowany")
        res.redirect(`http://${urlHost}:3000`)
      }else{
        res.send('Not Allowed')
      }
      }catch(err) {
        console.log(err)
        res.redirect(`http://${urlHost}:3000`)
      }
  })
})

function getFormatedDate(){
  const date = new Date();
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  };
  const formatedDate = date.toLocaleString('en-US', options);
  const stringWithoutComma = formatedDate.replace(/,/g, '');
  return stringWithoutComma
}

const scheduledTasks = [];

function sendSms(bodySMS){
  client.messages
    .create({
      body: bodySMS,
      from: '+12563673252',
      to: '+48572664111'
    })
    .then(message => console.log(message.sid))
    .catch((error) => {
      console.error('Error sending SMS:', error);
    });
}

function updateAlerts(){
  const currentDate = getFormatedDate()
  UserModel.find()
    .then(data => { data.forEach(user => {
      const userName = user.name
      user.messages.forEach(mess =>{
        if (mess.data.includes(currentDate) && mess.alert === false)
        {
          const time = setTimeForSchedule(mess.godzina)
          scheduleTask(time, mess)         
          console.log("zeschudleowane taski:" + scheduledTasks)        
          updateScheduledAlertOnDB(userName, mess.data)
        }
      })
    })
  })
}

function scheduleTask(time, message){
  const scheduledTask = schedule.scheduleJob(time, 
    () => {
      sendSms(`Za godzine zaczyna sie Twoj trening ${message.trening} dystans ${message.dystans} godzina ${message.godzina}.`)});
  scheduledTasks.push(scheduledTask);
}

function setTimeForSchedule(time){
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const scheduledTime = new Date();
  return scheduledTime.setHours(hours -1, minutes, 0, 0); // set time to send sms 1 hour before training start
}

function updateScheduledAlertOnDB(userName, date){
  db.collection('users').updateOne(
    { 
      "name": userName,
      "messages.data": date  // Use a filter to identify the specific element
    },
    {
      "$set": {
        "messages.$.alert": true  // Use $ to update the matched element's "alert"
      }
    },
    function(err, result) {
      if (err) {
        // Handle the error
        console.log(err)
      } else {
        // Handle the success case
        console.log("success")
      }
    }
  )
}

updateAlerts()
const interval = setInterval(updateAlerts, 60 * 1000);

app.post('/addActivity',(req, res) => {
  db.collection('users').updateOne(
    { 
      "name" : req.session.user.name
    },
    {
      "$push": {
        "messages" : {  "data" : req.body.data,
                        "trening" : req.body.trening ,
                        "dystans" : req.body.dystans,
                        "godzina" : req.body.godzina,
                        "alert" : false}
      }
    })
    res.redirect(`http://${urlHost}:3000`)
});

app.post('/deleteActivity', protectRoute, (req, res) => {
  db.collection('users').updateOne(
    { 
      "name" : req.session.user.name
    },
    {
      "$pull": {
        "messages" : {
          "data" : req.body.data,
          "godzina" : req.body.godzina
        }
      }
    })
    res.redirect(`http://${urlHost}:3000`)
});

app.post('/logout', protectRoute, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect(`http://${urlHost}:3000`); // Redirect to the login page or wherever you want
  });
});

app.get('/usersData', protectRoute, (req, res) => {
  UserModel.find().then(users => {
    res.json(users)})
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});