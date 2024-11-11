const { Link, useParams } = ReactRouterDOM
const { useState, useEffect } = React
import { bugService } from '../services/bug.service.js'

export function BugDetails() {
    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService
            .getById(bugId)
            .then(setBug)
            .catch((err) => {
                console.log('Error is:', err)
            })
    }, [])

    if (!bug) return <div>Loading...</div>
    return (
        <div className='bug-details'>
            <h3>Bug Details 🐛</h3>
            <h4>{bug.title}</h4>
            <p>
                <b>Severity:</b> <span>{bug.severity}</span>
            </p>
            <p><b>Description:</b> <span>{bug.description}</span></p>
            <p><b>Created at:</b> <span>{new Date(bug.createdAt).toDateString()}</span></p>
            <p><b>Lables:</b> <span>{bug.labels.join(', ')}</span></p>
            <Link to="/bug">Back to List</Link>
        </div>
    )
}

