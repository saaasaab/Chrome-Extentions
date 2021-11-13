import React, { useState, useEffect } from "react";


import { mapNumber, getNumColumns } from '../utils/utils';
import GridgoalCell from './GridgoalCell';
import Form from "./Form";
import { saveToLocal,  numberWithCommas} from '../utils/utils'

function handleResize(goal) {
    let gridContainer = document.querySelector('.grid-goal-body-content')
    if (!gridContainer || !goal) {
        return
    }

    let gridDims = gridContainer.getBoundingClientRect();
    let gridWidth = gridDims.width;
    let gridHeight = gridDims.height;

    let numCols = getNumColumns(goal.num_cells, gridWidth, gridHeight - gridHeight * .2)

    let cellSize = Math.max(25, (gridWidth - 5 * (numCols - 1)) / numCols);
    // cellSize = Math.min(cellSize,100)
    let root = document.documentElement;
    let fontSize = mapNumber(goal.num_cells, 0, 200, 40, 10);


    let gridGoalName = mapNumber()

    root.style.setProperty('--cell-font-size', fontSize + "px");
    root.style.setProperty('--grid-goal-name', gridGoalName + "px");
    root.style.setProperty('--cell-width', cellSize + "px");
}

function Gridgoal({ selectedGoal, setGoalDatas, goalDatas, setFormFill }) {

    // const [goal, setGoal] = useState(selectedGoal);
    // const [num_cells, setnum_cells] = useState(goal ? String(goal.num_cells): 0);
    const [formData, setFormData] = useState([]);
    const [perDayText, setPerDayText]= useState('');
    // const [currentSum, setCurrentSum] = useState(0);
    // const [currentSumIndex, setCurrentSumIndex] = useState(0);

    const submitForm = (log) => {
        let tempLog = log;
        if (log === formData) {
            tempLog++;
        }

        setFormData(tempLog);
        let now = new Date();
        let endDate = new Date(selectedGoal.due_date);
        let daysLeft = Math.floor((endDate.getTime() - now.getTime()) / 1000 / 86400);
        let totalDays = selectedGoal.total_time;
        // let dayNum = daysLeft
        let dayNum = Math.floor(totalDays - daysLeft);

        // let todaysTotal = selectedGoal.progress[dayNum];

        if(Number(log) < 0){
            log = Math.max(-1*selectedGoal.progress[dayNum],log)
        }
        selectedGoal.progress[dayNum] += Number(log);

        selectedGoal.total_completed += Number(log);
        selectedGoal.total_completed = Math.max(0, Math.min(selectedGoal.total_completed, selectedGoal.value))

        
     
        // Why am I using this?
        // localStorage.setItem(`gridgoal-activity-${selectedGoal.id}`, selectedGoal.total_completed);

        // setGoal(selectedGoal)

        let goalIndex = -1;
        for (let i = 0; i < goalDatas.length; i++) {
            if (selectedGoal.id === goalDatas[i].id) {
                goalIndex = i;
            }
        }

        
        let total_completed = Object.keys(selectedGoal.progress).map(elem => selectedGoal.progress[elem]).reduce((partial_sum, a) => partial_sum + a, 0);
        total_completed = Math.max(0, Math.min(total_completed,selectedGoal.value));
        selectedGoal.total_completed = total_completed;
        goalDatas[goalIndex]["total_completed"] = Math.max(0, Math.min(total_completed,selectedGoal.value));

        setGoalDatas(goalDatas);
        saveToLocal("grid-goal-activity-data", goalDatas);
        setFormFill(Date.now());
    };

    useEffect(() => {
        // setnum_cells(selectedGoal?String(selectedGoal.value):0);
        handleResize(selectedGoal)
        handleResize(selectedGoal)
        window.addEventListener('resize', () => { handleResize(selectedGoal) });

        if(selectedGoal){
            let verbNumberNoun= selectedGoal.title.split(`in ${selectedGoal.total_time} day`)[0]
            let verb = verbNumberNoun.split(` ${numberWithCommas(selectedGoal.value)} `)[0]
            let noun = verbNumberNoun.split(` ${numberWithCommas(selectedGoal.value)} `)[1]
            
            let now = new Date();
            let endDate = new Date(selectedGoal.due_date);
            let daysLeft = Math.floor((endDate.getTime() - now.getTime()) / 1000 / 86400);
            let perDayValue = (selectedGoal.value - selectedGoal.total_completed)/daysLeft

            perDayValue = perDayValue < 1 ? Number.parseFloat(perDayValue).toFixed(1) :Math.round(perDayValue);    

            let daytext = `${verb} ${perDayValue} ${noun} per day to complete your Grid Goal`;
            setPerDayText(daytext )
        }
        
    }, [selectedGoal])

    return (
        <div className="grid-goal-container">
            <div>
            <div className="grid-goal-header-container">

                <div className="grid-goal-title">
                    {selectedGoal ? selectedGoal.title : "Click the '+' to create your first Grid Goal"}
                </div>
                {goalDatas.length > 0 ?
                    <Form submitForm={submitForm} /> : <></>}
            </div>
            </div>
            <h4 className="preview-text-per-basis">{ perDayText}</h4>
            <div className="grid-goal-body-content-container">
                <div className="grid-goal-body-content">
                    
                    {goalDatas.length > 0 ? [...Array(selectedGoal.num_cells).keys()].map(function(numCell){
                        let progress = selectedGoal.progress;

                        let counter = numCell* selectedGoal.multiplier;

                        
                        // if the the current counter is less than the the sum, set the opacity to the keyof the progress object
                        let progressArray =  Object.keys(progress).map(elem => progress[elem]);
                        let cumulativeSum = progressArray.map((sum => value => sum += value)(0));
                        let cumulativeSumLength=cumulativeSum.length;

                        let day = 0;
                        for (let i = 0; i <cumulativeSumLength; i++ ){
                            if(counter < cumulativeSum[i]){
                                day = i;
                                break;
                            }
                        }
                        // setCurrentSum(progressArray[currentSumIndex]);
                       
                        
                        // let total_completed = .map(elem => progress[elem]).reduce((partial_sum, a) => partial_sum + a, 0);
                        // This is where I left off. Its supposed to break so it errors. 
                        
                        return(
                        <GridgoalCell
                            key={numCell}
                            index={numCell}
                            multiplier={selectedGoal.multiplier}
                            num_cells={selectedGoal.num_cells}
                            completedTotal={selectedGoal.total_completed}
                            total={selectedGoal.value}
                            day={day}
                        />)

                    }) : <></>}
                </div>
            </div>
        </div>
    )
}

export default Gridgoal
