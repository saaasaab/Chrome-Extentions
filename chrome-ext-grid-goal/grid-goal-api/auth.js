const authQueries = require("./auth-queries");
const connection = require("./connection");

async function getLogin(req, res) {
  try {

    let { username, password } = req.body;
    const con = await connection.start();
    const authenticated = await authQueries.authenticateClient(con, username, password);
    con.release();
    let returnValue = authenticated.length > 0 ? authenticated[0].id : -1
    res.json(returnValue);

  }
  catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
}


async function getAllActiveGoalsByUserID(req, res) {
  try {

    let { user_id, username } = req.body;
    const con = await connection.start();

    const activeGoalIds = await authQueries.getActiveGoalIds(con, user_id, username);

    const activeGoals = await authQueries.getActiveGoals(con, activeGoalIds[0].active_goals.split(' '));

    const activeGoalsCleaned = [];
    activeGoals.forEach(activeGoal => {
      activeGoal.progress = JSON.parse(activeGoal.progress);
      activeGoalsCleaned.push({ ...activeGoal })
    });

    con.release();

    res.send(activeGoalsCleaned);
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
}

async function updateGoalsById(req, res) {

  try {
    let { user_id, grid_data } = req.body;
    for (const dataSet of grid_data) {
      let { id, total_completed, progress } = dataSet;

      const con = await connection.start();
      const updateGoals = await authQueries.updateGoalsById(con, user_id, id, total_completed, JSON.stringify(progress));
      con.release();
    }
    // console.log(`activeGoals`, activeGoalsCleaned);
    res.sendStatus(200);
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
}


async function updateGoalsById(req, res) {

  try {
    let { user_id, grid_data } = req.body;
    for (const dataSet of grid_data) {
      let { id, total_completed, progress } = dataSet;

      const con = await connection.start();
      const updateGoals = await authQueries.updateGoalsById(con, user_id, id, total_completed, JSON.stringify(progress));
      con.release();
    }
    // console.log(`activeGoals`, activeGoalsCleaned);
    res.sendStatus(200);
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
}

async function removeGoalId(req, res) {
  try {
    let { user_id, id_to_remove } = req.body;
    const con = await connection.start();
    let goalIds = await authQueries.getGoalIds(con, user_id);
    let idArray = goalIds[0].active_goals.split(' ');
    let removedIdArray = idArray.filter(id => id != id_to_remove);
    let gridIdsCombined = removedIdArray.join(" ");
    const updateIds = await authQueries.updateGoalIds(con, user_id, gridIdsCombined);
    con.release();
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
}


async function createNewGoal(req, res) {
  try {
    let { user_id, new_goal } = req.body;
    const con = await connection.start();
    const updateGoals = await authQueries.createGoal(con, user_id, new_goal);
    const goal_id = updateGoals.insertId;

    let goalIds = await authQueries.getGoalIds(con, user_id);
    goalIds = goalIds[0].active_goals + ` ${new_goal.id}`
    const updateIds = await authQueries.updateGoalIds(con, user_id, goalIds);
    con.release();
    res.send(updateGoals);
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
}
module.exports = {
  getLogin,
  getAllActiveGoalsByUserID,
  updateGoalsById,
  createNewGoal,
  removeGoalId
};
