const { useState, useEffect } = React
const { Link } = ReactRouterDOM

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState(bugService.getDefaultSortBy())

    useEffect(() => {
        loadBugs()
        console.log(filterBy, sortBy);

    }, [filterBy, sortBy])

    function loadBugs() {
        bugService
            .query(filterBy, sortBy)
            .then(setBugs)
            .catch((err) => {
                showErrorMsg('cant load bugs')
                console.error(err)
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
        }
        bugService
            .save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs(prevBugs => [...prevBugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('from add bug', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                setBugs(prevBugs =>
                    prevBugs.map(currBug =>
                        currBug._id === savedBug._id ? savedBug : currBug
                    )
                )
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('from edit bug', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onDownloadPdf() {
        window.open('/pdf', '_blank');
    }

    function onSetFilter(filterBy) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
    }

    function onSetSort(sortBy) {
        setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            pageIdx: prevFilter.pageIdx + diff < 0 ? 0 : prevFilter.pageIdx + diff,
        }))
    }

    return (
        <div>
            <main className="main-layout">
                <div className="content-layout">
                    <div>
                        <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
                        <BugSort onSetSort={onSetSort} sortBy={sortBy} />
                        <button className="btn" onClick={onAddBug}>
                            Add Bug ⛐
                        </button>
                        <button className="btn" onClick={onDownloadPdf}>Download PDF</button>
                    </div>

                    <div className="bug-list-container">
                    <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                        <div className="paging flex">
                            <button
                                className="btn"
                                onClick={() => onChangePageIdx(-1)}
                                disabled={filterBy.pageIdx <= 0}
                            >
                                Previous
                            </button>
                            <span>{filterBy.pageIdx + 1}</span>
                            <button
                                className="btn"
                                onClick={() => onChangePageIdx(1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
