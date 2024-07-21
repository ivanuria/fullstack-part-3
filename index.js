const express = require("express")
const app = express()
app.use(express.json())

const PORT = 3001

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