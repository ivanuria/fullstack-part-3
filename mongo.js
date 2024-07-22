const mongoose = require("mongoose")

// This code is a mess

if (process.argv.length < 3) {
    console.log("Give password as argument")
    process.exit(1)
}
if (process.argv.length > 3  && process.argv.length < 5) {
    console.log("You must set in order: password name number")
    process.exit(1)
}

const username = "ivanuria"
const password = process.argv[2]
const appName = "phoneBookApp"

const url = `mongodb+srv://${username}:${password}@fullstackopen.9w0q2vh.mongodb.net/${appName}?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = new  mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
    console.log("Phonebook:")
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({ name, number })
    person.save().then(result => {
        console.log("Person saved!")
        mongoose.connection.close()
    })    
}
