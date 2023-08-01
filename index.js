const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config(); 


const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000; 


app.use(cors()); 
app.use(express.json()); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9qdnote.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); 


async function run(){
  try{
    await client.connect();
    const database = client.db('doctors_portal');
    const appointmentsCollection = database.collection('appointments');
    
    // Appointments filer 
    app.get('/appointments',  async (req, res) =>{
      const email = req.query.email; 
      const date = new Date(req.query.date).dayjs(date).format('DD/MM/YYYY'); 
      // console.log(date);  
      const query = { email: email, date: date } 
      // console.log(query); 
      const cursor = appointmentsCollection.find(query); 
      const appointments = await cursor.toArray();
      res.json(appointments); 
      
    });

    app.post('/appointments',  async (req, res) =>{
        const appointment = req.body;
        console.log(appointment);
        const result = await appointmentsCollection.insertOne(appointment);
        res.json(result); 
      });

    app.get('/appointments',  async (req, res) =>{
      const email = req.query.email;
      const date = req.query.date;
      const query = {email : email, date: date};
      const cursor = appointmentsCollection.find(query);
      const appointments = await cursor.toArray();
      res.json(appointments); 

  });



  }
  finally{ 
  }

}
run().catch(console.dir); 

app.get('/', (req, res) => {
  res.send('Hello Doctors portal!')
})



app.listen(port, () => {
  console.log(`listening at ${port}`)
})