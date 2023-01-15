// const dateControl = document.querySelector('input[type="date"]');
// dateControl.value = '2017-06-01';
// console.log(dateControl.value); // prints "2017-06-01"
// console.log(dateControl.valueAsNumber); // prints 1496275200000, 
const plans = [{
    title:'',
    start_date: '',
    due_date:0,
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