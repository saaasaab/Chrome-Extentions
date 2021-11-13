const authQueries = require("./auth-queries");
const connection = require("./connection");

async function getLogin(req, res) {
  // console.log(`req.body`, req.body)
  try {

    let { username, password } = req.body;
    const con = await connection.start();

    const activeGoalIds = await authQueries.getActiveGoalIds(con, username, password);

    console.log(activeGoalIds[0].active_goals.split(','))
    
    const activeGoals = await authQueries.getActiveGoals(con, activeGoalIds[0].active_goals.split(','));
    

    const activeGoalsCleaned = [];
    activeGoals.forEach(activeGoal => {
      activeGoal.progress = JSON.parse(activeGoal.progress);

      activeGoalsCleaned.push({...activeGoal})      
    });

    con.release();
    console.log(`activeGoals`, activeGoalsCleaned);
    res.send(activeGoalsCleaned);
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
}

module.exports = {
  getLogin
};
