import React, { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import ActiveGridGoal from "./Components/ActiveGridGoal";
import Gridgoal from "./Components/Gridgoal"
import goalsExample from "./data/goalsExample.json";
import defaultActivity from "./data/defaultActivity.json";
import { saveToLocal, getFromLocal, numberWithCommas } from "./utils/utils";
import { addOpenModalListener, addCloseModalListener } from "./utils/initModal";
import Modal from './Components/Modal';
import axios from 'axios';
import './App.css';





function App() {




  function saveUpdatedGoals(data) {
    const user_id = getFromLocal("user_id", -1)

    if (user_id !== -1) {
      axios.post('http://localhost:3001/update_goals_by_id',
        {
          "user_id": user_id,
          "grid_data": data
        }
      ).then((response) => {

      })
    }

  }

  function removeGoalId(id_to_remove) {
    const user_id = getFromLocal("user_id", -1)
    if (user_id !== -1) {
      axios.post('http://localhost:3001/remove-goal-id',
        {
          "user_id": user_id,
          "id_to_remove": id_to_remove
        }
      ).then((response) => {

      })
    }

  }
  //create your forceUpdate hook


  function handleClick(param) {
    setSelectedGoal({ ...param })
    // param is the argument you passed to the function
    // e is the event object that returned
  };

  const [goalDatas, setGoalDatas] = useState(() => {
    // getting stored value

    const gs = JSON.parse(localStorage.getItem("grid-goal-activity-data")) || goalsExample;

    gs.forEach(g => {
      if (!("progress" in g)) {
        // Set the progress to an empty object
        let emptyProgress = { ...[...Array(g.total_time).keys()].map((elem) => (elem)) }
        Object.keys(emptyProgress).forEach(v => emptyProgress[v] = 0);
        g['progress'] = emptyProgress;

        // Set today's day number as the total amount
        let now = new Date();
        let endDate = new Date(g.due_date);
        let daysLeft = Math.floor((endDate.getTime() - now.getTime()) / 1000 / 86400);
        let totalDays = g.total_time;
        // let dayNum = daysLeft
        let dayNum = Math.floor(totalDays - daysLeft);
        g['progress'][dayNum] = g.total_completed;

      }
    });
    saveToLocal("grid-goal-activity-data", gs);
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
  const [deleteGridgoalID, setDeleteGridgoalID] = useState('');
  const [incomingGoalFormData, setIncomingGoalFormData] = useState(false);
  const [runModals, setRunModals] = useState(false);
  const [formFill, setFormFill] = useState('');


  const [incomingGoalsDBData, setIncomingGoalsDBData] = useState(false);
  const [goalsDBData, setGoalsDBData] = useState('');
  const [loggedIn, setLoggedIn] = useState('false');

  // const [isInitialRender, setIsInitialRender] = useState(true);

  // useEffect(() => {
  //   // This is a proxy for a database query
  // }, [selectedGoal, goalDatas]);

  useEffect(() => {
    // if (runModals) {
    document.querySelectorAll("[data-modal-event]").forEach(addOpenModalListener);
    // Close the modal when the user clicks the close button or somewhere outside of the main modal content
    document.querySelectorAll(".modal__wrapper").forEach(addCloseModalListener);
    // }
    setRunModals(false)
  }, [runModals])

  useEffect(() => {

  }, [formFill])


  useEffect(() => {
    if (goalsDBData !== "" && incomingGoalsDBData) {

      let goals = [...goalsDBData];
      saveToLocal("grid-goal-activity-data", goals);

      setGoalDatas(goals);

      let gs = [...goals];

      for (let i = gs.length; i < 4; i++) { // Change the number of open grid goals to 6
        gs.push(defaultActivity)
      }

      setSelectedGoal(gs[0]);//This is hilarious. I thought about fixing this earlier but didn't. It ended up causing a bug that took 20 minutes to fix
      setFilteredGoals(gs);
      setIncomingGoalsDBData(false);

    }
  }, [incomingGoalsDBData])


  useEffect(() => {
    if (deleteGridgoalID !== "" && deleteGridgoalID) {

      let goals = [...goalDatas];

      let removedArray = goals.filter(el => el.id !== deleteGridgoalID);


      saveToLocal("grid-goal-activity-data", removedArray);
      setGoalDatas(removedArray);
      saveUpdatedGoals(removedArray)

      removeGoalId(deleteGridgoalID);

      let gs = [...removedArray];
      for (let i = gs.length; i < 4; i++) {
        gs.push(defaultActivity)
      }

      if (gs.filter(el => el.id !== -1).length === 0) {
        setSelectedGoal()
      }

      setFilteredGoals(gs)
      setDeleteGridgoalID("");
      setRunModals(true);
    }
  }, [deleteGridgoalID, goalDatas])

  useEffect(() => {
    if (newGoalForm !== "" && incomingGoalFormData) {
      const verb = newGoalForm[0];
      const number = Number(newGoalForm[1]);
      const noun = newGoalForm[2];
      const duration = Number(newGoalForm[3]);
      const multiplier = number >= 200 ? Math.ceil(number / 200) : 1;
      let goals = [...goalDatas];

      let today = new Date();
      let endDate = new Date(today.setDate(today.getDate() + duration)).toString();

      let emptyProgress = { ...[...Array(duration).keys()].map((elem) => (elem)) }
      Object.keys(emptyProgress).forEach(v => emptyProgress[v] = 0)

      let newGoal = {
        id:  Math.random().toString(36).substr(2, 9), // Generates a random 8 digit id
        due_date: endDate,
        icon: "workout",
        multiplier: multiplier,
        num_cells: Math.ceil(Number(number) / multiplier),
        status: 1,
        title: `${verb} ${numberWithCommas(number)} ${noun} in ${duration} days`,
        total_completed: 0,
        total_time: duration,
        value: number,
        progress: emptyProgress
        // progress:{...[...Array(duration).keys()].map((elem) => (elem,0))}
      }


      addCreateGoal(newGoal)

      goals.push(newGoal)

      saveUpdatedGoals(goals)
      // Get new goal id
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
  }, [newGoalForm, goalDatas, incomingGoalFormData])



  const addCreateGoal = (new_goal) => {
    const user_id = getFromLocal("user_id", -1)

    axios.post('http://localhost:3001/create-new-goal',
      {
        "user_id": user_id,
        "new_goal": new_goal
      }).then((response) => {

      });
  }


  return (
    <div className="App">
      <Navbar setIncomingGoalsDBData={setIncomingGoalsDBData} setGoalsDBData={setGoalsDBData} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
      <div className="page-content">
        <div className="active-grid-goals-container">
          {
            filteredGoals.map((goalData, i) =>
              <ActiveGridGoal key={i} onclick={handleClick} goalData={goalData} submitNewGoalForm={submitNewGoalForm} setIncomingGoalFormData={setIncomingGoalFormData} setDeleteGridgoalID={setDeleteGridgoalID} />
            )
          }

        </div>
        <Gridgoal selectedGoal={selectedGoal} setGoalDatas={setGoalDatas} goalDatas={goalDatas} setFormFill={setFormFill} />

      </div>
      <Modal submitNewGoalForm={submitNewGoalForm} dataModalEvent={"new-grid-goal"} setIncomingGoalFormData={setIncomingGoalFormData} />


    </div>
  );
}

export default App;
