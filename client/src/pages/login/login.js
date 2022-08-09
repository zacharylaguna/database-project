import './login.scss';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'

const urlBody = "http://localhost:4000";

async function loginUser(credentials) {
  const url = urlBody + "/login/" + credentials[0] + "/" + credentials[1];
  const response = await axios.get(url);
  return response.data;
}

function isLoggedIn() {
  return sessionStorage.getItem('token');
}

export default function Login({ setToken, getUsername }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [incorectLogin, setIncorectLogin] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [incorrectPassword, setIncorectPassword] = useState(false);

  const [rUsername, setrUsername] = useState("");
  const [rPassword, setrPassword] = useState("");
  const [rName, setrName] = useState("");
  const [rPhone, setrPhone] = useState("");
  const [registerStatus, setRegisterStatus] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();

    const token = await loginUser([
      username,
      password
    ]);

    console.log(token);
    setUserName("");
    setPassword("");

    if (!token || token.token == 'invalid') {
      setIncorectLogin(true);
      // setToken(token);
    } else {
      setToken(token);
      setLoggedIn(true);
      window.location = "/" + (sessionStorage.getItem('role') == "manager" ? "dashboard" : sessionStorage.getItem('role'));
      return "";
    }
  }

  // TOKEN USE CLIENT SIDE EXAMPLE
  const changePassword = async e => {
    e.preventDefault();

    //aquire token from session storage
    const token = sessionStorage.getItem("token");

    //aquire username from session storage
    const username = sessionStorage.getItem("username");

    // call to api includes token within headers
    const res = await axios.get(urlBody + "/change-password/" + username + "/" + oldPassword + "/" + newPassword, {
      headers: {
        token: token
      }
    });

    if (res && res.data === "incorrect password") {
      setIncorectPassword(true);
    }
    else {
      setIncorectLogin(false);
    }

    console.log(res);
  }

  const RegisterUser = async e => {
    e.preventDefault();

    const res = await axios.post(urlBody + "/make-manager", {
      username: rUsername,
      password: rPassword,
      name: rName,
      phone: rPhone
    })
    if (res.data == "unable to register") {
      setRegisterStatus(1);
    } else {
      setRegisterStatus(2);
      setrName("");
      setrPassword("");
      setrPhone("");
      setrUsername("");
    }
  }

  if (isLoggedIn()) {
    document.body.style.display = "none";
    window.location = "/" + (sessionStorage.getItem('role') == "manager" ? "dashboard" : sessionStorage.getItem('role'));
    return "";
  }

  return (
    <div>
      {/* Current User Login */}
      {loggedIn ? <h1 class="h3">Signed in as {getUsername()} </h1>
        : <h1 class="h3">Sign in to continue</h1>}
      {!loggedIn && <p>You must sign in to access the web portal.</p>}

      {!loggedIn && <form onSubmit={handleSubmit}>

        {/* Username input */}
        <div class="mb-3 row">
          <div class="col-sm-6">
            <label for="inputUsername" class="col-form-label">Username</label>
            <input type="text" class="form-control" id="inputUsername" value={username} onChange={e => setUserName(e.target.value)} />
          </div>
        </div>

        {/* Password input */}
        <div class="row">
          <div class="col-sm-6">
            <label for="inputPassword" class="col-form-label">Password</label>
            <input type="password" class="form-control" id="inputPassword" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>

        <button type="submit" class="btn btn-dark mt-4">Continue</button>

        {incorectLogin && <p class="text-danger"><strong>Failed to login.</strong> The login information you entered is not valid.</p>}

      </form>}
      <br></br>
      <hr></hr>
      {/* Register */}
      {(!loggedIn && registerStatus < 2) ?
        <form onSubmit={RegisterUser}>
          <br></br>

          <h1 class="h3">Register new Manager</h1>

          <div class="mb-3 row">
            <div class="col-sm-6">
              <label >Username</label>
              <input type="text" class="form-control" value={rUsername} onChange={e => setrUsername(e.target.value)} />
            </div>
          </div>

          <div class="mb-3 row">
            <div class="col-sm-6">
              <label >Name</label>
              <input type="text" class="form-control" value={rName} onChange={e => setrName(e.target.value)} />
            </div>
          </div>

          <div class="mb-3 row">
            <div class="col-sm-6">
              <label >Password</label>
              <input type="password" class="form-control" value={rPassword} onChange={e => setrPassword(e.target.value)} />
            </div>
          </div>

          <div class="mb-3 row">
            <div class="col-sm-6">
              <label >Phone Number</label>
              <input type="text" class="form-control" value={rPhone} onChange={e => setrPhone(e.target.value)} />
            </div>
          </div>

          <div class="d-grid gap-4 d-md-block mb-3 mt-4">
            <button type="submit" class="btn btn-dark">Register</button>
          </div>

          {registerStatus == 1 && <p class="text-danger">Unable to Register.</p>}

        </form>
        :
        <div>
          Registered Successfully. Please log in
        </div>
      }
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};
