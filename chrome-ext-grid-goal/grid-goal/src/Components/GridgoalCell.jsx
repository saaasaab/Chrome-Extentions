import React from 'react'
import { numberWithCommas } from '../utils/utils'
function GridgoalCell({ index, multiplier, numCells, completedTotal, total }) { 
    // console.log(index, multiplier, numCells, completedTotal)
    return (
        <>
            {index < numCells ?
                
                <div className={`grid-goal-cell ${index < completedTotal/multiplier ? "active-grid-cell":""}`} >
                    {numberWithCommas(Math.min(total,(index + 1) * multiplier))}
                </div> : <></>
            }
        </>

    )
}

export default GridgoalCell
