const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

//url de la base de datos
const url = `mongodb+srv://fullstack:${password}@cluster0.f4vubtr.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  //Codigo para introducir una nueva persona
  const person = new Person({
    name: newName,
    number: newNumber,
  })

  person.save().then((personResult) => {
    console.log(`added ${personResult.name} number ${personResult.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('error: número incorrecto de argumentos.')
  process.exit(1)
}
