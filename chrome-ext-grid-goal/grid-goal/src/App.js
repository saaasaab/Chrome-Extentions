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
    setSelectedGoal({ ...param })
    // param is the argument you passed to the function
    // e is the event object that returned
  };

  const [goalDatas, setGoalDatas] = useState(goals);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);
  const [newGoalForm, submitNewGoalForm] = useState('');
  const [incomingGoalFormData, setIncomingGoalFormData]= useState(false);
  // const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    // This is a proxy for a database query
    let filteredGoals = [...goals];
    for (let i = filteredGoals.length; i < 4; i++) {
      filteredGoals.push(defaultActivity)
    }
let a = 1;
    setGoalDatas(filteredGoals);

  }, [selectedGoal, goals]);

  useEffect(() => {
    if (newGoalForm != "" && incomingGoalFormData) {
      console.log(newGoalForm, goals)
      const verb = newGoalForm[0];
      const number = newGoalForm[1];
      const noun = newGoalForm[2];

      goals.push(
        {
          dueDate: "Wed Oct 27 2021 19:00:00 GMT-0700",
          icon: "workout",
          id: 4,
          multiplier: 5,
          numCells: 200,
          status: true,
          title: `${verb} ${number} ${noun}`,
          totalCompleted: 0,
          totalTime: 8,
          value: number
        }
      )
      setGoalDatas(goals);
      setIncomingGoalFormData(false)
    }
  }, [newGoalForm])
  return (
    <div className="App">
      <Navbar />
      <div className="page-content">
        <div className="active-grid-goals-container">
          {
            goalDatas.map(((goalData, i) => <ActiveGridGoal key={i} onclick={handleClick} goalData={goalData} submitNewGoalForm={submitNewGoalForm} setIncomingGoalFormData={setIncomingGoalFormData}/>))
          }
        </div>
        <Gridgoal selectedGoal={selectedGoal} setGoalDatas={setGoalDatas} goalDatas={goalDatas} />

      </div>
    </div>
  );
}

export default App;
