import React, { useState, useEffect } from 'react';
import workoutIcon from '../assets/workout.png'
import newGridgoal from '../assets/newGridGoal.png'
import { numberWithCommas } from '../utils/utils';
import Modal from './Modal';

function ActiveGridGoal({ goalData, onclick, submitNewGoalForm, setIncomingGoalFormData }) {
    // let [isActive, setIsActive] = useState(props.isActive);
    // let [goalData, setgoalData] = useState(goalData);
    // let [isActive, setIsActive] = useState(false);


    const [daysRemaining, setDaysRemaining] = useState("");
    const [hoursRemaining, setHoursRemaining] = useState("");

    const [endDay, setEndDay] = useState(0);
    const [endHour, setEndHour] = useState(0);
    const [endMonth, setEndMonth] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    useEffect(() => {
        let endDate = new Date(goalData.dueDate);
        let now = new Date();
        let timeLeft = ( endDate.getTime() - now.getTime())/1000
        setEndMonth(monthNames[endDate.getMonth()])
        setEndHour(endDate.getHours())
        setEndDay(endDate.getDate())

        setRemainingTime(timeLeft )

        setDaysRemaining(Math.floor(timeLeft/86400));
        setHoursRemaining(Math.round((timeLeft/86400 - Math.floor(timeLeft/86400)) * 24));
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
                                Due: {endMonth } {endDay}
                            </div>
                        </div>
                    </div>
                    <div className="grid-goal-progress-bars-container">
                        <div className="progress-container">
                            <div className="time-remaining-text">
                                Remaining Time: {daysRemaining} days, {hoursRemaining} hrs
                    </div>
                    {console.log((1-remainingTime/86400 / goalData.totalTime) * 100 + "%" )}
                            <div className="time-remaining-bar" style={{ width: (1-remainingTime/86400 / goalData.totalTime) * 100 + "%" }}>

                            </div>
                        </div>
                        <div className="progress-container">
                            <div className="completed-text-container">
                                <div className="completed-out-of">
                                    Completed: {numberWithCommas(goalData.totalCompleted)} out of {numberWithCommas(goalData.value)}
                                </div>
                                <div className="completed-percent">
                                    {Math.round(goalData.totalCompleted / goalData.value* 100) + "%"}
                        </div>
                            </div>

                            <div className="completed-bar" style={{ width: goalData.totalCompleted / goalData.value * 100 + "%" }}>

                            </div>
                        </div>

                    </div>
                </div>

                :
                <>
                <div className="active-grid-goal-container empty" data-modal-event="placeholder" >
                    <div className="add-new-gridgoal">
                        <img src={newGridgoal} />
                    </div>
                </div>

                <Modal submitNewGoalForm={submitNewGoalForm} dataModalEvent={"placeholder"} setIncomingGoalFormData={setIncomingGoalFormData}/>
                </>

            }
        </>
    )
}

export default ActiveGridGoal
