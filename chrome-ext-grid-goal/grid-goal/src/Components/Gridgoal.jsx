import React, { useState, useEffect } from "react";
import addIcon from '../assets/add-amount.png';
import { getGridDims, mapNumber } from '../utils/utils';
import GridgoalCell from '../Components/GridgoalCell';

function setCellSize(boxW, numCols) {

}
function handleResize(numCols, setNumCols, setNumRows,  numCells) {
    let gridContainer = document.querySelector('.grid-goal-body-content')
    if(!gridContainer){
        return
    }
    
    let gridDims = gridContainer.getBoundingClientRect();
    
    let gridWidth = gridDims.width;
    let gridHeight = gridDims.height;


    let cellSize = Math.max(30,(gridWidth - 5 * (numCols - 1)) / numCols);  

    let root = document.documentElement;
    let fontSize = mapNumber(gridDims[2], 0, 900, 20, 10)

    root.style.setProperty('--cell-font-size', fontSize + "px");
    root.style.setProperty('--cell-width', cellSize + "px");

}
function Gridgoal( {completedTotal} ) {
    const [numCells, setNumCells] = useState('12000');
    const [numCols, setNumCols] = useState(1);
    const [numRows, setNumRows] = useState(1);


    const [multiplier, setMultiplier] = useState(1);

    useEffect(() => {
        const dimensions = getGridDims(numCells);
        setNumCols(dimensions[0]);
        setNumRows(dimensions[1]);

        setMultiplier(dimensions[3])
        handleResize(dimensions[0])

        window.addEventListener('resize', () => { handleResize(dimensions[0], setNumCols, setNumRows, dimensions[2] ) });

    }, [])


    // handleResize(numCols, setNumCols, setNumRows, numCells );

    return (
        <div className="grid-goal-container">
            <div className="grid-goal-header-container">
                <div className="grid-goal-title">
                    Only Eat 10,000 Calories
                </div>
                <div className="add-amount-container">
                    <img className="plus-icon" src={addIcon} />
                    <div className="add-amount-field">ADD AMOUNT</div>
                </div>
            </div>
            <div className="grid-goal-body-content-container">
                <div className="grid-goal-body-content">
                    {[...Array(Number(numCells / multiplier)).keys()].map((numCell) => (
                        
                        <GridgoalCell key={numCell} index={numCell} multiplier={multiplier} numCells={ numCells} completedTotal={completedTotal}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Gridgoal
