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

// Middleware to manage visited bugs
function manageVisitedBugs(req, res, next) {
    const { bugId } = req.params;
    let visitedBugs = req.cookies.visitedBugs || [];

    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId);
    }
    if (visitedBugs.length > 3) {
        loggerService.error(`User visited more than 3 bugs: ${visitedBugs}`);
        return res.status(401).send('Wait for a bit');
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 60 * 60 });
    next();
}

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0
    }

    bugService
        .query(filterBy)
        .then((bugs) => res.send(bugs))
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

app.post('/api/bug', (req, res) => {
    const bugToSave = req.body

    bugService
        .save(bugToSave)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot add bug', err)
            res.status(500).send('Cannot add bug', err)
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot update bug', err)
            res.status(500).send('Cannot update bug', err)
        })
})

app.get('/api/bug/:bugId', manageVisitedBugs, (req, res) => {
    const { bugId } = req.params;

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err);
            res.status(500).send('Cannot get bug');
        });
})

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


const port = 3030
// app.get('/', (req, res) => res.send('Hello there'))

app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))