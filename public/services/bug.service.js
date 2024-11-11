// import { utilService } from "./util.service"

// const BUG_KEY = 'bugDB'
const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    save,
    remove,
    getById,
    getEmptyBug
}

function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
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
    return { txt: '', severity: '', labels: '', pageIdx: 0, sortBy: { type: 'title', desc: 1 } }
}

