const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person, index) => (
        <p key={index}>{person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>
      ))}
    </div>
  )
}

export default Persons
