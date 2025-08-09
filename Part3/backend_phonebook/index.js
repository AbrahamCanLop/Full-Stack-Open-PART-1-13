require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())

// Crear el token personalizado para el body ya que no se puede añadir a tiny
morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(cors())
app.use(express.static('dist'))

// Middleware CENTRALIZADO DE ERRORES
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    // error por nombre duplicado
    return response.status(400).json({ error: 'The name already exists in the phonebook' })
  }

  next(error)
}


app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

//METODO DE BUSCAR CONTACTO POR ID
/*app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => {
    console.log(person.id, typeof person.id, id, typeof id, person.id === id)
    return person.id === id
  })

  //si no se encuentra una nota coincidente
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})*/
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      //si no se encuentra una nota coincidente
      if (person) {
        response.json(person)
      } else { //si el id no existe
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//METODO info
/*app.get("/info", (request, response) => {
  const totalPersons = request.query()
  const date = Date()
  response.send(`<p>Phonebook has info for ${totalPersons}</p> <p>${date}</p>`)
})*/
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(totalPersons => {
      const date = new Date()
      response.send(`<p>Phonebook has info for ${totalPersons}</p> <p>${date}</p>`)
    })
    .catch(error => next(error))
})

//METODO DE BORRAR CONTACTO
/*app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})*/
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        return response.status(404).json({ error: 'person not found' })
      }
      response.status(204).end()
    })
    .catch(error => next(error))
})

//METODO DE AGREGAR CONTACTO
/*app.post("/api/persons", (request, response) => {
  const body = request.body;
  const auxId = Math.floor(Math.random() * 90000);
  const personSearch = persons.find((p) => p.name === body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "dates missing",
    });
  }

  if (personSearch) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: auxId,
  };

  persons = persons.concat(person);

  response.json(person);
});*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // se comenta el condicinal ya que lo lanzamos y tratamos en el manejador de errores
  /* if (!body.name || !body.number) {
     return response.status(400).json({
       error: "dates missing",
     })
   }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

//ACTUALIZAR CONTACTO
/*app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})*/
//La solucion de abajo permite actualizar un objeto con el uso de validaciones
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        return response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

app.use(errorHandler)

//Conexión para Fly.io
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})