import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';

import { bugService } from './services/bug.service.js';
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
        labels: req.query.labels || ''
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
        .save(bugToSave)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot add bug', err)
            res.status(500).send('Cannot add bug', err)
        })
})

// Delete
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService
        .remove(bugId)
        .then(() => res.send(bugId + ' Removed Successfully!'))
        .catch((err) => {
            loggerService.error('cannot remove bug', err)
            res.status(500).send('cannot remove bug')
        })
})

// Create
app.post('/api/bug', (req, res) => {
    const bug = req.body
    bugService.save(bug)
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
    const bug = req.body
    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot update bug', err)
            res.status(500).send('Cannot update bug', err)
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

app.get('/api/logs', (req, res) => {
    const path = process.cwd()
    res.sendFile(path + '/logs/backend.log')
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
// app.get('/', (req, res) => res.send('Hello there'))

app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))