import React, { useState, useEffect } from 'react';
import workoutIcon from '../assets/workout.png'
import newGridgoal from '../assets/newGridGoal.png'
import { numberWithCommas } from '../utils/utils';
import bin from '../assets/bin.png'

function ActiveGridGoal({ goalData, onclick, submitNewGoalForm, setIncomingGoalFormData, setDeleteGridgoalID }) {
    // let [isActive, setIsActive] = useState(props.isActive);
    // let [goalData, setgoalData] = useState(goalData);
    // let [isActive, setIsActive] = useState(false);


    const [daysRemaining, setDaysRemaining] = useState("");
    const [hoursRemaining, setHoursRemaining] = useState("");

    const [endDay, setEndDay] = useState(0);
    // const [endHour, setEndHour] = useState(0);
    const [endMonth, setEndMonth] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let endDate = new Date(goalData.due_date);
        let now = new Date();
        let timeLeft = (endDate.getTime() - now.getTime()) / 1000
        setEndMonth(monthNames[endDate.getMonth()])
        // setEndHour(endDate.getHours())
        setEndDay(endDate.getDate())

        setRemainingTime(timeLeft)

        setDaysRemaining(Math.floor(timeLeft / 86400));
        setHoursRemaining(Math.round((timeLeft / 86400 - Math.floor(timeLeft / 86400)) * 24));
    }, [goalData])
    return (
        <>
            {goalData.status ?

                <div className="active-grid-goal-container" onClick={() => onclick(goalData)}>
                    <div className="grid-goal-header">
                        <div className="grid-goal-icon">
                            <img src={workoutIcon} alt="grid"/>
                        </div>
                        <div className="name-date-container">
                            <div className="grid-goal-toprow">
                                <div className="grid-goal-name">
                                    {goalData.title}
                                </div>
                                
                                <div className="grid-goal-delete" onClick={() => setDeleteGridgoalID(goalData.id)}>
                                    <img src={bin} alt="delete grid goal"/>
                                </div>
                            </div>

                            <div className="grid-goal-due-date">
                                Due: {endMonth} {endDay}
                            </div>
                        </div>
                    </div>
                    <div className="grid-goal-progress-bars-container">
                        <div className="progress-container">
                            <div className="time-remaining-text">
                                Remaining Time: {daysRemaining} days, {hoursRemaining} hrs
                    </div>
                            
                            <div className="time-remaining-bar" style={{ width: (Math.max(0, 1 - remainingTime / 86400 / goalData.total_time) * 100) + "%" }}>
                            </div>
                        </div>
                        <div className="progress-container">
                            <div className="completed-text-container">
                                <div className="completed-out-of">
                                    Completed: {numberWithCommas(goalData.total_completed)} out of {numberWithCommas(goalData.value)}
                                </div>
                                <div className="completed-percent">
                                    {Math.round(goalData.total_completed / goalData.value * 100) + "%"}
                                </div>
                            </div>

                            <div className="completed-bar" style={{ width: goalData.total_completed / goalData.value * 100 + "%" }}>

                            </div>
                        </div>

                    </div>


                </div>

                :
                <>
                    <div className="active-grid-goal-container empty" data-modal-event="new-grid-goal" >
                        <div className="add-new-gridgoal">
                            <img src={newGridgoal} alt="add goal"/>
                        </div>
                    </div>
                    {/* <Modal submitNewGoalForm={submitNewGoalForm} dataModalEvent={"placeholder"} setIncomingGoalFormData={setIncomingGoalFormData} /> */}
                </>

            }
        </>
    )
}

export default ActiveGridGoal
