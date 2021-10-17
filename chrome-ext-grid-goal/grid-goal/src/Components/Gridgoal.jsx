import React, { useState, useEffect } from "react";

import addIcon from '../assets/add-amount.png';
import { getGridDims, mapNumber,  getNumColumns, listAllResizeEventListeners} from '../utils/utils';
import GridgoalCell from '../Components/GridgoalCell';

function setCellSize(boxW, numCols) {

}
function handleResize(goal) {
    let gridContainer = document.querySelector('.grid-goal-body-content')
    if(!gridContainer || !goal){
        return
    }

    // window.removeEventListener('resize', () => { handleResize(goal)} );

    let gridDims = gridContainer.getBoundingClientRect();
    let gridWidth = gridDims.width;
    let gridHeight = gridDims.height;

    let numCols = getNumColumns(goal.numCells, gridWidth, gridHeight-gridHeight*.2)
    // let numCols = 20;
    // console.log(numCols)
    let cellSize = Math.max(30,(gridWidth - 5 * (numCols - 1)) / numCols);  
    // cellSize = Math.min(cellSize,100)
    
    let root = document.documentElement;
    let fontSize = mapNumber(goal.numCells, 0, 400, 20, 10)
    
    root.style.setProperty('--cell-font-size', fontSize + "px");
    root.style.setProperty('--cell-width', cellSize + "px");

    

}
function Gridgoal( {selectedGoal} ) {
    
    const [goal, setGoal] = useState(selectedGoal);
    const [numCells, setNumCells] = useState(String(goal.numCells));
   

    useEffect(() => {
        const dimensions = getGridDims(goal.numCells);
        // setNumCols(dimensions[0]);
        // setNumRows(dimensions[1]);

        // handleResize(goal)
     

        setNumCells(String(goal.value));
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
                <div className="add-amount-container">
                    <img className="plus-icon" src={addIcon} />
                    <div className="add-amount-field">ADD AMOUNT</div>
                </div>
            </div>
            <div className="grid-goal-body-content-container">
                <div className="grid-goal-body-content">
                    {/* {console.log(goal)} */}
                    {[...Array( goal.numCells).keys()].map((numCell) => (       
                        <GridgoalCell key={numCell} index={numCell} multiplier={goal.multiplier} numCells={ goal.numCells} completedTotal={goal.totalCompleted}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Gridgoal
