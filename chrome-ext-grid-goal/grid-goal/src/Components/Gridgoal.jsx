import React, { useState, useEffect } from "react";


import { getGridDims, mapNumber, getNumColumns, listAllResizeEventListeners } from '../utils/utils';
import GridgoalCell from './GridgoalCell';
import Form from "./Form";

function setCellSize(boxW, numCols) {

}
function handleResize(goal) {
    let gridContainer = document.querySelector('.grid-goal-body-content')
    if (!gridContainer || !goal) {
        return
    }

    // window.removeEventListener('resize', () => { handleResize(goal)} );

    let gridDims = gridContainer.getBoundingClientRect();
    let gridWidth = gridDims.width;
    let gridHeight = gridDims.height;

    let numCols = getNumColumns(goal.numCells, gridWidth, gridHeight - gridHeight * .2)
    // let numCols = 20;
    // console.log(numCols)
    let cellSize = Math.max(30, (gridWidth - 5 * (numCols - 1)) / numCols);
    // cellSize = Math.min(cellSize,100)

    let root = document.documentElement;
    let fontSize = mapNumber(goal.numCells, 0, 400, 20, 10)

    root.style.setProperty('--cell-font-size', fontSize + "px");
    root.style.setProperty('--cell-width', cellSize + "px");



}
function Gridgoal({ selectedGoal, setGoalDatas, goalDatas}) {

    const [goal, setGoal] = useState(selectedGoal);
    const [numCells, setNumCells] = useState(String(goal.numCells));
    const [formData, setFormData] = useState([]);

    const submitForm = (log) => {
        let tempLog = log;
        if (log == formData) {
            tempLog++;
        }

        setFormData(tempLog);
        selectedGoal.totalCompleted += Number(log);
        localStorage.setItem(`gridgoal-activity-${selectedGoal.id}`, selectedGoal.totalCompleted);
    
        setGoal(selectedGoal)
        
        let goalIndex=-1;
        for(let i = 0; i < goalDatas.length; i++){
            console.log(selectedGoal.id, goalDatas[i].id)
            if (selectedGoal.id == goalDatas[i].id ){
                goalIndex=i;
            }
        }
        console.log(`goalDatas`, goalDatas,goalDatas[goalIndex],goalIndex)

        goalDatas[goalIndex]["totalCompleted"] = selectedGoal.totalCompleted
        setGoalDatas(goalDatas);


    };

    useEffect(() => {
        setNumCells(String(selectedGoal.value));
        setGoal(selectedGoal)

        window.addEventListener('resize', () => { handleResize(selectedGoal) });
        // console.log( listAllResizeEventListeners())

    }, [selectedGoal])


    handleResize(selectedGoal)




    return (
        <div className="grid-goal-container">
            <div className="grid-goal-header-container">
                <div className="grid-goal-title">
                    {goal.title}
                    {/* Only Eat 10,000 Calories */}
                </div>

                <Form submitForm={submitForm} />


            </div>
            <div className="grid-goal-body-content-container">
                <div className="grid-goal-body-content">
                    {/* {console.log(goal)} */}
                    {[...Array(selectedGoal.numCells).keys()].map((numCell) => (
                        <GridgoalCell key={numCell} index={numCell} multiplier={selectedGoal.multiplier} numCells={selectedGoal.numCells} completedTotal={selectedGoal.totalCompleted} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Gridgoal
