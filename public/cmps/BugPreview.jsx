import { utilService } from "../../services/util.service"
const { useState, useEffect } = React

export function BugPreview({ bug }) {
    const [randomImgNumber, setRandomImgNumber] = useState(1)

    useEffect(() => {
        setRandomImgNumber(utilService.getRandomIntInclusive(1, 9))
    }, [bug])

    const imgSrc = `assets/img/bugs/bug${randomImgNumber}.jpg`

    return (
        <section className="bug-preview">
            <h4>{bug.title}</h4>
            <img src={imgSrc} alt={`Bug`} />
            <p>
                Severity: <span>{bug.severity}</span>
            </p>
            <p>
                Owner ID: <span>{bug.ownerId}</span>
            </p>
            <p>
                Created at: <span>{new Date(bug.createdAt).toDateString()}</span>
            </p>

        </section>
    )
}