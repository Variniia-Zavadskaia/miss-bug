import fs from 'fs'
import { utilService } from './util.service.js'

const PAGE_SIZE = 3

const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy = {}) {
    let filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.title))
    }
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter((bug) => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels && filterBy.labels.length) {
        filteredBugs = filteredBugs.filter((bug) => filterBy.labels.some((label) => bug.labels.includes(label)))
    }

   
    return Promise.resolve(filteredBugs)
}

// function getNextBug(bugs) {
//     bugs.forEach((bug, idx) => {
//         bug.prevId = bugs[idx - 1] ? bugs[idx - 1]._id : bugs[bugs.length - 1]._id
//         bug.nextId = bugs[idx + 1] ? bugs[idx + 1]._id : bugs[0]._id
//     });
// }

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    bug = _setNextPrevBugId(bug)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)

        bugToSave = { ...bugs[bugIdx], ...bugToSave, updateAt: Date.now() }
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

function _setNextPrevBugId(bug) {
    const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
    const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
    const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
    bug.nextBugId = nextBug._id
    bug.prevBugId = prevBug._id
    return bug
}