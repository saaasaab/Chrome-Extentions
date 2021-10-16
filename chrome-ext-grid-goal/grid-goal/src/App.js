import React, { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import ActiveGridGoal from "./Components/ActiveGridGoal";
import Gridgoal from "./Components/Gridgoal"
import activeGoals from "./data/activeGoals.json";
import defaultActivity from "./data/defaultActivity.json"
import './App.css';




function App() {
  const [activeGoalData, setActiveGoalData] = useState(activeGoals);
  useEffect(() => {
    // This is a proxy for a database query
    let filteredActiveGoals = [...activeGoals]; 
    for(let i=filteredActiveGoals.length; i < 4; i++){
      filteredActiveGoals.push(defaultActivity)
    }
   
    setActiveGoalData(filteredActiveGoals);
    


  }, []);




  return (
    <div className="App">
      <Navbar/>
      <div className="page-content">
        <div className="active-grid-goals-container">
        {
          activeGoalData.map((goalData => <ActiveGridGoal key={goalData["id"]} goalData={goalData}/>))
        }
        
        </div>
    
        <Gridgoal completedTotal = {2200}/>
       
      </div>
    </div>
  );
}

export default App;
