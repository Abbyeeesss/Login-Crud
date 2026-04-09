import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTaskRequest, updateTaskRequest } from "../api/tasks";

function toDateInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: "", description: "", date: "" },
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadError(null);
      setLoading(true);
      try {
        const res = await getTaskRequest(id);
        if (cancelled) return;
        const t = res.data;
        reset({
          title: t.title ?? "",
          description: t.description ?? "",
          date: toDateInputValue(t.date),
        });
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
  }, [id, reset]);

  const onSave = handleSubmit(async (data) => {
    setSaveError(null);
    const payload = {
      title: data.title,
      description: data.description,
      ...(data.date ? { date: data.date } : {}),
    };
    try {
      await updateTaskRequest(id, payload);
      navigate("/tasks", { replace: true });
    } catch (err) {
      const msg = err.response?.data;
      if (Array.isArray(msg)) setSaveError(msg.join(" "));
      else if (msg?.message) setSaveError(msg.message);
      else setSaveError("Could not save the task.");
    }
  });

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
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
          <h1 className="text-lg font-semibold truncate">Edit task</h1>
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
        {!loading && !loadError && (
          <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md mx-auto">
            {saveError && (
              <div className="bg-red-500 p-2 text-white my-2 rounded-md text-sm">
                {saveError}
              </div>
            )}
            <form onSubmit={onSave}>
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

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/tasks")}
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
        )}
      </div>
    </div>
  );
}

export default EditPage;
