import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.local.js'

const BUG_KEY = 'bugDB'

export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
    getSeverityStats,
    getTitleStats
}


function query() {
    return storageService.query(BUG_KEY)
}

function get(bugId) {
    return storageService.get(BUG_KEY, bugId)
}

function remove(bugId) {
    return storageService.remove(BUG_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(BUG_KEY, bug)
    } else {
        bug.owner = userService.getLoggedinUser()
        return storageService.post(BUG_KEY, bug)
    }
}

function getEmptyBug() {
    return {
        title: '',
        severity: 1,
        description: ''
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        severity: '',
        // labels: '',
        pageIdx: 0,
        sortBy: {
            type: 'title', desc: 1

        }
    }
}
