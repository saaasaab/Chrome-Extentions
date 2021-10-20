import React, { useState, useEffect } from 'react';
import workoutIcon from '../assets/workout.png'
import newGridgoal from '../assets/newGridGoal.png'
import { numberWithCommas } from '../utils/utils';
import Modal from './Modal';

function ActiveGridGoal({ goalData, onclick }) {
    // let [isActive, setIsActive] = useState(props.isActive);
    // let [goalData, setgoalData] = useState(goalData);
    // let [isActive, setIsActive] = useState(false);


    const [modalIsOpen, setModalIsOpen] = useState(false);

    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }

    const createNewGoal = () => {
        console.log("Create NEW GOAL")
        setModalIsOpen(true);
    }

    const [daysRemaining, setDaysRemaining] = useState("");
    const [hoursRemaining, setHoursRemaining] = useState("");

    useEffect(() => {
        setDaysRemaining(Math.floor(goalData.remainingTime));
        setHoursRemaining(Math.round((goalData.remainingTime - Math.floor(goalData.remainingTime)) * 24));

    }, [goalData])
    return (
        <>
            {goalData.status ?

                <div className="active-grid-goal-container" onClick={() => onclick(goalData)}>
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

                            <div className="completed-bar" style={{ width: goalData.totalCompleted / goalData.value * 100 + "%" }}>

                            </div>
                        </div>

                    </div>
                </div>

                :
                <>
                <div className="active-grid-goal-container empty" data-modal-event="placeholder" onClick={createNewGoal}>
                    <div className="add-new-gridgoal">
                        <img src={newGridgoal} />
                    </div>
                </div>
                <Modal dataModalEvent={"placeholder"}/>
                </>

            }
        </>
    )
}

export default ActiveGridGoal
