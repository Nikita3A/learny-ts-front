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
      const response = await fetch('/api/auth/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
  
      const data = await response.json();
      
      dispatch(loginSuccess(data));
      navigate("/signin");
    } catch (err) {
      console.error(err);
      dispatch(loginFailed());
    }
  };
  
  return (
    <div className="h-screen bg-dark flex justify-center items-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-darkGray flex flex-col">
        <div className="p-6 sm:p-8"> {/* padding for desktop, content height for mobile */}
          <h2 className="text-white text-2xl font-bold text-center mb-4">Learny</h2>
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
    </div>
  );
};

export default Signup;