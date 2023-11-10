import Navbar from './Navbar';
import Home from './pages/Home';
import Training from './pages/Training';
import Account from './pages/Account';
import TrainingPlan from './pages/TrainingPlan';
import {Route, Routes} from "react-router-dom"
import LoginPage from './pages/LoginPage';
import { fetchDataFromAPI } from "./utils";
import React, { useState } from "react";

let userName = ""
 function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("Glowny komponent")
  proceesData(setIsLoggedIn)
  return (
    <>
      <Navbar status = {isLoggedIn} name = {userName}/>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home status = {isLoggedIn} name = {userName}/>}/>
          <Route path="/login" element={<LoginPage />} />        
          <Route path="/training" element={<Training />} />
          <Route path="/account" element={<Account />} />
          <Route path="/trainingPlan" element={<TrainingPlan />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

async function proceesData(setIsLoggedIn){
  const apiUrl = 'http://localhost:5000/profile'; // Replace with the actual API endpoint
  try {
    const apiData = await fetchDataFromAPI(apiUrl);
    console.log('API Response:', apiData);
    if(apiData['isLoggedIn']){
      console.log("zmieniam status na true")
      setName(apiData['name'])
      setIsLoggedIn(true)
    }else{
      console.log("zmieniam status na false")
      setIsLoggedIn(false)
    }

    // You can now process the API data within this function or pass it to another function
    // Example: processApiData(apiData);
  } catch (error) {
    console.error('Error:', error);
  }
}

function setName(nameApi){
  userName = nameApi;
}
