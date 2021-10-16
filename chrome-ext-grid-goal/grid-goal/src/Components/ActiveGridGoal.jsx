import React, { useState, useEffect } from 'react';
import workoutIcon from '../assets/workout.png'
import newGridgoal from '../assets/newGridGoal.png'
import {numberWithCommas} from '../utils/utils'

function ActiveGridGoal({ goalData }) {
    // let [isActive, setIsActive] = useState(props.isActive);
    // let [goalData, setgoalData] = useState(goalData);
    // let [isActive, setIsActive] = useState(false);

    const [daysRemaining, setDaysRemaining] = useState("");
    const [hoursRemaining, setHoursRemaining] = useState("");
   

    useEffect(() => {
        setDaysRemaining(Math.floor(goalData.remainingTime));
        setHoursRemaining(Math.round((goalData.remainingTime-Math.floor(goalData.remainingTime))*24));
 
        // setIsActive(goalData.status)
    }, [goalData])
    return (
        <>
            {goalData.status ?

                <div className="active-grid-goal-container">
                    <div className="grid-goal-header">
                        <div className="grid-goal-icon">
                            <img src={workoutIcon} />
                        </div>
                        <div className="name-date-container">
                            <div className="grid-goal-name">
                             {goalData.title}
                    </div>
                            <div className="grid-goal-due-date">
                            {goalData.dueDate} 
                    </div>
                        </div>
                    </div>
                    <div className="grid-goal-progress-bars-container">
                        <div className="progress-container">
                            <div className="time-remaining-text">
                                Remaining Time: {daysRemaining} days, {hoursRemaining} hrs
                    </div>
                            <div className="time-remaining-bar">

                            </div>
                        </div>
                        <div className="progress-container">
                            <div className="completed-text-container">
                                <div className="completed-out-of">
                                    Completed: {numberWithCommas(goalData.totalCompleted)} out of {numberWithCommas(goalData.value)}
                        </div>
                                <div className="completed-percent">
                                    65%
                        </div>
                            </div>
                            <div className="completed-bar">

                            </div>
                        </div>

                    </div>
                </div>

                :
                <div className="active-grid-goal-container empty">
                    <div className="add-new-gridgoal">
                        <img src={newGridgoal}/>
                    </div>
                </div>
            }
        </>
    )
}

export default ActiveGridGoal
