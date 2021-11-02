import React from 'react'
import { numberWithCommas } from '../utils/utils'
function GridgoalCell({ index, multiplier, numCells, completedTotal, total, day }) { 
    // console.log(index, multiplier, numCells, completedTotal)
    let dayOfWeek = day%7;

    // let colors = ["#1fdab2","#1ffab2","#5fcab2","#4f9ac2","#4dd2b5","#b1dab2","#9ffab2"]
    let activeClass = `active-grid-cell-${dayOfWeek}`;
    return (
        <>
            {index < numCells ?
                
                <div   className={`grid-goal-cell ${index < completedTotal/multiplier ? activeClass:""}`} >
                    {numberWithCommas(Math.min(total,(index + 1) * multiplier))}
                </div> : <></>
            }
        </>

    )
}

export default GridgoalCell
