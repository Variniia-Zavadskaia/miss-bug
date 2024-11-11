const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    return (
        <section className="bug-list grid cards">
            {bugs.map(bug => (
                <article className="bug-preview card" key={bug._id}>
                    <BugPreview bug={bug} />
                    <div className="flex space-between">
                        <Link className="btn" to={`/bug/edit/${bug._id}`}>
                            Edit
                        </Link>
                        <button className="btn" onClick={() => onRemoveBug(bug._id)}>
                            Delete
                        </button>
                        <Link className="btn" to={`/bug/${bug._id}`}>
                            Details
                        </Link>
                    </div>
                </article>
            ))}
        </section>
    )
}
