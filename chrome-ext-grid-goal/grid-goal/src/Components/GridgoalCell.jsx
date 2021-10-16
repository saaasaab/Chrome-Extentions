import React from 'react'
import { numberWithCommas } from '../utils/utils'
function GridgoalCell({ numCell, multiplier, index, numCells }) {

    return (
        <>
            {index < numCells ?
                <div className="grid-goal-cell">
                    {numberWithCommas((numCell + 1) * multiplier)}
                </div> : <></>
            }
        </>

    )
}

export default GridgoalCell
