// import axios from "axios";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { loginFailed, loginStart, loginSuccess } from "../../redux/userSlice";

import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(loginStart());
    try {
      const res = await axios.post("/api/auth/signup", {
        email,
        username,
        password,
      });
      dispatch(loginSuccess(res.data));
      navigate("/signin");
    } catch (err) {
      dispatch(loginFailed());
    }
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-dark">
      <div className="bg-darkGray border-0 sm:border-mediumGray sm:border-2 p-4 sm:p-8 sm:rounded-2xl shadow-md w-full h-full sm:h-auto max-w-md flex flex-col justify-start">
        <h2 className="text-white text-2xl font-bold mt-20 mb-10 text-center sm:mt-6 sm:mb-8">Learny</h2>
        <form className="flex flex-col">
          <div className="mb-2 sm:mb-4">
            <input
              type="text"
              placeholder="username"
              className="w-full p-3 bg-dark text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2 sm:mb-4">
            <input
              type="email"
              placeholder="email@mail.com"
              className="w-full p-3 bg-dark text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2 sm:mb-4">
            <input
              type="password"
              placeholder="password"
              className="w-full p-3 bg-dark text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 sm:mb-4">
            <input
              type="password"
              placeholder="confirm password"
              className="w-full p-3 bg-dark text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-2 sm:mb-4">
            <button onClick={handleSignup} className="w-full p-3 bg-green text-white rounded-2xl hover:bg-green-dark focus:outline-none">
              Signup
            </button>
          </div>
          <div className="text-center my-4">
            <button className="w-full p-3 bg-dark text-white flex items-center justify-center rounded-2xl focus:outline-none">
              <img src="/google.png" alt="Google" className="h-5 w-5 mr-2" />
              Signup with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default Signup;