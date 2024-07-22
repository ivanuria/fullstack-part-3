require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const app = express()
app.use(express.static("dist"))
//MODELS
const Person = require("./models/people")

morgan.token("payload", (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    }
    return "-"
})

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :payload"))

const PORT = process.env.PORT || 3001

app.get("/info", (request, response) => {
    const now = new Date()
    return response.send(`
        <h1>Phonebook Info</h1>
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>${now.toDateString()}, ${now.toTimeString()}</p>
        `
    )
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })    
})

app.post("/api/persons", (request, response) => {
    let newContact = request.body

    if (!newContact.name && !newContact.number) {
        return response.status(400).json({
            code: "e0000",
            error: "'name' and 'number' must be specified"
        })
    }
    if (!newContact.name) {
        return response.status(400).json({
            code: "e0001",
            error: "'name' must be specified"
        })
    }
    if (!newContact.number) {
        return response.status(400).json({
            code: "e0002",
            error: "'number' must be specified"
        })
    }
    /*Person.find({name: `/^${newContact.name}$/i`})
        .then(repeatedContact => {
            if (repeatedContact && repeatedContact.length === 0) {
                console.log("Repeated Contact", repeatedContact)
                return response.status(400).json({
                    code: "e0010",
                    error: "'name' must be unique"
                })
            }

            const person = new Person(newContact)
            person.save().then(savedPerson => {
                return response.json(savedPerson)
            })
        })*/
    const person = new Person(newContact)
    person.save().then(savedPerson => {
        return response.json(savedPerson)
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            return response.status(404).json({error: error.message})
        })
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person
        .findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (error, request, response) => {
    response.status(404).send({error: "Unknown Endpoint"})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error)

    if (error.name === "CastError") {
        response.status(400).send({ 
            code: "e0100",
            error: "Malformed ID"
        })
    }
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server running in http://localhost:${PORT}`)
})