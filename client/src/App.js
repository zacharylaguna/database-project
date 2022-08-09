import logo from './logo.svg';
import './App.css';

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./pages/login/login.js";
import Dashboard from "./pages/dashboard/dashboard.js";
import Tenant from "./pages/tenant/tenant.js";
import Contractor from "./pages/contractor/contractor.js";
import ChangePassword from "./pages/change-password/change-password.js";


function setToken(data) {
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("username", data.username);
  sessionStorage.setItem("role", data.role);
}

function removeToken() {
  console.log("logout");
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('role');
}

function getUsername() {
  const username = sessionStorage.getItem('username');
  return username;
}

function getRole() {
  const role = sessionStorage.getItem('role');
  return role;
}

function isLoggedIn() {
  return sessionStorage.getItem('token');
}

export default function App() {
  return (
    <Router>

      {/* Navigation bar */}
      <header class="p-3 bg-dark">
        <div class="container-fluid">
          <div class="d-flex flex-wrap align-items-center justify-content-between">
            <Link class="navbar-brand text-light" to="/">Real Management</Link>
            {isLoggedIn() ? <div class="dropdown text-end">
              <a href="#" class="d-block link-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {/* Person icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-person-circle rounded-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>
              </a>
              <ul class="dropdown-menu text-small">
                <li><Link class="dropdown-item" to="/change-password">Change password</Link></li>
                <li><Link class="dropdown-item" to="/" onClick={removeToken}>Sign out</Link></li>
              </ul>
            </div> : ""}
          </div>
        </div>
      </header>

      {/* Main area of each page */}
      <main class="col-lg-8 mx-auto p-3 py-md-5">
        <Routes>
          <Route path="/" element={<Login setToken={setToken} getUsername={getUsername} />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tenant" element={<Tenant getUsername={getUsername} />} />
          <Route path="contractor" element={<Contractor />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Routes>
      </main>

    </Router>
  );
}
