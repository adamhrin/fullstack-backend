import React from 'react'

const Person = (props) => (
  <div>
    <span>{props.name} {props.number}</span>
    <button onClick={() => props.handleDelete(props.id)}>delete</button>
  </div>
)

const Persons = ({ filteredPersons, handleDelete }) => {
  return filteredPersons.map(person => 
    <Person 
      key={person.id}
      id={person.id}
      name={person.name} 
      number={person.number}
      handleDelete={handleDelete} />
  )
}

export default Persons