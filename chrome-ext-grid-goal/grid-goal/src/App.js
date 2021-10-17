import React, { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import ActiveGridGoal from "./Components/ActiveGridGoal";
import Gridgoal from "./Components/Gridgoal"
import activeGoals from "./data/activeGoals.json";
import defaultActivity from "./data/defaultActivity.json"
import { getGridMultiplier } from './utils/utils'
import './App.css';




function App() {
  //create your forceUpdate hook


  function handleClick(param) {
    setSelectedGoal({...param})
    // param is the argument you passed to the function
    // e is the event object that returned
  };

  const [activeGoalData, setActiveGoalData] = useState(activeGoals);
  const [selectedGoal, setSelectedGoal] = useState(activeGoals[0]);

  
  useEffect(() => {
    // This is a proxy for a database query
    let filteredActiveGoals = [...activeGoals];
    for (let i = filteredActiveGoals.length; i < 4; i++) {
      filteredActiveGoals.push(defaultActivity)
    }
    setActiveGoalData(filteredActiveGoals);
   
  }, [selectedGoal]);




  return (
    <div className="App">
      <Navbar />
      <div className="page-content">
        <div className="active-grid-goals-container">
          {
            activeGoalData.map(((goalData, i) => <ActiveGridGoal key={i} onclick={handleClick} goalData={goalData} />))
          }
        </div>
        <Gridgoal selectedGoal={selectedGoal} />

      </div>
    </div>
  );
}

export default App;
