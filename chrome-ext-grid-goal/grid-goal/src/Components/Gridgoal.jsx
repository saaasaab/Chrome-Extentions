import React, { useState, useEffect } from "react";


import { mapNumber, getNumColumns } from '../utils/utils';
import GridgoalCell from './GridgoalCell';
import Form from "./Form";
import {saveToLocal} from '../utils/utils'

function handleResize(goal) {
    let gridContainer = document.querySelector('.grid-goal-body-content')
    if (!gridContainer || !goal) {
        return
    }

    let gridDims = gridContainer.getBoundingClientRect();
    let gridWidth = gridDims.width;
    let gridHeight = gridDims.height;

    let numCols = getNumColumns(goal.numCells, gridWidth, gridHeight - gridHeight * .2)
    // let numCols = 20;
    // console.log(numCols)
    let cellSize = Math.max(25, (gridWidth - 5 * (numCols - 1)) / numCols);
    // cellSize = Math.min(cellSize,100)
    let root = document.documentElement;
    let fontSize = mapNumber(goal.numCells, 0, 200, 40, 10);

    root.style.setProperty('--cell-font-size', fontSize + "px");
    root.style.setProperty('--cell-width', cellSize + "px");
}

function Gridgoal({ selectedGoal, setGoalDatas, goalDatas, setFormFill }) {

    // const [goal, setGoal] = useState(selectedGoal);
    // const [numCells, setNumCells] = useState(goal ? String(goal.numCells): 0);
    const [formData, setFormData] = useState([]);

    const submitForm = (log) => {
        let tempLog = log;
        if (log === formData) {
            tempLog++;
        }

        setFormData(tempLog);
        selectedGoal.totalCompleted += Number(log);
        selectedGoal.totalCompleted= Math.max(0,Math.min(selectedGoal.totalCompleted,selectedGoal.value))


        let now = new Date();
        let endDate = new Date(selectedGoal.dueDate);
        let daysLeft = (endDate.getTime() - now.getTime()) / 1000 / 86400;
        let totalDays = selectedGoal.totalTime;
        // let dayNum = daysLeft
        let dayNum = Math.floor(totalDays-daysLeft);
        
        selectedGoal.progress[dayNum] += Number(log);



        // Why am I using this?
        // localStorage.setItem(`gridgoal-activity-${selectedGoal.id}`, selectedGoal.totalCompleted);
    
        // setGoal(selectedGoal)
        
        let goalIndex=-1;
        for(let i = 0; i < goalDatas.length; i++){
            if (selectedGoal.id === goalDatas[i].id ){
                goalIndex=i;
            }
        }

        let totalcompleted = Object.keys(selectedGoal.progress).map(elem=>selectedGoal.progress[elem]).reduce((partial_sum, a) => partial_sum + a,0);


        goalDatas[goalIndex]["totalCompleted"] = totalcompleted;
        setGoalDatas(goalDatas);

        saveToLocal("grid-goal-activity-data", goalDatas);
        setFormFill(Date.now());
    };

    useEffect(() => {
        // setNumCells(selectedGoal?String(selectedGoal.value):0);
        handleResize(selectedGoal)
        handleResize(selectedGoal)
        window.addEventListener('resize', () => { handleResize(selectedGoal) });
        // console.log( listAllResizeEventListeners())

    }, [selectedGoal])

    return (
        <div className="grid-goal-container">
            <div className="grid-goal-header-container">
                <div className="grid-goal-title">
                    {selectedGoal?selectedGoal.title:"Click the '+' to create your first Grid Goal"}
                </div>
                {goalDatas.length>0?
                <Form submitForm={submitForm} />:<></>}

            </div>
            <div className="grid-goal-body-content-container">
                <div className="grid-goal-body-content">
                    {goalDatas.length>0?[...Array(selectedGoal.numCells).keys()].map((numCell) => (
                        <GridgoalCell key={numCell} index={numCell} multiplier={selectedGoal.multiplier} numCells={selectedGoal.numCells} completedTotal={selectedGoal.totalCompleted} total={selectedGoal.value}/>
                    )):<></>}
                </div>
            </div>
        </div>
    )
}

export default Gridgoal
