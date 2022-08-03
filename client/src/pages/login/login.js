import './login.scss';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'



async function loginUser(credentials) {
  const url = "http://3.144.236.47:80/login/" + credentials[0] + "/" + credentials[1];
  const response = await axios.get(url);
  return response.data;

}


export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser([
      username,
      password
    ]);

    console.log(token);
    setToken(token);
    setUserName("");
    setPassword("");
  }

  return (
      <div class="row">
        <div class="col">
          <div class="container-sm">
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={username} onChange={e => setUserName(e.target.value)} />
                <div id="emailHelp" class="form-text">Your username is managed by your property manager.</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" class="btn btn-dark">Sign in</button>
            </form>
          </div>
        </div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};
