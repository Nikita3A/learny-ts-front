import { useState } from "react";
// import axios from "axios";

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
      // Check for a redirect_uri query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUri = urlParams.get('redirect_uri');
      const clientId = urlParams.get('client_id');
      const state = urlParams.get('state');
      const response_type = urlParams.get('response_type');

      const res = await axios.post("/api/auth/signin", { email, password, clientId });
      const { accessToken, refreshToken } = res.data;
      const { user } = jwtDecode(accessToken);
      dispatch(loginSuccess({user, accessToken, refreshToken}));


      if (redirectUri) {
        // If there's a redirect_uri, make a GET request to /api/oauth/authorize
        const url = new URL('http://localhost:3000/api/oauth/authorize');
        url.searchParams.set('redirect_uri', redirectUri);
        url.searchParams.set('client_id', clientId);
        url.searchParams.set('grant_type', 'authorization_code');
        url.searchParams.set('state', state);
        url.searchParams.set('response_type', response_type);

        const oauthRes = await axios.get(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        });

        // Handle the response from /api/oauth/authorize
        console.log(oauthRes.data.url);
        window.location.href = oauthRes.data.url;
      } else {
        // If there's no redirect_uri, navigate to '/'
        navigate("/");
      }



      
    } catch (err) {
      console.log('e:', err);
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
  );
  
  
};

export default Signin;