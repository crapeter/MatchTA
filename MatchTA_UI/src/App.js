import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResultsPage from "./Components/ResultsPage";
import Home from "./Components/Home"; // Ensure this file exists
import UploadPage from "./Components/UploadPage"; // Ensure this file exists
import FinalResults from "./Components/FinalResults"; // Corrected file name
import { AuthProvider } from "./Components/AuthContext"; // Corrected import

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/Upload/:id" element={<UploadPage />} />
          <Route exact path="/Results" element={<ResultsPage />} />
          <Route exact path="/FinalSchedule" element={<FinalResults />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;