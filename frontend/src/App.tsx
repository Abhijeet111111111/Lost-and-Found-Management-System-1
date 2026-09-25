import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Board from "./pages/Board";
import Report from "./pages/Report";
import Claim from "./pages/Claims";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import { useAuth } from "./context/authContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 font-sans relative">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  const { logout } = useAuth();
  // logout();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/report" element={<Report />} />
          <Route path="/claim/:id" element={<Claim />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}
