require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms- :res[content-length] :body'))

// let persons = [
//   {
//     name: "Adam Hrin",
//     number: "123456",
//     id: 1
//   },
//   {
//     name: "Ada Lovelace",
//     number: "45654567",
//     id: 2
//   },
//   {
//     name: "Pyndle Great",
//     number: "68549854",
//     id: 3
//   },
//   {
//     name: "Larry King",
//     number: "54345434543",
//     id: 4
//   }
// ]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const numOfPersons = persons.length
  const date = new Date()
  const resp = `
  <p>Phonebook has info for ${numOfPersons} people</p>
  <p>${date}</p>
  `
  response.send(resp)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

// const getRandomInt = (max = 1000) => {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// const generateId = () => {
//   return getRandomInt()
// }

const isDuplicate = (name) => {
  const nameArr = persons.map(p => p.name).concat(name)
  const isDuplicate = nameArr.some((name, id) => 
    nameArr.indexOf(name) != id
  )
  return isDuplicate
}

// app.post('/api/persons', (request, response) => {
//   const body = request.body
    
//   if (!body.name) {
//     return response.status(400).json({ 
//       error: 'name missing' 
//     })
//   }

//   if (isDuplicate(body.name)) {
//     return response.status(400).json({ 
//       error: 'name must be unique' 
//     })
//   }

//   if (!body.number) {
//     return response.status(400).json({ 
//       error: 'number missing' 
//     })
//   }
    
//   const person = {
//     name: body.name,
//     number: body.number,
//     id: generateId(),
//   }
    
//   persons = persons.concat(person)
//   response.json(person)
// })

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})