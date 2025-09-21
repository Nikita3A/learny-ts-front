import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatsPage from './pages/ChatsPage';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/ProfilePage';
import AIChatPage from './pages/AIChatPage';
import SharedLayout from './components/SharedLayout';
import Signin from "./pages/signin/signin";
import Signup from "./pages/signup/signup";
import PrivateRoute from "./components/PrivateRoute";
import './App.css';
import CourseCreationPage from "./pages/CourseCreationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      { 
        path: "chats", 
        element: <ChatsPage />,
      },
      { 
        path: "chats/:chatId", 
        element: <ChatsPage />, // Use the same page for both
      },
      {
        path: "courses/create",
        element: <CourseCreationPage />
      },
      {
        path: "courses",
        element: <CoursesPage />,
        children: [  // Add nested route for course details
          {
            path: ":courseId",  // This matches the courseId in the URL
            element: null  // We'll handle this differently
          }
        ]
      },
      // { path: "courses", element: <CoursesPage /> },
      // { path: "courses/:courseId", element: <CoursesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "ai", element: <AIChatPage /> },
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <Signup /> },
    ],
  },
]);

function App() {
  return (
    <div className="bg-secondaryBackgroundLight dark:bg-secondaryBackgroundDark">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;