import Navbar from "./Components/Navbar";
import ActiveGridGoal from "./Components/ActiveGridGoal";
import Gridgoal from "./Components/Gridgoal"
import './App.css';



function App() {
  return (
    <div className="App">
      <Navbar/>
      <div className="page-content">
        <div className="active-grid-goals-container">
          <ActiveGridGoal isActive={true}/>
          <ActiveGridGoal isActive={true}/>
          <ActiveGridGoal isActive={false}/>
          <ActiveGridGoal isActive={false}/>
        </div>
    
        <Gridgoal/>
       
      </div>
    </div>
  );
}

export default App;
