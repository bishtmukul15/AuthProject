import React from "react";
import ComposeMail from "./pages/ComposeMail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./component/SignUp";
import Login from "./component/Login";
import Home from "./pages/Home";
import Header from "./component/Header";
import Inbox from "./pages/Inbox";
import SentBox from "./component/SentBox";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/compose" element={<ComposeMail />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/sent" element={<SentBox />} />
      </Routes>
    </Router>
  );
};

export default App;
