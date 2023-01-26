const defaultPlan = {
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
};

let allPlans = (JSON.parse(window.localStorage.getItem('ap-all-plans')) || [{...defaultPlan}]);


let activeIndex = 0;

// const actionItems = allPlans[activeIndex].action_items;
// actionItems?.sort((a,b) => Number(a.due) - Number(b.due));
// allPlans[activeIndex].action_items = [...actionItems]

function saveInLocal(stateTitle, stateValues) {
    window.localStorage.setItem(stateTitle, JSON.stringify(stateValues));
}

function loadPreSetValues(){
    const activePlan = allPlans[activeIndex];
    document.getElementById("ap-project-name").value = activePlan.title ?? '';
    document.getElementById("ap-start-date").value = activePlan.start_date ?? '';
    document.getElementById("ap-due-date").value = activePlan.due_date ?? '';
    document.getElementById("ap-budget").value = activePlan.budget ?? '';
    document.getElementById("ap-completed").checked = activePlan.completed ?? '';
    document.getElementById("ap-project-objectives").value = activePlan.objectives ?? '';
    document.getElementById("ap-notes-and-ideas").value = activePlan.notes ?? '';

    activePlan.action_items.forEach((item,i)=>{
        document.getElementById(`ap-action-item-title-${i+1}`).value = activePlan.action_items[i].item ?? '';
        document.getElementById(`ap-action-item-date-${i+1}`).value = activePlan.action_items[i].due ?? '';
        document.getElementById(`ap-action-item-completed-${i+1}`).checked = activePlan.action_items[i].done ?? '';
    })
}

function handleNameChange(e) {
    allPlans[activeIndex].title = e.target.value;
    const tab = document.querySelector(`#tab${activeIndex}`);
    tab.innerHTML = e.target.value;
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
    allPlans[activeIndex].notes=e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleActionTitleChange(e, i) {
    allPlans[activeIndex].action_items[i].item =e.target.value;
    saveInLocal('ap-all-plans',allPlans);
}
function handleActionDateChange(e, i) {
    allPlans[activeIndex].action_items[i].due =e.target.value;
    saveInLocal('ap-all-plans',allPlans);
    addConditionalFormatting()
}
function handleActionCompleteChange(e, i) {
    allPlans[activeIndex].action_items[i].done =e.target.checked;
    saveInLocal('ap-all-plans',allPlans);
}

function resetTabs(){
    document.querySelector('.tab-header').innerHTML=`<img class="ap-add-tab" src="add-icon.svg" alt="Add new tab SVG" />`;
    allPlans.forEach((plan,i)=>{
        addTabsToPage(plan,i);
    });
}

function resetFields(){
    document.querySelectorAll('input[type=checkbox]').forEach(input => input.checked === false);
    document.querySelectorAll('input[type=text]').forEach(input => input.value === '')
    document.querySelectorAll('textarea').forEach( input => input.value === '')
}

function addTab(){
    allPlans.push({...defaultPlan});
    saveInLocal('ap-all-plans',allPlans);

    activeIndex = allPlans.length - 1;
    resetTabs();
    resetFields();
    addTabFunctionality()
    loadPreSetValues();
    activateHandlers();
    addConditionalFormatting()
}

function toDate(dateStr){
    const [day, month, year] = dateStr.split("-")
    return new Date(year, month - 1, day)
  }

function addConditionalFormatting() {

    const dateFormatted = new Date().toLocaleDateString().slice(0, 10)
    const dates = document.querySelectorAll(".ap-action-item-date");

    const todayDate = new Date(dateFormatted).getTime();
   
     // ascertain the timezone offset
    const timeOffset = (new Date()).getTimezoneOffset() * 60 * 1000


    dates.forEach(date=>{
         // compensate for the weirdness
         const milliseconds = date.valueAsNumber + timeOffset
         // make a real date object
         const inputDate = new Date(milliseconds)
        
        const dueDate = new Date(inputDate).toLocaleDateString().slice(0, 10);
        const newDate = new Date(dueDate).getTime();

        if(!date.value){
            date.style.backgroundColor = "var(--white)"
        }
        // EXPIRED
        else if( newDate < todayDate){
            date.style.backgroundColor = "#ffe4e4"
        }
        // DUE
        else if( newDate === todayDate){
            date.style.backgroundColor = "#fdfdd1"
        }
        // UPCOMING
        else if( newDate > todayDate){
            date.style.backgroundColor = "#d4ffd4"
        }


    })
}

function addTabsToPage(plan, i){
    const isActive = activeIndex === i? 'active':'';
    const tabHTML =  `<div class="ap-tab ${isActive}" id="tab${i}">${plan.title || 'New Tab'}</div>`
    document.querySelector('.ap-add-tab').insertAdjacentHTML("beforebegin",tabHTML);
    document.querySelector(".ap-add-tab").addEventListener("click", addTab);
}


function addTabFunctionality(){
    const tabs = document.querySelectorAll(".ap-tab");
    tabs.forEach((tab,i) => {
        
        tab.addEventListener("click", () => {
            activeIndex = i;
            loadPreSetValues()
            activateHandlers();
            const tabId = tab.getAttribute("id");
            // const tabContent = document.querySelector(`#${tabId}-content`);

            tabs.forEach(tab => {
                tab.classList.remove("active");
            });
            tab.classList.add("active");

            const tabPanes = document.querySelectorAll(".tab-pane");
            tabPanes.forEach(tabPane => {
                tabPane.classList.remove("active");
            });

            addConditionalFormatting()
            // tabContent.classList.add("active");
        });
          
        tab.addEventListener('long-press', function (e) {
            if(allPlans.length==1) return;
            
            tab.remove();
            allPlans = allPlans.filter((plan,index) => index !== i)

            saveInLocal('ap-all-plans',allPlans);

            resetTabs();
            addTabFunctionality();

            activeIndex = 0;
        });
    });

}

function  activateHandlers(){
    document.getElementById("ap-project-name").addEventListener("change", handleNameChange);
    document.getElementById("ap-start-date").addEventListener("change", handleStartDateChange);
    document.getElementById("ap-due-date").addEventListener("change", handleDueDateChange);
    document.getElementById("ap-budget").addEventListener("change", handleBudgetChange);
    document.getElementById("ap-completed").addEventListener("change", handleCompletedChange);
    document.getElementById("ap-project-objectives").addEventListener("change", handleObjectivesChange);
    document.getElementById("ap-notes-and-ideas").addEventListener("change", handleNotesChange);
    document.querySelector(".ap-add-tab").addEventListener("click", addTab);

    Array.from(Array(13).keys()).forEach((item,i)=>{
        document.getElementById(`ap-action-item-title-${i+1}`).addEventListener('change',(e)=>{handleActionTitleChange(e,i)});
        document.getElementById(`ap-action-item-date-${i+1}`).addEventListener('change',(e)=>{handleActionDateChange(e,i)});
        document.getElementById(`ap-action-item-completed-${i+1}`).addEventListener('change',(e)=>{handleActionCompleteChange(e,i)});

    })

}


// saveInLocal('dc-active-states', JSON.stringify(activeStates));

window.addEventListener('load', () => {
    // loads existing data from local storage.
    loadPreSetValues();


    activateHandlers();
    
    allPlans.forEach((plan,i)=>{
        addTabsToPage(plan,i);
    })

    addTabFunctionality();

    addConditionalFormatting();
});
