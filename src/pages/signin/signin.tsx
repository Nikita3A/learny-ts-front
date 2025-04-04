import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { loginFailed, loginStart, loginSuccess } from "../../redux/userSlice";

import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";


const Signin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const currentUser = useSelector(state => state.user.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await fetch("/api/auth/signin", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password })
      });
      
      const { accessToken, refreshToken } = await response.json();
      const { user } = jwtDecode(accessToken);
      
      dispatch(loginSuccess({user, accessToken, refreshToken}))


      navigate("/");

    } catch (err) {
      console.log('e:', err);
      dispatch(loginFailed());
    }
  };

  return (
    <div className="h-screen bg-dark flex justify-center items-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-darkGray flex flex-col">
        <div className="p-6 sm:p-8">
          <h2 className="text-white text-2xl font-bold mb-4 text-center sm:mt-6 sm:mb-8">Learny</h2>
          <form className="flex flex-col">
            <div className="mb-2 sm:mb-4">
              <input
                type="text"
                placeholder="username or email@mail.com"
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
            <div className="mb-2 sm:mb-4">
              <button onClick={handleSignin} className="w-full p-3 bg-green text-white rounded-2xl hover:bg-green-dark focus:outline-none">
                Signin
              </button>
            </div>
            <div className="text-center my-4">
              <button className="w-full p-3 bg-dark text-white flex items-center justify-center rounded-2xl focus:outline-none">
                <img src="/google.png" alt="Google" className="h-5 w-5 mr-2" />
                Signin with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  
};

export default Signin;