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


function query(filterBy = { txt: '', severity: 0, userId: '' }, sortBy = { type: '', desc: 1 }) {
    var bugsToReturn = bugs

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugs.filter(bug => regex.test(bug.title))
    }

    if (filterBy.severity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity > filterBy.severity)
    }

    console.log('filterBy.userId:', filterBy.userId)

    if (filterBy.userId) {
        bugsToReturn = bugsToReturn.filter((bug) => bug.creator._id === filterBy.userId)
    }

    if (filterBy.labels) {
        const labelsToFilter = filterBy.labels
        bugsToReturn = bugsToReturn.filter((bug) =>
            labelsToFilter.some((label) => bug.labels.includes(label))
        )
    }

    // sort
    // const sortBy = filterBy.sortBy
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
    return Promise.resolve(bug)
}

function remove(bugId, user) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No bug found')

    if (!user.isAdmin && bugs[idx].owner._id !== user._id) return Promise.reject('Not your bug')

    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, user) {
    if (bug._id) {
        if (!user.isAdmin && bug.owner._id !== user._id) return Promise.reject('Not your bug')

        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        bugToUpdate.title = bug.title
        bugToUpdate.severity = bug.severity
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bug.owner = user
        // bug.labels = ['critical', 'need-CR']
        // bug.description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, earum sed corrupti voluptatum voluptatem at.'
        bugs.push(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/bug.json', JSON.stringify(bugs, null, 2), (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
