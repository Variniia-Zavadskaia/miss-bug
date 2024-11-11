import { eventBusService } from '../services/event-bus.service.js'
const { useState, useEffect } = React

export function UserMsg() {
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        // Here we listen to the event that we emited, its important to remove the listener
        const removeEvent = eventBusService.on('show-user-msg', (msg) => {
            setMsg(msg)
            setTimeout(() => {
                setMsg(null)
            }, 2500)
        })

        return () => removeEvent()
    }, [])

    if (!msg || !msg.txt) return <span></span>
    const msgClass = msg.type || ''
    return (
        <section className={'user-msg ' + msgClass}>
            <button
                onClick={() => {
                    setMsg(null)
                }}
            >
                x
            </button>
            {msg.txt}
        </section>
    )
}
