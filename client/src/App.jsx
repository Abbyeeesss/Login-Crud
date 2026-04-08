import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPages from "./pages/RegisterPages";
import LoginPages from "./pages/LoginPages";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />
          <Route path="/tasks" element={<h1>Tasks</h1>} />
          <Route path="/add-tasks" element={<h1>Add Tasks</h1>} />
          <Route path="/tasks/:id" element={<h1>Update Tasks</h1>} />
          <Route path="/profile" element={<h1>Profile</h1>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;