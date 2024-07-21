const express = require("express")
const morgan = require("morgan")
const app = express()
app.use(express.static("dist"))

morgan.token("payload", (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    }
    return "-"
})

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :payload"))

const PORT = process.env.PORT || 3001

const createNewID = (items) => {
    let newID = String(Math.round(Math.random() * 9999))
    if (items.find(item => String(item.id) === newID )) {
        newID = createNewID(items) // Recursivity to avoid duplication. Slow BTW. I'd use a UUID based on datetime
    }
    return newID
}

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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
    response.json(contacts)
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
    const repeatedContact = contacts.find(contact => contact.name.toLowerCase() === newContact.name.toLowerCase())
    if (repeatedContact) {
        return response.status(400).json({
            code: "e0010",
            error: "'name' must be unique"
        })
    }

    newContact = {id: createNewID(contacts), ...newContact}
    contacts = contacts.concat(newContact)
    response.json(newContact)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const contact = contacts.find(contact => String(contact.id) === String(id))

    if (!contact) {
        return response.status(404).end()
    }
    response.json(contact)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(contact => String(contact.id) !== String(id))

    return response.status(204).end()
})

app.listen(PORT, () => {
    console.log(`server running in http://localhost:${PORT}`)
})