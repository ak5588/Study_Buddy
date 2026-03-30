// import { useState, useEffect } from "react"
// import { Routes, Route, Navigate, useLocation } from "react-router-dom"
// import { Navbar } from "./components/Navbar"
// import { HomePage } from "./components/HomePage"
// import { ChatPage } from "./components/ChatPage"
// import ErrorBoundary from "./components/ErrorBoundary"

// function App() {
//   const [isDark, setIsDark] = useState(false)
//   const location = useLocation()

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }, [isDark])

//   const toggleDark = () => {
//     setIsDark(!isDark)
//   }

//   const isHomePage = location.pathname === "/"

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-white text-black">
//         {" "}
//         {/* Changed bg-background and text-foreground to bg-white and text-black for consistency with existing code.  Adjust as needed based on your CSS. */}
//         {isHomePage && <Navbar isDark={isDark} toggleDark={toggleDark} />}
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/chat/:service" element={<ChatPage />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//         {isHomePage && (
//           <footer className="border-t border-gray-100">
//             <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
//               © {new Date().getFullYear()} Study Buddy. All rights reserved.
//             </div>
//           </footer>
//         )}
//       </div>
//     </ErrorBoundary>
//   )
// }

// export default App

import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { HomePage } from "./components/HomePage"
import { ChatPage } from "./components/ChatPage"
import { QuestionGenerator } from "./components/QuestionGenerator"
import { QuizGenerator } from "./components/QuizGenerator"
import ErrorBoundary from "./components/ErrorBoundary"
import SignIn  from "./components/SignIn";
import SignUp from "./components/SignUp";
import TeacherDashboard from "./components/TeacherDashboard";

function App() {
  const [isDark, setIsDark] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const toggleDark = () => {
    setIsDark(!isDark)
  }

  const isHomePage = location.pathname === "/"

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white text-black">
        {" "}
        {/* Changed bg-background and text-foreground to bg-white and text-black for consistency with existing code.  Adjust as needed based on your CSS. */}
        {isHomePage && <Navbar isDark={isDark} toggleDark={toggleDark} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat/:service" element={<ChatPage />} />
          <Route path="/questions" element={<QuestionGenerator />} />
          <Route path="/quiz" element={<QuizGenerator />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {isHomePage && (
          <footer className="border-t border-gray-100">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Study Buddy. All rights reserved.
            </div>
          </footer>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
