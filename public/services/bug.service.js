// import { utilService } from "./util.service"

// const BUG_KEY = 'bugDB'
const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    save,
    remove,
    get,
    getEmptyBug,
    getDefaultFilter,
}

function query(filterBy = {}) {

    return axios
        .get(BASE_URL, { params: filterBy })
        .then((res) => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.minSeverity) {
                bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
            }
            if (filterBy.labels && filterBy.labels.length) {
                bugs = bugs.filter((bug) => filterBy.labels.some((label) => bug.labels.includes(label)))
            }
            return bugs
        })

}
function get(bugId) {
    return axios.get(BASE_URL + bugId).then((res) => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then((res) => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios
            .put(BASE_URL + bug._id, bug)
            .then((res) => res.data)
            .catch((err) => {
                console.log('err:', err)
                throw err
            })
    } else {
        return axios
            .post(BASE_URL, bug)
            .then((res) => res.data)
            .catch((err) => {
                console.log('err:', err)
                throw err
            })
    }
}

function getEmptyBug(title = '', severity = '') {
    return { title, severity }
}

function getDefaultFilter() {
    return { title: '', minSeverity: 0, labels: []}
}

function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const minSeverity = searchParams.get('minSeverity') || ''
    return {
        txt,
        minSeverity
    }
}
