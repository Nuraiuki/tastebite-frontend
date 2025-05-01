import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";

import HomePage from "./components/HomePage";
import MealPage from "./components/MealPage";
import CategoryPage from "./components/CategoryPage";
import AuthPage from "./components/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <div
        className={`min-h-screen transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } bg-white text-gray-900`}
      >
        {isLoaded && (
          <>
            <Navbar />
            <Routes>
    
              <Route path="/" element={<HomePage />} />

              //Только для авторизованных 
              <Route path="/meal/:id" element={
                <ProtectedRoute>
                  <MealPage />
                </ProtectedRoute>
              } />
              <Route path="/category/:name" element={
                <ProtectedRoute>
                  <CategoryPage />
                </ProtectedRoute>
              } />

        
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </>
        )}
      </div>
    </>
  );
}

export default App;
