import { CalendarClock, CheckCircle2, CircleDashed, Pencil, Sparkles, Trash2 } from "lucide-react";

const statusStyles = {
  todo: "bg-slate-800 text-slate-300",
  "in-progress": "bg-blue-500/15 text-blue-300",
  completed: "bg-emerald-500/15 text-emerald-300"
};

const priorityStyles = {
  low: "text-sky-300",
  medium: "text-amber-300",
  high: "text-rose-300"
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && task.status !== "completed" && new Date(task.dueDate) < new Date();

  return (
    <article
      className={`group rounded-[1.6rem] border bg-slate-950/60 p-5 shadow-glass transition duration-300 hover:-translate-y-1.5 hover:border-white/18 hover:bg-slate-950/75 ${
        task.status === "completed"
          ? "border-brand-400/30 task-complete-glow"
          : isOverdue
            ? "border-rose-500/30"
            : "border-white/10"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${statusStyles[task.status]}`}>
              {task.status}
            </span>
            <span className={`inline-flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${priorityStyles[task.priority]}`}>
              <Sparkles className="h-3 w-3" />
              {task.priority}
            </span>
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">{task.title}</h3>
        </div>
        {task.status === "completed" ? (
          <CheckCircle2 className="h-6 w-6 text-brand-400" />
        ) : (
          <CircleDashed className="h-6 w-6 text-slate-600 transition group-hover:text-slate-400" />
        )}
      </div>

      <p className="min-h-16 text-sm leading-6 text-slate-400">{task.description || "No description."}</p>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-400">
        <div className={`flex items-center gap-2 ${isOverdue ? "text-rose-300" : ""}`}>
          <CalendarClock className="h-4 w-4" />
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-brand-400/40 hover:bg-brand-400/10 hover:text-brand-300"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
