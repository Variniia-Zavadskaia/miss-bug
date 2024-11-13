// import { utilService } from "./util.service"

// const BUG_KEY = 'bugDB'
const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    save,
    remove,
    get,
    getEmptyBug,
    getDefaultFilter
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}
function get(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    console.log(bug);
    const method = bug._id ? 'put' : 'post'

    return axios[method](BASE_URL + ((method === 'put') ? bug._id : ''), bug)
        .then(res => res.data)
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

