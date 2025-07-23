import { useState, useEffect } from 'react'

const ViewOneCountry = ({ country }) => {

  const languages = Object.values(country.languages || {})

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital?.[0]}</p>
      <p>Area {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {languages.map((lang, i) => <li key={i}>{lang}</li>)}
      </ul>

      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="150" />
    </div>
  )


}

const CountryList = ({ countries, onShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {

    return <ViewOneCountry country={countries[0]} />

  }

  if (countries.length === 0) {
    return <p>No matches</p>
  }

  return (
    <div>
      {countries.map(c => (
        <p key={c.cca3}>{c.name.common}
          <button onClick={() => onShowCountry(c)}>show</button></p>
      ))}
    </div>
  )
}


function App() {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filterCountries, setFfilterCountries] = useState([])
  const [selectedOneCountry, setSelectedOneCountry] = useState(null)

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => res.json())
      .then(data => setAllCountries(data))
  }, [])

  useEffect(() => {
    const result = allCountries.filter(c =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setFfilterCountries(result)
  }, [query, allCountries])

  const handleChange = (e) => {
    setQuery(e.target.value)
    setSelectedOneCountry(null)
  }

  return (
    <>
      <p>find countries
        <input value={query} onChange={handleChange} />
      </p>
      <CountryList countries={filterCountries} onShowCountry={setSelectedOneCountry} />
      {selectedOneCountry && <ViewOneCountry country={selectedOneCountry} />}
    </>
  )
}

export default App

