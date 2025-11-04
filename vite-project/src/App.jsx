import React from "react";
import ComposeMail from "./pages/ComposeMail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./component/SignUp";
import Login from "./component/Login";
import Home from "./pages/Home";
import Header from "./component/Header";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/compose" element={<ComposeMail />} />
      </Routes>
    </Router>
  );
};

export default App;
