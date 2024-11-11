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

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService
            .query(filterBy)
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

    // function onAddBug() {
    //     const bug = {
    //         title: prompt('Bug title?'),
    //         severity: +prompt('Bug severity?')
    //     }
    //     bugService
    //         .save(bug)
    //         .then((savedBug) => {
    //             console.log('Added Bug', savedBug)
    //             setBugs([...bugs, savedBug])
    //             showSuccessMsg('Bug added')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onAddBug ->', err)
    //             showErrorMsg('Cannot add bug')
    //         })
    // }

    // function onEditBug(bug) {
    //     const severity = +prompt('New severity?', bug._id ? bug.severity : '')
    //     const description = prompt('Edit Desctiption', bug._id ? bug.description : '')
    //     const bugToSave = { ...bug, severity, description }
    //     bugService
    //         .save(bugToSave)
    //         .then((savedBug) => {
    //             console.log('Updated Bug:', savedBug)
    //             const bugsToUpdate = bugs.map((currBug) => (currBug._id === savedBug._id ? savedBug : currBug))
    //             setBugs(bugsToUpdate)
    //             showSuccessMsg('Bug updated')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onEditBug ->', err)
    //             showErrorMsg('Cannot update bug')
    //         })
    // }

    function onDownloadPdf() {
        // bugService
        //   .downloadPdf()
        //   .then(() => {
        //     console.log('PDF Downloaded')
        //   })
        //   .catch((err) => {
        //     console.error('Failed to generate PDF:', err)
        //   })
        window.open('/pdf', '_blank');
    }

    function onSetFilter(filterBy) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
    }

    function onSetSort(sortBy) {
        // setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
        setFilterBy(prevFilter => ({
            ...prevFilter,
            sortBy: { ...prevFilter.sortBy, ...sortBy }
        }))
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
                <BugFilter onSetFilter={onSetFilter} filterBy={{ ...filterBy }} />
                <BugSort onSetSort={onSetSort} sortBy={{ ...filterBy.sortBy }} />
                <button className="btn" >
                    <Link to="/bug/edit">Add Bug ⛐</Link>
                </button>
                <button onClick={onDownloadPdf}>Download PDF</button>

                <main>
                    <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
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
                </main>
            </main>
        </div>
    )
}
