import { UserPreview } from './UserPrewiew.jsx'

export function UserList({ users, onRemoveUser }) {
    console.log(users);

    return (
        <ul className="user-list cards grid">
            {users.map(user => (
                <UserPreview
                    key={user._id}
                    user={user}
                    onRemoveUser={onRemoveUser} />
            ))}
        </ul>
    )
}