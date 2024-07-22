const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)

mongoose
    .connect(url)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(error => {
        console.log("Error connecting MongoDB", error.message)
    })

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = new mongoose.model("Person", personSchema)