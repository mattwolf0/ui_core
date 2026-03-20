import { UI_CONFIG } from '../../config/uiConfig.js'

export function Modal({ modal, onCancel, onConfirm, onInputChange }) {
    if (!modal?.open) {
        return null
    }

    // Treat dialog as confirm so callers can use either modal shape.
    const modalKind = modal.kind === 'dialog' ? 'confirm' : modal.kind
    return (
        <div className="ui-modal" data-modal-open="true">
            <section className="ui-modal-card">
                <h2 className="ui-modal-title">{modal.title ?? 'Confirm Request'}</h2>
                <p className="ui-modal-body">{modal.body ?? 'Check this before sending.'}</p>
                {modalKind === 'prompt' ? (
                    <label className="ui-form-row">
                        <span className="ui-form-label">{modal.inputLabel ?? 'Input'}</span>
                        <input
                            className="ui-input ui-input-block"
                            type={modal.inputType === 'number' ? 'number' : 'text'}
                            value={modal.inputValue ?? ''}
                            placeholder={modal.inputPlaceholder ?? ''}
                            maxLength={modal.maxLength ?? UI_CONFIG.text.modalInputMaxLength}
                            onChange={(event) => onInputChange(event.target.value)}
                            autoFocus
                        />
                    </label>
                ) : null}
                <div className="ui-modal-actions">
                    <button type="button" className="ui-btn ui-btn-ghost" onClick={onCancel}>
                        {modal.cancelLabel ?? 'Cancel'}
                    </button>
                    <button type="button" className="ui-btn ui-btn-primary" onClick={onConfirm}>
                        {modal.confirmLabel ?? 'Confirm'}
                    </button>
                </div>
            </section>
        </div>
    )
}
