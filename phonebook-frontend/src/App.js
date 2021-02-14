import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personsService from './services/persons'
import './index.css'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ notifClassName, setNotifClassName] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  // this function filters persons according to the current filter value
  const getFilteredPersons = (filter) => {
    const filteredPersons = persons.filter(
      person => {
        const re = new RegExp(filter, 'i')
        return person.name.match(re)
      }
    )
    return filteredPersons
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    // create copy of persons with new added person
    const newPersons = persons.concat(newPerson)
    // check for duplicates
    const nameArr = newPersons.map(person => person.name)
    const isDuplicate = nameArr.some((name, id) => 
      nameArr.indexOf(name) != id
    )
    if (isDuplicate) {
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        // using the fact that name must be unique to find the id of the person to update
        const personToUpdate = persons.find(p => p.name === newName)
        const id = personToUpdate.id
        personsService
          .update(id, newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
            setNotifClassName('success')
            setMessage(
              `Updated number of ${updatedPerson.name} to ${updatedPerson.number}`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.log(error);
            setNotifClassName('error')
            setMessage(`Information of ${personToUpdate.name} has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotifClassName('success')
          setMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = id => {
    const personToDelete = persons.find(p => p.id === id)
    const name = personToDelete.name
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== id))
          setNotifClassName('success')
          setMessage(`Deleted ${name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const personsToShow = getFilteredPersons(filter)

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} className={notifClassName} />

      <Filter filter={filter} filterChangeHandler={handleFilterChange} />

      <h3>Add a new person</h3>

      <PersonForm 
        submitHandler={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        nameChangeHandler={handleNameChange}
        numberChangeHandler={handleNumberChange}
      />
      
      <h3>Numbers</h3>

      <Persons 
        filteredPersons={personsToShow} 
        handleDelete={handleDelete}/>
      
    </div>
  )
}

export default App