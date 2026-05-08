import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import ModalShell from "./ModalShell";
import { validateTask } from "../utils/validation";

const defaultForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

const TaskModal = ({ open, onClose, onSubmit, task, submitting }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
      });
      setErrors({});
      return;
    }

    setForm(defaultForm);
    setErrors({});
  }, [task, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateTask(form);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={task ? "Edit Task" : "Create Task"}
      subtitle="Keep your team's work clear, prioritized, and moving."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ship TaskFlow authentication flow"
          required
          error={errors.title}
          maxLength={120}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Add any implementation notes, blockers, or handoff details."
            className={`w-full rounded-2xl border px-4 py-3 text-[0.95rem] text-slate-100 outline-none transition ${
              errors.description
                ? "border-rose-500/70 bg-rose-950/20 focus:border-rose-400"
                : "border-white/10 bg-slate-950/75 focus:border-brand-400 focus:bg-slate-950/95"
            }`}
          />
          {errors.description ? <span className="mt-2 block text-sm text-rose-400">{errors.description}</span> : null}
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Status</span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 text-[0.95rem] text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950/95"
            >
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Priority</span>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 text-[0.95rem] text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950/95"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <FormInput
            label="Due date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full"
        >
          {submitting ? "Saving..." : task ? "Update Task" : "Create Task"}
        </button>
      </form>
    </ModalShell>
  );
};

export default TaskModal;
