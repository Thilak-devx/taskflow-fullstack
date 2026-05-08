import ModalShell from "./ModalShell";

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "danger",
  loading = false,
  children
}) => (
  <ModalShell open={open} onClose={onClose} title={title} subtitle={description} width="max-w-xl">
    <div className="space-y-5">
      {children}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
        >
          {loading ? "Working..." : confirmLabel}
        </button>
      </div>
    </div>
  </ModalShell>
);

export default ConfirmModal;
