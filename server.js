import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';

import { bugService } from './services/bug.service.js';
import { userService } from './services/user.service.js';
import { loggerService } from "./services/logger.service.js";
import { pdfService } from './services/pdf.service.js';

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// List
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || 0,
        // labels: req.query.labels || ''
    }
    if (req.query.pageIdx) filterBy.pageIdx = req.query.pageIdx
    if (req.query.sortBy) filterBy.sortBy = JSON.parse(req.query.sortBy)

    bugService
        .query(filterBy)
        .then((bugs) => res.send(bugs))
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})
// Read
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugIds = req.cookies.visitedBugIds || []
    if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)
    if (visitedBugIds.length > 3) return res.status(401).send('Wait for a bit')
    res.cookie('visitedBugIds', visitedBugIds, { maxAge: 1000 * 60 * 3 })

    bugService
        .getById(bugId)
        .then((bug) => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug', err)
        })
})

// Create
app.post('/api/bug', (req, res) => {
    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Unauthenticated')

    const bug = {
        txt: req.query.txt,
        severity: +req.query.severity
    }
    bugService.save(bug, user)
        .then((addedBug) => {
            res.send(addedBug)
        })
        .catch((err) => {
            loggerService.error('Had issues adding:', err)
            res.status(500).send('Had issues adding:', err)
        })
})

// Update
app.put('/api/bug', (req, res) => {
    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Unauthenticated')

    const bug = {
        _id: req.params.id,
        txt: req.query.txt,
        severity: +req.query.severity,
        owner: req.body.owner,
    }
    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Had issues editing:', err)
            res.status(500).send('Had issues editing:', err)
        })
})

// Delete
app.delete('/api/bug/:bugId', (req, res) => {
    const user = userService.validateToken(req.cookies.loginToken)
    if (!user) return res.status(401).send('Unauthenticated')

    const { bugId } = req.params
    bugService
        .remove(bugId)
        .then(() => res.send(bugId + ' Removed Successfully!'))
        .catch((err) => {
            loggerService.error('cannot remove bug', err)
            res.status(500).send('cannot remove bug')
        })
})

app.get('/pdf', (req, res) => {
    const path = './pdfs/'

    bugService.query().then(bugs => {
        bugs.sort((a, b) => b.createdAt - a.createdAt)
        const rows = bugs.map(({ title, description, severity }) => [title, description, severity])
        const headers = ['Title', 'Description', 'Severity']
        const fileName = 'bugs'

        pdfService.createPdf({ headers, rows, title: 'Bugs report', fileName }).then(() => {
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(`${process.cwd()}/pdfs/${fileName}.pdf`);
        }).catch(err => {
            loggerService.error('Cannot download PDF', err);
            res.status(500).send('We have a problem, try again soon');
        })
    })
})

// User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

// Auth API
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(404).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/api/logs', (req, res) => {
    const path = process.cwd()
    res.sendFile(path + '/logs/backend.log')
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)