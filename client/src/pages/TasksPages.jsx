import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
} from "../api/tasks";

function TasksPages() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: "", description: "", date: "" },
  });

  const loadTasks = async () => {
    setLoadError(null);
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch {
      setLoadError("Could not load tasks.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setSaveError(null);
    reset({ title: "", description: "", date: "" });
  };

  const openNewTask = () => {
    setSaveError(null);
    reset({ title: "", description: "", date: "" });
    setShowModal(true);
  };

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const onDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTaskRequest(String(id));
      await loadTasks();
    } catch {
      window.alert("Could not delete the task.");
    }
  };

  const onSaveTask = handleSubmit(async (data) => {
    setSaveError(null);
    const payload = {
      title: data.title,
      description: data.description,
      ...(data.date ? { date: data.date } : {}),
    };
    try {
      await createTaskRequest(payload);
      closeModal();
      await loadTasks();
    } catch (err) {
      const msg = err.response?.data;
      if (Array.isArray(msg)) setSaveError(msg.join(" "));
      else if (msg?.message) setSaveError(msg.message);
      else setSaveError("Could not save the task.");
    }
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-zinc-900 text-white">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openNewTask}
            className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md text-white"
          >
            Add Tasks
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="px-6 py-6 text-white">
        {loadError && (
          <p className="text-red-400 mb-4">{loadError}</p>
        )}
        <ul className="space-y-4 max-w-2xl">
          {tasks.map((t) => (
            <li
              key={t._id}
              className="rounded-lg bg-zinc-900 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-normal text-white">{t.title}</p>
                  <p className="text-zinc-400 text-sm mt-1 leading-relaxed line-clamp-3">
                    {t.description}
                  </p>
                  {t.date && (
                    <p className="text-zinc-500 text-xs mt-2">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2 sm:flex-col sm:items-end">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/tasks/${String(t._id ?? t.id)}/edit`)
                    }
                    className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(t._id)}
                    className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-1.5 text-sm text-red-300 hover:bg-red-950/70"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {tasks.length === 0 && !loadError && (
          <p className="text-zinc-400">No tasks yet. Click Add Tasks.</p>
        )}
      </main>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-task-title"
        >
          <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md border border-zinc-700 shadow-xl">
            <h2
              id="modal-task-title"
              className="text-xl font-semibold my-2 text-white"
            >
              New task
            </h2>
            {saveError && (
              <div className="bg-red-500 p-2 text-white my-2 rounded-md text-sm">
                {saveError}
              </div>
            )}
            <form onSubmit={onSaveTask}>
              <input
                type="text"
                {...register("title", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 border border-zinc-600"
                placeholder="Title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">Title is required</p>
              )}

              <textarea
                {...register("description", { required: true })}
                rows={4}
                className="w-full resize-none bg-zinc-700 text-white px-4 py-2 rounded-md my-2 border border-zinc-600"
                placeholder="Description"
              />
              {errors.description && (
                <p className="text-red-400 text-sm">Description is required</p>
              )}

              <input
                type="date"
                {...register("date")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 border border-zinc-600 [color-scheme:dark]"
              />

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 px-4 py-2 rounded-md text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPages;
