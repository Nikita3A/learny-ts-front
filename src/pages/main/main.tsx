import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import ChatList from '../../components/ChatList';
import CourseList from '../../components/CourseList';
import AddUserModal from '../../components/AddUserModal';
import AddChatModal from '../../components/AddChatModal';
import ChatWindow from '../../components/ChatWindow';
import Profile from '../../components/Profile';
import CoursePlan from '../../components/CoursePlan';
import CreateCourse from '../../components/CreateCourse';
import io from 'socket.io-client';
import axios from "axios";

const App = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [socketConnection, setSocketConnection] = useState(null);
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('courses');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // New state for selected course
  const [createCourse, setCreateCourse] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null); // New state for selected unit

  const currentUser = useSelector((state) => state.user.currentUser);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3000/chat');
    setSocketConnection(socket);

    socket.on('chatToClient', (receivedMessages) => {
      setMessageList((prevMessages) => {
        const newMessages = receivedMessages.filter(
          (message) => !prevMessages.some((prevMessage) => prevMessage.id === message.id)
        );
        return [...prevMessages, ...newMessages];
      });
    });

    const loadChats = async () => {
      try {
        const response = await axios.get(`/api/users/${currentUser.user.id}/chats`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });        
        setChatList(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    const loadCourses = async () => {
      if (!currentUser || !currentUser.accessToken) {
        console.error("No token available. Please sign in.");
        return;
      }
  
      try {
        // Fetch data from the server
        const response = await axios.get("/api/courses/users", {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });
  
        const serverCourses = response.data;
  
        // Transform the server's data to match the expected structure
        const transformedCourses = serverCourses.map((course) => ({
          id: course.id,
          name: course.theme, // Use "theme" as the course name
          progress: "0%", // Default progress value
        }));
  
        // Update the state
        setCourseList(transformedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    

    loadChats();
    loadCourses();

    return () => socket.close();
  }, [currentUser]);

  useEffect(() => {
    if (activeChat) {
      const chatSocket = io('http://localhost:3000/chat', {
        query: { chatId: activeChat.id },
      });

      chatSocket.emit('joinChat', activeChat.id);
      chatSocket.emit('requestMessages', activeChat.id);

      chatSocket.on('chatToClient', (receivedMessages) => {
        setMessageList(receivedMessages);
      });

      setSocketConnection(chatSocket);
      setMessageList([]);

      return () => chatSocket.emit('leaveChat', activeChat.id);
    }
  }, [activeChat]);

  const loadCoursesList = async () => {
    if (!currentUser || !currentUser.accessToken) {
      console.error("No token available. Please sign in.");
      return;
    }

    try {
      // Fetch data from the server
      const response = await axios.get("/api/courses/users", {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });

      const serverCourses = response.data;

      // Transform the server's data to match the expected structure
      const transformedCourses = serverCourses.map((course) => ({
        id: course.id,
        name: course.theme, // Use "theme" as the course name
        progress: "0%", // Default progress value
      }));

      // Update the state
      setCourseList(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  
  // const handleSendMessage = (messageText) => {
  //   if (socketConnection && messageText.trim() !== '') {
  //     socketConnection.emit('sendMessage', {
  //       text: messageText,
  //       userId: currentUser.user.id,
  //       chatId: activeChat ? activeChat.id : 'ai',
  //     });

  //     socketConnection.on('newMessage', (newMessage) => {
  //       setMessageList((prevMessages) => [...prevMessages, newMessage]);
  //     });
  //   }
  // };

  const handleSendMessage = (messageText) => {
    if (socketConnection && messageText.trim() !== '') {
      // Emit the message with userId
      socketConnection.emit('sendMessage', {
        text: messageText,
        userId: currentUser.user.id,
        chatId: activeChat ? activeChat.id : 'ai',
      });
  
      // Listen for the newMessage event and update the message list
      socketConnection.on('newMessage', (newMessage) => {
        const enrichedMessage = {
          ...newMessage,
          user: {
            id: currentUser.user.id,
            username: currentUser.user.username, // Add the username from currentUser
          },
        };
  
        setMessageList((prevMessages) => [...prevMessages, enrichedMessage]);
      });
    }
  };
  
  const toggleAddChatModal = () => {
    setIsAddChatModalOpen(!isAddChatModalOpen);
  };

  const toggleAddUserModal = () => {
    setIsAddUserModalOpen(!isAddUserModalOpen);
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setSelectedUnit(null);
    setIsSidebarOpen(false);
    setIsProfileVisible(false);
    setSelectedCourse(null); // Deselect course when a chat is selected
    setCreateCourse(null);
  };

  const handleCourseSelect = (course) => {
    // console.log('unit: ', selectedUnit);
    // console.log('Selected course: ', course);
    
    setSelectedCourse(course);
    setSelectedUnit(null);
    setActiveChat(null); // Deselect chat when a course is selected
    setIsSidebarOpen(false);
    setIsProfileVisible(false);
    setCreateCourse(null);
  };

  const switchToAIView = () => {
    setCurrentView('ai');
    setActiveChat(null);
    setSelectedUnit(null);
    setIsAIChatVisible(true);
    setIsSidebarOpen(!isMobile);
    setIsProfileVisible(false);
    setSelectedCourse(null); // Deselect course when AI view is selected
    setCreateCourse(null);
  };

  const switchToChatsView = () => {
    setCurrentView('chats');
    setActiveChat(null);
    setSelectedUnit(null);
    setIsAIChatVisible(false);
    setIsSidebarOpen(true);
    setIsProfileVisible(false);
    setSelectedCourse(null); // Deselect course when chats view is selected
    setCreateCourse(null);
  };

  const switchToCoursesView = () => {
    setCurrentView('courses');
    setActiveChat(null);
    setSelectedUnit(null);
    setIsAIChatVisible(false);
    setIsSidebarOpen(true);
    setIsProfileVisible(false);
    setSelectedCourse(null);
    setCreateCourse(null);
  };

  const switchToProfileView = () => {
    setIsProfileVisible(true);
    setActiveChat(null);
    setSelectedUnit(null);
    setIsSidebarOpen(false);
    setIsAIChatVisible(false);
    setSelectedCourse(null); // Deselect course when profile view is selected
    setCreateCourse(null);
  };

  const handleCreateCourse = () => {
    setCreateCourse(true)
    setIsProfileVisible(false);
    setSelectedUnit(null);
    setActiveChat(null);
    setIsSidebarOpen(false);
    setIsAIChatVisible(false);
    setSelectedCourse(null); // Deselect course when profile view is selected
  }

  const handleUnitSelect = (unit) => {
    console.log('haha');
    setSelectedUnit(unit);
    console.log('Hunit: ', selectedUnit);
    setIsSidebarOpen(false);
  };
  
  const handleBackClick = () => {
    setActiveChat(null);
    setIsSidebarOpen(true);
    setIsAIChatVisible(false);
    setIsProfileVisible(false);
    setSelectedCourse(null); // Deselect course on back click
    setCreateCourse(null);
  };

  // const addUser = () => {
  //   setIsAddUserModalOpen(!isAddUserModalOpen);
  // }

  return (
    <div className="flex flex-col h-screen bg-dark overflow-hidden">
      <Navbar
        onHomeClick={switchToCoursesView}
        onMessagesClick={switchToChatsView}
        onAiClick={switchToAIView}
        onProfileClick={switchToProfileView}
      />
  
      <div className="flex flex-grow h-full w-full overflow-hidden">
        {isProfileVisible ? (
          <div className="flex flex-col flex-grow bg-dark p-0 sm:p-4">
            <Profile user={currentUser} />
          </div>
        ) : (
          <>
            <div
              className={`flex flex-col bg-dark pt-3 pb-3 overflow-hidden ${
                isSidebarOpen ? 'w-full sm:w-1/5' : 'hidden sm:flex sm:w-1/5'
              }`}
            >
              {currentView === 'chats' ? (
                <ChatList chats={chatList} onAddChat={toggleAddChatModal} onChatSelect={handleChatSelect} />
              ) : (
                <CourseList courses={courseList} onAddCourse={handleCreateCourse} onCourseSelect={handleCourseSelect} />
              )}
            </div>
  
            <div
              className={`flex flex-col flex-grow overflow-hidden bg-dark px-4 py-2 relative ${
                (activeChat || (currentView === 'ai' && (!isMobile || isAIChatVisible))) ? 'w-full sm:w-4/5' : 'hidden'
              }`}
            >
              {activeChat ? (
                <ChatWindow
                  chat={activeChat}
                  messages={messageList}
                  addUser={toggleAddUserModal}
                  onSubmitMessage={handleSendMessage}
                />
              ) : currentView === 'ai' && (!isMobile || isAIChatVisible) ? (
                <ChatWindow
                  chat={{ name: 'AI Chat' }}
                  messages={messageList}
                  addUser={toggleAddUserModal}
                  onSubmitMessage={handleSendMessage}
                />
              ) : null}
            </div>

            {/* Conditionally render selected unit info or course plan */}
            {selectedUnit ? (
              // Render both Course Plan and Unit Info when a unit is selected
              <div className="flex flex-col w-full p-4 bg-darkGrey">
                <CoursePlan course={selectedCourse} selectedLesson={selectedUnit} setSelectedLesson={setSelectedUnit}/>
                {/* <CoursePlan course={selectedCourse} selectedLesson={selectedUnit} setselectedLesson={setSelectedUnit} /> */}
              </div>
            ) : currentView === 'courses' && selectedCourse ? (
              // Render only Course Plan when a course is selected and no unit is selected
              <div className="flex flex-col w-full p-4 bg-darkGrey">
                <CoursePlan course={selectedCourse} selectedLesson={selectedUnit} setSelectedLesson={setSelectedUnit}/>
                
                {/* <CoursePlan course={selectedCourse} selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} /> */}
              </div>
            ) : currentView === 'courses' && createCourse ? (
              // Render Create Course view when createCourse state is true
              <div className="flex flex-col w-full p-4 bg-darkGrey">
                <CreateCourse hideForm={switchToCoursesView} loadCoursesList={loadCoursesList}/>
              </div>
            ) : null}
          </>
        )}
      </div>
      <AddChatModal isOpen={isAddChatModalOpen} onRequestClose={toggleAddChatModal} setChats={setChatList} />
      <AddUserModal isOpen={isAddUserModalOpen} onRequestClose={toggleAddUserModal} chat={activeChat} />
    </div>
  );
};

export default App;
