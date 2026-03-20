export function Toasts({ toasts }) {
    if (!Array.isArray(toasts) || toasts.length === 0) {
        return null
    }

    return (
        <div className="ui-toast-wrap">
            {toasts.map((toast) => (
                <article key={toast.id} className="ui-toast" data-type={toast.type || 'info'}>
                    {toast.message || ''}
                </article>
            ))}
        </div>
    )
}
