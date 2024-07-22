require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
//MODELS
const Person = require('./models/people')

morgan.token('payload', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return '-'
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))

const PORT = process.env.PORT || 3001

app.get('/info', (request, response) => {
  const now = new Date()
  Person.find({}).then(people => {
    return response.send(
      `<h1>Phonebook Info</h1>
      <p>Phonebook has info for ${people.length} people</p>
      <p>${now.toDateString()}, ${now.toTimeString()}</p>
      `
    )
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.post('/api/persons', (request, response, next) => {
  let newContact = request.body

  Person.findOne({ name: new RegExp(String.raw`^${newContact.name}$`, 'i') })
    .then(repeatedContact => {
      if (repeatedContact) {
        console.log('Repeated Contact', repeatedContact)
        return response.status(400).json({
          code: 'e0010',
          error: '\'name\' must be unique'
        })
      }
      const person = new Person(newContact)
      person
        .save()
        .then(savedPerson => {
          return response.json(savedPerson)
        })
        .catch(error => next(error))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      return response.status(404).json({ error: error.message })
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person
    .findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({
      code: 'e0100',
      error: 'Malformed ID'
    })
  }
  if (error.name === 'ValidationError') {
    console.log('ERROR DATA Name', error.errors.name ? error.errors.name.kind : '')
    console.log('ERROR DATA Number', error.errors.number ? error.errors.number.kind : '')
    if (error.errors.name && error.errors.name.kind === 'required'
            && error.errors.number && error.errors.number.kind === 'required') {
      return response.status(400).json({
        code: 'e0000',
        error: '\'Name\' and \'Phone\' must be specified'
      })
    }
    if (error.errors.name && error.errors.name.kind === 'required') {
      return response.status(400).json({
        code: 'e0001',
        error: '\'Name\' must be specified'
      })
    }
    if (error.errors.name && error.errors.name.kind === 'minlength') {
      return response.status(400).json({
        code: 'e0003',
        error: '\'Name\' must be at least 3 characters long'
      })
    }
    if (error.errors.number && error.errors.number.kind === 'required') {
      return response.status(400).json({
        code: 'e0002',
        error: '\'Phone\' must be specified'
      })
    }
    if (error.errors.number && error.errors.number.kind === 'minlength') {
      return response.status(400).json({
        code: 'e0004',
        error: '\'Phone\' must be at least 8 characters long'
      })
    }
    if (error.errors.number && error.errors.number.kind === 'user defined') {
      return response.status(400).json({
        code: 'e0005',
        error: '\'Phone\' must be of format XX-XXXXX... or XXX-XXXX...'
      })
    }
  }

  return next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server running in http://localhost:${PORT}`)
})