const { useEffect, useState } = React
import { LabelSelector } from './LabelSelect.jsx'

export function BugFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            [field]: value,
        }))
    }

    function onLabelChange(selectedLabels) {
        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            labels: selectedLabels,
        }))
    }

    const { severity, txt, label } = filterBy

    return (
        <form className="bug-filter">
            <h3>Filter Bugs</h3>
            <input
                className="filter-input"
                type="text"
                id="txt"
                name="txt"
                value={txt}
                placeholder="Enter text here..."
                onChange={handleChange}
            />
            <input
                placeholder="Enter severity here.."
                className="filter-input"
                type="text"
                id="severity"
                name="severity"
                value={severity}
                onChange={handleChange}
            />
            <LabelSelector onLabelChange={onLabelChange} />
        </form>
    )
}
