import React, { useState, useEffect } from 'react';
import workoutIcon from '../assets/workout.png'
import newGridgoal from '../assets/newGridGoal.png'

function ActiveGridGoal(props) {
    let [isActive, setIsActive] = useState(props.isActive);


    useEffect(() => {
        setIsActive(props.isActive)
    }, [props])
    return (
        <>
            {isActive ?

                <div className="active-grid-goal-container">
                    <div className="grid-goal-header">
                        <div className="grid-goal-icon">
                            <img src={workoutIcon} />
                        </div>
                        <div className="name-date-container">
                            <div className="grid-goal-name">
                                Workout 30 times
                    </div>
                            <div className="grid-goal-due-date">
                                Due: March 7th, 2021
                    </div>
                        </div>
                    </div>
                    <div className="grid-goal-progress-bars-container">
                        <div className="progress-container">
                            <div className="time-remaining-text">
                                Remaining Time: 3 days, 5 hrs
                    </div>
                            <div className="time-remaining-bar">

                            </div>
                        </div>
                        <div className="progress-container">
                            <div className="completed-text-container">
                                <div className="completed-out-of">
                                    Completed: 19 out of 30
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
