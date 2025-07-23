import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

/* FUNCIONES QUE DEVUELVEN COMPONENTES 

const StatisticLine = (props) => (
  <p>{props.name} {props.value}</p>
)

const HistoryVotes = ({ allClicks }) => {
  if (allClicks.length > 0) {
    return (
      <p>All {allClicks.length}</p>
    )
  }

}

const HistoryAverage = ({ allClicks }) => {
  let total = 0

  for (let i = 0; i < allClicks.length; i++) {
    const vote = allClicks[i]
    if (vote === 'G') {
      total += 1
    } else if (vote === 'B') {
      total -= 1
    }
  }

  const average = total / allClicks.length

  if (allClicks.length > 0) {
    return <p>average {average}</p>
  }

}

const AverageVotesGood = ({ allClicks }) => {
  let total = 0

  for (let i = 0; i < allClicks.length; i++) {
    const vote = allClicks[i]
    if (vote === 'G') {
      total += 1
    }
  }

  const average = total * 100 / allClicks.length

  if (allClicks.length > 0) {
    return <p>positive {average}%</p>
  }

}
*/

const HistoryVotes = (allClicks) => allClicks.length

const HistoryAverage = (allClicks) => {
  let total = 0
  for (let vote of allClicks) {
    if (vote === 'G') total += 1
    else if (vote === 'B') total -= 1
  }
  return total / allClicks.length
}

const AverageVotesGood = (allClicks) => {
  let positives = 0
  for (let vote of allClicks) {
    if (vote === 'G') positives += 1
  }
  return (positives * 100) / allClicks.length
}


const Statistics = ({ good, neutral, bad, allClicks }) => {

  const total = HistoryVotes(allClicks)
  const average = HistoryAverage(allClicks)
  const positive = AverageVotesGood(allClicks)

  if (allClicks.length === 0) {
    return <p>No feedback given</p>
  }

  /* CUERPO DE COMPONENTE SIN TABLA
  
  return (
    <>
      <StatisticLine name='good' value={good} />
      <StatisticLine name='neutral' value={neutral} />
      <StatisticLine name='bad' value={bad} />
      <HistoryVotes allClicks={allClicks} />
      <HistoryAverage allClicks={allClicks} />
      <AverageVotesGood allClicks={allClicks} />
    </>
  )
  
  */

  return (
    <table>
      <tbody>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{total}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{average.toFixed(1)}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{positive.toFixed(1)} %</td>
        </tr>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])


  const handleGoodClick = () => {
    setAll(allClicks.concat('G'))
    const updatedGood = good + 1
    setGood(updatedGood)
    console.log('count good = ', updatedGood)
  }

  const handleNeutralClick = () => {
    setAll(allClicks.concat('N'))
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    console.log('count neutral = ', updatedNeutral)
  }

  const handleBadClick = () => {
    setAll(allClicks.concat('B'))
    const updatedBad = bad + 1
    setBad(updatedBad)
    console.log('count bad = ', updatedBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} allClicks={allClicks} />
    </div>
  )
}

export default App