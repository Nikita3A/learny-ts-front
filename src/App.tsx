import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

import "./App.css";
import CourseList from "./components/Courses/CourseList";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Signin from "./pages/signin/signin";
import Signup from "./pages/signup/signup";
import ChatList from "./components/Chats/ChatList";
import ChatWindow from "./components/Chats/ChatWindow";
import CoursePlan from "./components/Courses/CoursePlan";

const Layout = () => {
  return (
    <div className="">
      <Outlet></Outlet>
    </div>
  );
};

const SharedLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar onHomeClick={undefined} onMessagesClick={undefined} onProfileClick={undefined} onAiClick={undefined} streakDays={undefined} />
      <div className="flex flex-1">
        {/* <Sidebar /> */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/",
        element: <Signup />,
      },
      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          {
            path: "/chats",
            element: <SharedLayout />,
            children: [
              {
                path: "",
                element: <ChatList chats={undefined} onAddChat={undefined} onChatSelect={undefined} />, // List of chats
              },
              {
                path: ":chatId",
                element: <ChatWindow chat={undefined} messages={undefined} addUser={undefined} onSubmitMessage={undefined} currentUserId={undefined} currentUser={undefined} />, // Individual chat content
              },
            ],
          },
          {
            path: "/courses",
            element: <SharedLayout />,
            children: [
              {
                path: "",
                element: <CourseList courses={undefined} onAddCourse={undefined} onCourseSelect={undefined} />, // List of courses
              },
              {
                path: ":courseId",
                element: <CoursePlan course={undefined} selectedLesson={undefined} setSelectedLesson={undefined} />, // Individual course content
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="bg-secondaryBackgroundLight dark:bg-secondaryBackgroundDark">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
