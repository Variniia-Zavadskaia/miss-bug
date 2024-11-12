import fs from 'fs'

import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}
const PAGE_SIZE = 5
const bugs = utilService.readJsonFile('data/bug.json')


function query(filterBy = { txt: '', severity: 0, sortBy: { type: 'title', desc: 1 } }) {
    // if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        var bugsToReturn = bugs.filter(bug => regex.test(bug.title))
    // }

    if (filterBy.severity) {
        bugsToReturn = bugs.filter(bug => bug.severity > filterBy.severity)
    }

    // if (filterBy.labels) {
    //     const labelsToFilter = filterBy.labels
    //     bugs = bugs.filter((bug) =>
    //         labelsToFilter.every((label) => bug.labels.includes(label))
    //     )
    // }

    // sort
    const sortBy = filterBy.sortBy
    if (sortBy.type === 'title') {
        bugsToReturn.sort((b1, b2) => (sortBy.desc) * (b1.title.localeCompare(b2.title)))
    }
    if (sortBy.type === 'createdAt') {
        bugsToReturn.sort((b1, b2) => (sortBy.desc) * (b1.createdAt - b2.createdAt))
    }
    if (sortBy.type === 'severity') {
        bugsToReturn.sort((b1, b2) => (sortBy.desc) * (b1.severity - b2.severity))
    }

    // Pagination
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE;
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('No bug found')
    else return Promise.resolve(bug)
}

function remove(bugId, userId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No bug found')
        bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[idx] = bug
    } else {
        bug.createdAt = Date.now()
        bug.labels = ['critical', 'need-CR']
        bug._id = _makeId()
        // bug.description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, earum sed corrupti voluptatum voluptatem at.'
        bugs.push(bug)

    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/bug.json', JSON.stringify(bugs, null, 2), (err) => {
            if (err) {
                console.log(err);
                reject('Cannot write to file')
            } else {
                // console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}
