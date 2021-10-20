import React, { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import ActiveGridGoal from "./Components/ActiveGridGoal";
import Gridgoal from "./Components/Gridgoal"
import goals from "./data/goals.json";
import defaultActivity from "./data/defaultActivity.json"
import './App.css';




function App() {
  //create your forceUpdate hook


  function handleClick(param) {
    setSelectedGoal({...param})
    // param is the argument you passed to the function
    // e is the event object that returned
  };

  const [goalDatas, setGoalDatas] = useState(goals);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);
  // const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    // This is a proxy for a database query

    let filteredGoals = [...goals];
    for (let i = filteredGoals.length; i < 4; i++) {
      filteredGoals.push(defaultActivity)
    }
    setGoalDatas(filteredGoals);
   
  }, [selectedGoal, goals]);

  return (
    <div className="App">
      <Navbar />
      <div className="page-content">
        <div className="active-grid-goals-container">
          {
            goalDatas.map(((goalData, i) => <ActiveGridGoal key={i} onclick={handleClick} goalData={goalData} />))
          }
        </div>
        <Gridgoal selectedGoal={selectedGoal} setGoalDatas={setGoalDatas} goalDatas={goalDatas}/>

      </div>
    </div>
  );
}

export default App;
