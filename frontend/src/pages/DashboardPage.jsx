import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCheck,
  ChevronDown,
  Clock3,
  ListFilter,
  ListTodo,
  Plus,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import SkeletonTaskCard from "../components/SkeletonTaskCard";
import StatsCard from "../components/StatsCard";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import { getApiErrorMessage } from "../utils/apiError";

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    sort: "newest"
  });
  const deferredSearch = useDeferredValue(filters.search);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const overdue = tasks.filter(
      (task) => task.dueDate && task.status !== "completed" && new Date(task.dueDate) < new Date()
    ).length;
    const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    const highPriorityOpen = tasks.filter(
      (task) => task.priority === "high" && task.status !== "completed"
    ).length;

    return {
      completed,
      overdue,
      completionRate,
      highPriorityOpen
    };
  }, [tasks]);

  const recentActivity = useMemo(
    () => [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5),
    [tasks]
  );

  const loadTasks = async () => {
    try {
      const { data } = await api.get("/tasks", {
        params: {
          ...filters,
          search: deferredSearch
        }
      });
      setTasks(data.tasks);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load tasks."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadTasks();
  }, [deferredSearch, filters.priority, filters.sort, filters.status]);

  const handleCreateClick = () => {
    setActiveTask(null);
    setOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);

    try {
      if (activeTask) {
        const { data } = await api.patch(`/tasks/${activeTask._id}`, payload);
        setTasks((current) =>
          current.map((task) => (task._id === activeTask._id ? data.task : task))
        );
        toast.success("Task updated.");
      } else {
        const { data } = await api.post("/tasks", payload);
        setTasks((current) => [data.task, ...current]);
        toast.success("Task created.");
      }

      setOpen(false);
      setActiveTask(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save task."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task) => {
    if (!task) {
      return;
    }

    setDeleteLoading(true);

    try {
      await api.delete(`/tasks/${task._id}`);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      toast.success("Task deleted.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete task."));
    } finally {
      setDeleteLoading(false);
      setDeleteTask(null);
    }
  };

  const handleEdit = (task) => {
    setActiveTask(task);
    setOpen(true);
  };

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] glass-panel p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-brand-300">TaskFlow Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-[2.4rem]">{user?.name}</h1>
          </div>

          <button
            type="button"
            onClick={handleCreateClick}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            icon={ListTodo}
            label="Total tasks"
            value={tasks.length}
            iconClassName="text-sky-300"
          />
          <StatsCard
            icon={CheckCheck}
            label="Completed"
            value={stats.completed}
            hint={`${stats.completionRate}%`}
            iconClassName="text-emerald-300"
          />
          <StatsCard
            icon={AlertTriangle}
            label="Overdue"
            value={stats.overdue}
            iconClassName="text-rose-300"
          />
          <StatsCard
            icon={ShieldCheck}
            label="Role"
            value={user?.role}
            hint={stats.highPriorityOpen ? `${stats.highPriorityOpen} high priority` : ""}
            iconClassName="text-amber-300"
          />
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] glass-panel p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
              <label className="relative flex w-full items-center lg:min-w-[320px] lg:flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={filters.search}
                  onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                  placeholder="Search title or description"
                  type="text"
                  className="w-full min-w-0 h-12 rounded-2xl border border-white/10 bg-slate-950/75 pl-12 pr-4 text-sm leading-none text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-brand-400 focus:bg-slate-950/95"
                />
              </label>

              <label className="block w-full sm:w-auto sm:min-w-fit sm:flex-shrink-0">
                <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                  <ListFilter className="h-3.5 w-3.5" />
                  Status
                </span>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={filters.status}
                    onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                    className="h-11 w-full min-w-[140px] appearance-none whitespace-nowrap rounded-2xl border border-white/10 bg-slate-950/75 pl-4 pr-10 text-left text-[0.95rem] leading-none text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950/95 sm:w-auto sm:min-w-fit sm:flex-shrink-0"
                  >
                    <option value="all">All Status</option>
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>

              <label className="block w-full sm:w-auto sm:min-w-fit sm:flex-shrink-0">
                <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  Priority
                </span>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={filters.priority}
                    onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}
                    className="h-11 w-full min-w-[140px] appearance-none whitespace-nowrap rounded-2xl border border-white/10 bg-slate-950/75 pl-4 pr-10 text-left text-[0.95rem] leading-none text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950/95 sm:w-auto sm:min-w-fit sm:flex-shrink-0"
                  >
                    <option value="all">All priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>

              <label className="block w-full sm:w-auto sm:min-w-fit sm:flex-shrink-0">
                <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort
                </span>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={filters.sort}
                    onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
                    className="h-11 w-full min-w-[140px] appearance-none whitespace-nowrap rounded-2xl border border-white/10 bg-slate-950/75 pl-4 pr-10 text-left text-[0.95rem] leading-none text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950/95 sm:w-auto sm:min-w-fit sm:flex-shrink-0"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="dueDate">Due date</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonTaskCard key={index} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description=""
              action={
                <button
                  type="button"
                  onClick={handleCreateClick}
                  className="btn btn-primary"
                >
                  Create Task
                </button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={setDeleteTask} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] glass-panel p-6">
            <div className="flex items-center gap-3">
              <CheckCheck className="h-5 w-5 text-emerald-300" />
              <h2 className="text-xl font-semibold text-white">Overview</h2>
            </div>
            <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm font-medium text-slate-400">Completion</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">{stats.completionRate}%</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-sky-300 transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              {stats.overdue ? <p className="mt-4 text-sm text-slate-500">{stats.overdue} overdue</p> : null}
            </div>
          </div>

          <div className="rounded-[2rem] glass-panel p-6">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-sky-300" />
              <h2 className="text-xl font-semibold text-white">Recent activity</h2>
            </div>
            <div className="mt-6 space-y-4">
              {recentActivity.length ? (
                recentActivity.map((task) => (
                  <div key={task._id} className="rounded-[1.35rem] border border-white/10 bg-slate-950/55 p-4 transition hover:border-white/16">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-white">{task.title}</h3>
                      <span className="text-xs uppercase tracking-[0.25em] text-slate-500">{task.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      Updated {new Date(task.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recent activity.</p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <TaskModal
        open={open}
        onClose={() => {
          setOpen(false);
          setActiveTask(null);
        }}
        onSubmit={handleSubmit}
        task={activeTask}
        submitting={submitting}
      />

      <ConfirmModal
        open={Boolean(deleteTask)}
        onClose={() => setDeleteTask(null)}
        onConfirm={() => handleDelete(deleteTask)}
        title="Delete this task?"
        description="This removes the task permanently from your workflow."
        confirmLabel="Delete task"
        loading={deleteLoading}
      />
    </div>
  );
};

export default DashboardPage;
