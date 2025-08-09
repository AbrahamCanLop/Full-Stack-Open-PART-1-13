/*const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person, index) => (
        <p key={index}>{person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>
      ))}
    </div>
  )
}*/

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons
        .filter(person => person && person.number) // elimina null o undefined
        .map(person =>
          <p key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </p>
        )}
    </div>
  )
}

export default Persons
