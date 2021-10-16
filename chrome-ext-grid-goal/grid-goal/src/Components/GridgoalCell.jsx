import React from 'react'
import { numberWithCommas } from '../utils/utils'
function GridgoalCell({ index, multiplier, numCells }) {
    return (
        <>
            {index < numCells ?
                <div className="grid-goal-cell">
                    {numberWithCommas((index + 1) * multiplier)}
                </div> : <></>
            }
        </>

    )
}

export default GridgoalCell
