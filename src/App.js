import React from 'react';
import Layout from "./components/Layout";
import {BrowserRouter as Router} from 'react-router-dom';

function App() {
  return (
    <Router>
    <div>
      <Layout />
    </div>
    </Router>
  );
}

export default App;
