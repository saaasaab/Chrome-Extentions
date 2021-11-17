const Auth = require('./auth');

module.exports = {
	configure: app => {
		app.post("/login", function (req, res) {
			Auth.getLogin(req, res);
		});
		app.post("/all-goals-by-id", function (req, res) {
			Auth.getAllActiveGoalsByUserID(req, res);
		});

		app.post("/update_goals_by_id", function (req, res) {
			Auth.updateGoalsById(req, res);
		});

		app.post("/create-new-goal", function (req, res) {
			Auth.createNewGoal(req, res);
		});

		app.post("/remove-goal-id", function (req, res) {
			Auth.removeGoalId(req, res);
		});

		app.post("/create-account", function (req, res) {
			Auth.createAccount(req, res);
		});
	}
}