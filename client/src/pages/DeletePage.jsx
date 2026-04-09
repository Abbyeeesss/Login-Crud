import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteTaskRequest, getTaskRequest } from "../api/tasks";

function DeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [task, setTask] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadError(null);
      setLoading(true);
      try {
        const res = await getTaskRequest(id);
        if (!cancelled) setTask(res.data);
      } catch {
        if (!cancelled) setLoadError("Could not load this task.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const onConfirmDelete = async () => {
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteTaskRequest(id);
      navigate("/tasks", { replace: true });
    } catch {
      setDeleteError("Could not delete the task.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-zinc-900 text-white">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/tasks"
            className="text-sm text-zinc-400 hover:text-white shrink-0"
          >
            ← Back to tasks
          </Link>
          <h1 className="text-lg font-semibold truncate">Delete task</h1>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white shrink-0"
        >
          Logout
        </button>
      </header>

      <div className="center-container py-10">
        {loading && (
          <p className="text-zinc-400 text-center">Loading…</p>
        )}
        {!loading && loadError && (
          <div className="max-w-md mx-auto text-center">
            <p className="text-red-400 mb-4">{loadError}</p>
            <Link to="/tasks" className="text-violet-400 hover:text-violet-300">
              Back to tasks
            </Link>
          </div>
        )}
        {!loading && !loadError && task && (
          <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md mx-auto border border-red-900/30">
            <p className="text-zinc-300 text-sm mb-6">
              This action cannot be undone. The following task will be removed
              permanently.
            </p>
            {deleteError && (
              <div className="bg-red-500 p-2 text-white my-2 rounded-md text-sm">
                {deleteError}
              </div>
            )}
            <div className="rounded-md bg-zinc-900/80 p-4 border border-zinc-700">
              <p className="font-medium text-white">{task.title}</p>
              {task.description && (
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  {task.description}
                </p>
              )}
              {task.date && (
                <p className="text-zinc-500 text-xs mt-3">
                  {new Date(task.date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-8 justify-end">
              <button
                type="button"
                onClick={() => navigate("/tasks")}
                disabled={deleting}
                className="px-4 py-2 rounded-md text-zinc-300 hover:bg-zinc-700 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-4 py-2 rounded-md text-white"
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeletePage;
