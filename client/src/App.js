// client/src/App.js

import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

import { Container } from "react-bootstrap";

function App() {
  const [data, setData] = React.useState(null);

  return (
    <BrowserRouter className="App">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
