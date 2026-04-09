import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTaskRequest, getTaskRequest } from "../api/tasks";

function DeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-8">
      {loading && (
        <p className="text-zinc-400">Loading…</p>
      )}

      {!loading && loadError && (
        <div className="bg-zinc-800 max-w-sm w-full p-8 rounded-md text-center">
          <p className="text-red-400 text-sm mb-4">{loadError}</p>
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            OK
          </button>
        </div>
      )}

      {!loading && !loadError && task && (
        <div className="bg-zinc-800 max-w-sm w-full p-8 rounded-md">
          <p className="text-zinc-300 text-sm mb-4 text-center">
            Do you want to delete it?
          </p>
          <p className="text-white text-center font-medium mb-6 border-b border-zinc-700 pb-4">
            {task.title}
          </p>
          {deleteError && (
            <div className="bg-red-500 p-2 text-white mb-4 rounded-md text-sm text-center">
              {deleteError}
            </div>
          )}
          <div className="flex gap-3 justify-end">
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
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeletePage;
