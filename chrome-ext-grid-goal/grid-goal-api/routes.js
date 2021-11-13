const Auth = require('./auth');

module.exports = {
	configure: app => {
		app.post("/login",  function(req, res){
            Auth.getLogin(req,res)
          });
	}
}