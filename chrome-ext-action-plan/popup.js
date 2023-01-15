const defaultPlans = [{
    title:'',
    start_date: '',
    due_date:'',
    completed: false,
    objectives:'',
    notes: [],
    action_items:[
        {
            item:'',
            due:''
        }
    ]
}]
const allPlans = JSON.parse(window.localStorage.getItem('ap-all-plans')) || defaultPlans;

function saveInLocal(stateTitle, stateValues) {
    window.localStorage.setItem(stateTitle, JSON.stringify(stateValues));
}

function loadPreSetValues(){
    console.log(`allPlans[activeIndex].title`, allPlans[activeIndex])
    document.getElementById("ap-project-name").value = allPlans[activeIndex].title;
    document.getElementById("ap-start-date").value = allPlans[activeIndex].start_date;
    document.getElementById("ap-due-date").value = allPlans[activeIndex].due_date;
    document.getElementById("ap-budget").value = allPlans[activeIndex].budget;
    document.getElementById("ap-completed").checked = allPlans[activeIndex].completed;
    document.getElementById("ap-project-objectives").value = allPlans[activeIndex].objectives;

    

}


// const dateControl = document.querySelector('input[type="date"]');
// dateControl.value = '2017-06-01';
// console.log(dateControl.value); // prints "2017-06-01"
// console.log(dateControl.valueAsNumber); // prints 1496275200000, 


let activeIndex = 0;

function handleNameChange(e) {
    allPlans[activeIndex].title = e.target.value;
    saveInLocal('ap-all-plans',allPlans);
    console.log(`allPlans`, allPlans)
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
});
