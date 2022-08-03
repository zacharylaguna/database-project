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

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
  
  const token = getToken();
  
  return (
    <Router>
      <div>
        <div>
          <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
            <div class="container-fluid">
              <Link class="navbar-brand" to="/">Real Management</Link>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  {/* <li class="nav-item">
                    <Link class="nav-link" to="login">Login</Link>
                  </li> */}
                  <li class="nav-item">
                    <Link class="nav-link" to="dashboard">Dashboard</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to="tenant">Tenant</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to="Contractor">Contractor</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div class="container" style={{marginTop:'60px'}}>
          {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Routes>
            <Route
              path="/"
              element={<Login setToken={setToken}/>}
            />
            {/* <Route
              path="/login"
              element={<Login />}
            /> */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />
            <Route
              path="tenant"
              element={<Tenant />}
            />
            <Route
              path="contractor"
              element={<Contractor />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
