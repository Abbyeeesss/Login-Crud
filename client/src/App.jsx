import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPages from "./pages/RegisterPages";
import LoginPages from "./pages/LoginPages";
import TasksPages from "./pages/TasksPages";
import EditPage from "./pages/EditPage";
import DeletePage from "./pages/DeletePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/tasks" element={<TasksPages />} />
            <Route path="/tasks/:id/edit" element={<EditPage />} />
            <Route path="/tasks/:id/delete" element={<DeletePage />} />
            <Route path="/add-tasks" element={<Navigate to="/tasks" replace />} />
            <Route path="/profile" element={<h1>Profile</h1>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;