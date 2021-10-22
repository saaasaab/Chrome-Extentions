import React, { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import ActiveGridGoal from "./Components/ActiveGridGoal";
import Gridgoal from "./Components/Gridgoal"
import goalsExample from "./data/goalsExample.json";
import defaultActivity from "./data/defaultActivity.json"
import { saveToLocal, numberWithCommas } from "./utils/utils"
import './App.css';


function App() {
  //create your forceUpdate hook


  function handleClick(param) {
    setSelectedGoal({ ...param })
    // param is the argument you passed to the function
    // e is the event object that returned
  };

  const [goalDatas, setGoalDatas] = useState(() => {
    // getting stored value
    const gs = JSON.parse(localStorage.getItem("grid-goal-activity-data")) || goalsExample;
    return gs;
  })

  const [filteredGoals, setFilteredGoals] = useState(() => {
    // 
    let gs = [...goalDatas];
    for (let i = gs.length; i < 4; i++) {
      gs.push(defaultActivity)
    }
    return gs;
  });;



  const [selectedGoal, setSelectedGoal] = useState(goalDatas[0]);
  const [newGoalForm, submitNewGoalForm] = useState('');
  const [incomingGoalFormData, setIncomingGoalFormData] = useState(false);
  // const [isInitialRender, setIsInitialRender] = useState(true);

  // useEffect(() => {
  //   // This is a proxy for a database query
  // }, [selectedGoal, goalDatas]);

  useEffect(() => {
    if (newGoalForm != "" && incomingGoalFormData) {
      const verb = newGoalForm[0];
      const number = Number(newGoalForm[1]);
      const noun = newGoalForm[2];
      const duration = Number(newGoalForm[3]);
      const multiplier = number >= 200 ? Math.ceil(number / 200) : 1;
      let goals = [...goalDatas];

      let today = new Date();
      let endDate = new Date(today.setDate(today.getDate() + duration)).toString();


      let newGoal = {
        id: goals.length + 1,
        dueDate: endDate,
        icon: "workout",
        multiplier: multiplier,
        numCells: Math.ceil(Number(number) / multiplier),
        status: true,
        title: `${verb} ${numberWithCommas(number)} ${noun} in ${duration} days`,
        totalCompleted: 0,
        totalTime: duration,
        value: number
      }
      goals.push(newGoal)

      saveToLocal("grid-goal-activity-data", goals);
      setGoalDatas(goals);


      let gs = [...goals];
      for (let i = gs.length; i < 4; i++) {
        gs.push(defaultActivity)
      }

      setSelectedGoal(newGoal)//THis is hilarious. I thought about fixing this earlier but didn't. It ended up causing a bug that took 20 minutes to fix
      setFilteredGoals(gs)
      setIncomingGoalFormData(false)

    }
  }, [newGoalForm])


  return (
    <div className="App">
      <Navbar />
      <div className="page-content">
        <div className="active-grid-goals-container">
          {

            filteredGoals.map(((goalData, i) =>
              <ActiveGridGoal key={i} onclick={handleClick} goalData={goalData} submitNewGoalForm={submitNewGoalForm} setIncomingGoalFormData={setIncomingGoalFormData} />
            ))
          }
        </div>
        {console.log(selectedGoal)}
        <Gridgoal selectedGoal={selectedGoal} setGoalDatas={setGoalDatas} goalDatas={goalDatas} />

      </div>
    </div>
  );
}

export default App;
