require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
//DATOS DE LA BBDD PASADOS A note.js
/*const mongoose = require('mongoose')
const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = `mongodb+srv://fullstack:${password}@cluster0.f4vubtr.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

*/
//ANTIGUO DAO DE NOTAS
/*let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];*/

//middleware que imprime información sobre cada solicitud que se envía al servidor
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
// Middleware para servir archivos estáticos
app.use(express.static('dist'))


//middleware 404
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Middleware CENTRALIZADO DE ERRORES
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//************* BUSCAR TODAS ******************/
/* CAMBIAMOS EL ARRAY DE ESTA CLASE POR LA BASE DE DATOS
app.get("/api/notes", (request, response) => {
  response.json(notes);
});
*/
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//************* BUSCAR POR ID ******************/
/*app.get("/api/notes/:id", (request, response) => {
  //const id = request.params.id;
  const id = Number(request.params.id)
  console.log(id);
  //const note = notes.find((note) => note.id === id);
  const note = notes.find((note) => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id);
    return note.id === id;
  });

  //si no se encuentra una nota coincidente
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

  console.log(note);
});*/

//app.get('/api/notes/:id', (request, response) => {
//con manejo de errores centralizado
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    //si no se encuentra una nota coincidente
    if (note) {
      response.json(note)
    } else { //SI EL ID NO EXISTE
      response.status(404).end()
    }
  })
  //SI EL ID no coincide con el formato del identificador
    /*.catch(error => {
        console.log(error)
        //response.status(500).end()
        response.status(400).send({ error: 'malformatted id' })
      })*/
    .catch(error => next(error))
})

//************* BORRAR POR ID ******************/
/*app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})*/
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//************* AGREGAR NOTA  ******************/
//GENERAR UN ID
/*const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}*/

//AGREGAR NOTAS CON ARRAY DEL INDEX
/*app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    //Si la propiedad no existe, la expresión se evaluará como falsa
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})*/

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => response.json(savedNote))
    .catch(error => next(error))
})

//************* CAMBIO IMPORTANCIA A NOTA  ******************/
/*app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})*/

//Cambio de método tras realizar validaciones en el modelo
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// controlador de solicitudes que resulten en errores 404
app.use(unknownEndpoint)
// controlador de solicitudes que resulten en errores GENERICO
app.use(errorHandler)

//ANTERIORMENTE PARA LA CONEXION SIN EL PaaS
// const PORT =  process.env.PORT || 3001
//Conexión para Fly.io
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
