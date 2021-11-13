
function getActiveGoalIds(connection, username, password) {
	const query = `
    SELECT active_goals FROM users where username = ? AND password = ?	
	`;
	return connection.q(query, [username, password]);
}


function getActiveGoals(connection, active_goals) {
    if(active_goals==="") return ""
	const query = `
    SELECT * FROM goals WHERE id IN (?)
	`;
	return connection.q(query, [active_goals]);
}

function createGoal(con, goalData){

    const query = `
    INSERT INTO goals (
        due_date, 
        icon, 
        multiplier, 
        num_cells, 
        status, 
        title, 
        total_time, 
        value, 
        total_completed,
        progress
         ) VALUES (
    "Sun May 08 2022 00:23:25 GMT-0700 (Pacific Daylight Time)",
    "workout",
    25,200,true,
    "Give 5,000 Dollars in 180 days",723,180,5000,'{"0": 0,"1": 0,"2": 0,"3": 0,"4": 0,"5": 0,"6": 0}');
    `
}


module.exports = {
	getActiveGoals,
    getActiveGoalIds
};