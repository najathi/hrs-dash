import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../context/AuthContext'
import apis from '../../apis';

import "./login.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value })); //using previous value
    //set the password = password.value //creating variable password and setting values 
  }

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" }); //updating loading state
    try {
      const res = await apis().post("/auth/login", credentials);
      console.log(res.data, "type", typeof res.data.details);
      if (res.data.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details })
        localStorage.setItem("access_token", res.data.token);
        navigate("/");
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: { message: "You are not allowed!" } });

      }
    }
    catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.details });
    }
  }

  return (
    <div className="login">
      <div className="lContainer">

        <h3 className='mb-5'>Hotel Reservation System</h3>

        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;