import "./index.css";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Board from "./pages/Board";
import Navbar from "./components/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ProjectDetailPage from "./pages/ProjectDetailPage";

const PrivateRoute = ({ children }) => {
  const { auth } = store.getState().auth;
  return auth ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/board"
          element={
            <PrivateRoute>
              <Board />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <PrivateRoute>
              <ProjectDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>
      <Toaster />
    </Provider>
  </BrowserRouter>
);
