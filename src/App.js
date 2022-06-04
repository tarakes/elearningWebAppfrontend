
import * as React from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Adminhome from "./components/Adminhome";
import Classroom from "./components/Classroom";
import InsideAssignment  from "./components/insideAssignment";
import LandingPage from "./components/landingMeet";
function App() {
  return (
    <BrowserRouter>
 <Routes>
        <Route path="/"   element={<Login />} />
        <Route path="/class" element={<Adminhome />} />
        <Route path="/meet" element={<LandingPage />} />
        <Route path="/:classroomcode" element={<Classroom />} />
        <Route path="/assignment" element={<InsideAssignment/>} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
