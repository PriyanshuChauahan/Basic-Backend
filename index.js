require("dotenv").config();
const connectToMongo=require('./db');
const express = require('express')
const cors = require('cors')


// (async function db() {
  
//  await  connectToMongo();
// })();
connectToMongo();

const app = express()
app.use(cors())
const port = 5000
app.use(express.json())

// Available Routes

app.use('/api/auth',require('./routes/auth'))


app.listen(port, () => {
  console.log(`Template backend app listening on port http://localhost:${port}`)
})
