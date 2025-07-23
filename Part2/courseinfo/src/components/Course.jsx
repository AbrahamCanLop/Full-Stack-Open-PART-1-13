const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Content = ({ parts }) => (
    <div>
        {parts.map(part => (
            <Part key={part.id} part={part} />
        ))}
    </div>
)

const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <div>
            <p>Number of exercises {totalExercises}</p>
        </div>
    )
}

const Course = ({ course }) => (
    <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

export default Course