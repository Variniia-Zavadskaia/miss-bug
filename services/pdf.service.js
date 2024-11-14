import PDFDocument from 'pdfkit-table'
import fs from 'fs'

export const pdfService = {
    // createPdf
    buildBugsPDF
}

// function createPdf({ headers, rows, title = 'Table Title', subtitle = 'Some sub title', fileName = 'document' }) {
//     const doc = new PDFDocument({ margin: 30, size: 'A4' })
//     doc.pipe(fs.createWriteStream(`./pdfs/${fileName}.pdf`));


//     const table = {
//         title,
//         subtitle,
//         headers,
//         rows
//     }

//     return doc.table(table).then(() => { doc.end() }).catch((err) => { })
// }

function buildBugsPDF(bugs, filename = 'SaveTheBugs.pdf') {
    const doc = new PDFDocument()

    doc.pipe(fs.createWriteStream(filename))

    bugs.forEach(bug => {
        doc.text(`Bug ID: ${bug._id}`)
        doc.text(`Title: ${bug.title}`)
        doc.text(`Description: ${bug.description}`)
        doc.text(`Severity: ${bug.severity}`)
        doc.addPage()
    })

    doc.end()
}

