export function BugPreview({ bug }) {
    const imgSrc = `https://robohash.org/api/${bug._id}`

    return (
        <section className="bug-preview">
            <h4>{bug.title}</h4>
            <img src={imgSrc} alt={`Bug`} />
            <p>
                Severity: <span>{bug.severity}</span>
            </p>
            <p>
                Owner ID: <span>{bug.creator.fullname}</span>
            </p>
            <p>
                Created at: <span>{new Date(bug.createdAt).toDateString()}</span>
            </p>

        </section>
    )
}