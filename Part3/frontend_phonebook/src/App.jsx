import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFound, setNameFound] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    const personSearch = persons.find(p => p.name === newName)

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (personSearch) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (confirmUpdate) {
        const nameToUpdate = personSearch.name
        personService
          .update(personSearch.id, personObject)
          .then((updatedPerson) => {
            setPersons(persons.map(p => p.id !== personSearch.id ? p : updatedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated  ${updatedPerson.name}`, type: 'success' })
            setTimeout(() => {
              setNotification({ message: null, type: '' })
            }, 5000)
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setNotification({
                message: `The person '${nameToUpdate}' was already removed from the server`,
                type: 'error'
              })
              setPersons(persons.filter(p => p.id !== personSearch.id)) // Limpia el estado local
            } else if (error.response && error.response.data && error.response.data.error) {
              setNotification({ message: error.response.data.error, type: 'error' })
            } else {
              setNotification({ message: 'Unknown error occurred', type: 'error' })
            }

            setTimeout(() => {
              setNotification({ message: null, type: '' })
            }, 5000)
          })
      }

    } else {

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
        .catch(error => {
          // mensaje de error para las validaciones
          console.log(error.response.data.error)
          setNotification({ message: error.response.data.error, type: 'error' })
          // volver a pedir la lista de contactos al backend
          personService.getAll().then(updatedList => {
            setPersons(updatedList)
          })
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })

    }

  }

  const handleDeletePerson = id => {
    const personSearch = persons.find(p => p.id === id)
    const confirmDelete = window.confirm(`Delete ${personSearch.name}?`)

    if (confirmDelete) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ message: `Deleted ${personSearch.name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
        .catch(error => {
          setNotification({ message: `The person '${personSearch.name}' was already removed from the server`, type: 'error' })
          setPersons(persons.filter(p => p.id !== id))
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
    }
  }

  const handlePersonNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handlePersonNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handlePersonNameFound = (event) => {
    setNameFound(event.target.value)
  }

  const personsToShow = nameFound
    ? persons.filter(person => person.name.toLowerCase().includes(nameFound.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={nameFound} onChange={handlePersonNameFound} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={handlePersonNameChange}
        numberValue={newNumber}
        onNumberChange={handlePersonNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={handleDeletePerson} />
    </div>
  )
}

export default App