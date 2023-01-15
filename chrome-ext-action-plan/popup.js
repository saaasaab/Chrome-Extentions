const defaultPlans = [{
    title:'',
    start_date: '',
    due_date:'',
    completed: false,
    objectives:'',
    notes: '',
    action_items:[
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
        {
            item:'',
            due:'',
            done: false
        },
    ]
}];

const allPlans = (JSON.parse(window.localStorage.getItem('ap-all-plans')) || defaultPlans);
let activeIndex = 0;
const actionItems = allPlans[activeIndex].action_items;


actionItems?.sort((a,b) => Number(a.due) - Number(b.due));

function saveInLocal(stateTitle, stateValues) {
    window.localStorage.setItem(stateTitle, JSON.stringify(stateValues));
}




function loadPreSetValues(){
    const activePlan = allPlans[activeIndex];
    document.getElementById("ap-project-name").value = activePlan.title;
    document.getElementById("ap-start-date").value = activePlan.start_date;
    document.getElementById("ap-due-date").value = activePlan.due_date;
    document.getElementById("ap-budget").value = activePlan.budget;
    document.getElementById("ap-completed").checked = activePlan.completed;
    document.getElementById("ap-project-objectives").value = activePlan.objectives;
    document.getElementById("ap-notes-and-ideas").value = activePlan.notes

    activePlan.action_items.forEach((item,i)=>{
        document.getElementById(`ap-action-item-title-${i+1}`).value = activePlan.action_items[i].item;
        document.getElementById(`ap-action-item-date-${i+1}`).value = activePlan.action_items[i].due;
        document.getElementById(`ap-action-item-completed-${i+1}`).checked = activePlan.action_items[i].done;
    })
}

function handleNameChange(e) {
    allPlans[activeIndex].title = e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleStartDateChange(e) {
    allPlans[activeIndex].start_date = e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleDueDateChange(e) {
    allPlans[activeIndex].due_date= e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleBudgetChange(e) {
    allPlans[activeIndex].budget= e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleCompletedChange(e) {
    allPlans[activeIndex].completed = e.target.checked;
    saveInLocal('ap-all-plans',allPlans);
}
function handleObjectivesChange(e) {
    allPlans[activeIndex].objectives =e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleNotesChange(e) {
    allPlans[activeIndex].notes =e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}

function handleActionTitleChange(e, i) {
    
    allPlans[activeIndex].action_items[i].item =e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleActionDateChange(e, i) {
    allPlans[activeIndex].action_items[i].due =e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleActionCompleteChange(e, i) {
    allPlans[activeIndex].action_items[i].done =e.target.checked;
    saveInLocal('ap-all-plans',allPlans);
}



const tabs = document.querySelectorAll(".ap-tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const tabId = tab.getAttribute("id");
    const tabContent = document.querySelector(`#${tabId}-content`);

    tabs.forEach(tab => {
      tab.classList.remove("active");
    });
    tab.classList.add("active");

    const tabPanes = document.querySelectorAll(".tab-pane");
    tabPanes.forEach(tabPane => {
      tabPane.classList.remove("active");
    });
    tabContent.classList.add("active");
  });
});






// saveInLocal('dc-active-states', JSON.stringify(activeStates));

window.addEventListener('load', () => {
   
    loadPreSetValues();

    // loads existing data from local storage.

    // Project Overview
    document.getElementById("ap-project-name").addEventListener("change", handleNameChange);
    document.getElementById("ap-start-date").addEventListener("change", handleStartDateChange);
    document.getElementById("ap-due-date").addEventListener("change", handleDueDateChange);
    document.getElementById("ap-budget").addEventListener("change", handleBudgetChange);
    document.getElementById("ap-completed").addEventListener("change", handleCompletedChange);
    document.getElementById("ap-project-objectives").addEventListener("change", handleObjectivesChange);
    document.getElementById("ap-notes-and-ideas").addEventListener("change", handleNotesChange);

    Array.from(Array(13).keys()).forEach((item,i)=>{
        document.getElementById(`ap-action-item-title-${i+1}`).addEventListener('change',(e)=>{handleActionTitleChange(e,i)});
        document.getElementById(`ap-action-item-date-${i+1}`).addEventListener('change',(e)=>{handleActionDateChange(e,i)});
        document.getElementById(`ap-action-item-completed-${i+1}`).addEventListener('change',(e)=>{handleActionCompleteChange(e,i)});

        // document.getElementById(`ap-action-item-date-${i+1}`).value = allPlans[activeIndex].action_items[i].due;
        // document.getElementById(`ap-action-item-completed-${i+1}`).value = allPlans[activeIndex].action_items[i].done;
    })

});
