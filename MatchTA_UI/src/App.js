import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";

import HomePage from "./Components/Home";
import ResultsPage from "./Components/ResultsPage";
import UploadPage from "./Components/UploadPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" Component={HomePage} />
          <Route exact path="/Upload/:id" element={<UploadPage />} />
          <Route exact path="/Results" Component={ResultsPage} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
