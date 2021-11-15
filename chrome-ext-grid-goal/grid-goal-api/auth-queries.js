
function getActiveGoalIds(connection, id, username) {
    const query = `
    SELECT active_goals FROM users where id = ? and username = ?	
	`;
    return connection.q(query, [id, username]);
}
function authenticateClient(connection, username, password) {
    const query = `
    SELECT id FROM users where username = ? AND password = ?	
	`;
    return connection.q(query, [username, password]);
}

function getActiveGoals(connection, active_goals) {
    if (active_goals === "") return ""
    const query = `
    SELECT * FROM goals WHERE id IN (?)
	`;
    return connection.q(query, [active_goals]);
}

function updateGoalsById(connection, user_id, id, total_completed, progress) {
    
    const query = `
    UPDATE goals SET total_completed = ?, progress = ? WHERE (id = ?);
    `;

    return connection.q(query, [total_completed, progress, id]);
}

function createGoal(connection, user_id, new_goal) {

    let { id,due_date,icon,multiplier,num_cells,status,title,total_time,value,total_completed,progress } = new_goal;

    const query = `
    INSERT INTO goals (
        id,due_date,icon,multiplier,num_cells,status,title,total_time,value,total_completed,progress
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return connection.q(query, [
        id,due_date,icon,multiplier,num_cells,status,title,total_time,value,total_completed,JSON.stringify(progress)]);
}


function getGoalIds(connection,user_id){
    const query = `SELECT active_goals FROM users WHERE id = ?`;
    return connection.q(query, [user_id]);
}

function updateGoalIds(connection,user_id,updateGoalIds){
    const query = `UPDATE users SET active_goals = ?WHERE (id = ?);`;
    return connection.q(query, [updateGoalIds, user_id]);
}



module.exports = {
    getActiveGoals,
    getActiveGoalIds,
    authenticateClient,
    updateGoalsById,
    createGoal,
    getGoalIds,
    updateGoalIds
};