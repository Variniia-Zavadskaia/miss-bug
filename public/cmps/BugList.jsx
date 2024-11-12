const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.local.js'

export function BugList({ bugs, onRemoveBug }) {
    const user = userService.getLoggedinUser()

    function isAllowed(bug) {
        if (user.isAdmin) return true
        if (!user) return false
        if (user._id !== bug.owner._id) return false

        return true
    }
    return (
        <section className="bug-list grid cards">
            {bugs.map(bug => (
                <article className="bug-preview card" key={bug._id}>
                    <BugPreview bug={bug} />
                    <div className="flex space-between">
                        <button>
                            <Link className="btn" to={`/bug/${bug._id}`}>
                                Details
                            </Link>
                        </button>
                        {isAllowed(bug) && <div>
                            <button>
                                <Link className="btn" to={`/bug/edit/${bug._id}`}>
                                    Edit
                                </Link>
                            </button>
                            <button className="btn" onClick={() => onRemoveBug(bug._id)}>
                                Delete
                            </button>
                        </div>}
                    </div>
                </article>
            ))}
        </section>
    )
}
