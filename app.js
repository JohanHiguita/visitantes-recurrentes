const express = require("express")
const app = express()
const mongoose = require("mongoose")

app.set('view engine', "ejs")

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1",
  { useNewUrlParser: true }
)
mongoose.connection.on("error", function(e) {
  console.error(e)
})

// definimos el schema
const schema = mongoose.Schema({
  name: String,
  count: { type: Number, default: 1 }
})

// definimos el modelo
const Visitor = mongoose.model("Visitor", schema)

app.get("/", async (req, res) => {
  if (!req.query.name || req.query.name == "") {

    //create a new Anónimo user
    const visitor = new Visitor({ name: "Anónimo" })
    await visitor.save()
    console.log("saved anonimo")
  }else {

    Visitor.findOne({ name: req.query.name}, async (err, visitor) => {
      
      if(err) return console.error("error finding the visitor on the BBDD")
      if (visitor) {
        visitor.count +=1
        visitor.save()
      }else {
        //create a new visitor
        try {
          const new_visitor = new Visitor({ name: req.query.name })
          await new_visitor.save()
          console.log("visitor created")
        } catch (error) {
          console.error("error creating a new visitor")
        }
        
      }    
    });
       
  }
  const visitors = await Visitor.find()
  res.render('index', {visitors})
  

})

app.listen(3000, () => console.log("Listening on port 3000 ..."))
