import React, { useState } from 'react';
import axios from 'axios';

const urlBody = "http://localhost:4000/";

function isLoggedIn() {
  return sessionStorage.getItem('token');
}

export default function ChangePassword() {

  const [logedIn, setLoggedIn] = useState(isLoggedIn());
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState(false);

  if (!isLoggedIn()) {
    document.body.style.display = "none";
    window.location = "/";
    return "";
  }

  const changePassword = async e => {
    e.preventDefault();

    // aquire token from session storage
    const token = sessionStorage.getItem("token");

    // aquire username from session storage
    const username = sessionStorage.getItem("username");

    // call to api includes token within headers
    const url = urlBody + "change-password/" + username + "/" + oldPassword + "/" + newPassword;
    const res = await axios.get(url, {
      headers: {
        token: token
      }
    });

    if (res && res.data === "incorrect password") {
      setIncorrectPassword(true);
    }
    else {
      setIncorrectPassword(false);
    }

    console.log(res);
  }

  return (
    <form onSubmit={changePassword}>

      <h1 class="h3">Change password</h1>
      <p>Change your account's password</p>

      <div class="mb-3 row">
        <div class="col-sm-6">
          <label for="inputOldPassword" class="col-form-label">Old password</label>
          <input type="password" class="form-control" id="inputOldPassword" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
        </div>
      </div>

      <div class="mb-3 row">
        <div class="col-sm-6">
          <label for="inputNewPassword" class="col-form-label">New password</label>
          <input type="password" class="form-control" id="inputNewPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </div>
      </div>

      <div class="mb-3 row">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-dark">Change password</button>
        </div>
      </div>

      {incorrectPassword && <p class="text-danger"><strong>Failed to change password.</strong> The password information you entered is not valid.</p>}

    </form>
  )
}

