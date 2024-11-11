import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM


export function BugEdit() {
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const { bugId } = useParams()

    useEffect(() => {
        if (bugId) {
            bugService.getById(bugId).then(bug => setBugToEdit(bug))
        }
    }, [bugId])


    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setBugToEdit(prevBug => ({
            ...prevBug,
            [field]: value,
        }))
    }


    function onSaveBug(ev) {
        ev.preventDefault()
        bugService.save(bugToEdit)
            .then(savedBug => {
                navigate('/bug')
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Cannot add bug', err)
                showErrorMsg('Cannot add bug')
            })
    }

    return (
        <div className="bug-edit">
            <h2>Edit Bug</h2>
            <form onSubmit={onSaveBug}>
                <div>
                    <label>Title:</label>
                    <input
                        name="title"
                        value={bugToEdit.title}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Severity:</label>
                    <input
                        name="severity"
                        value={bugToEdit.severity}
                        onChange={handleChange}
                        type="number"
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={bugToEdit.description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}