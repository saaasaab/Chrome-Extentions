var mysql = require('mysql');

/* global __error */

function Connection() {
	this.pool = null;

	this.connectionListeners = [];

	this.addConnectionListener = function(func) {
		// console.log('adding connection listener');
		this.connectionListeners.push(func);
	}

	this.init = function() {

		this.pool = mysql.createPool({
			// connectionLimit: 25,
			// host: process.env.db_host,
			// port: "3306",
			// user: process.env.db_user,
			// password: process.env.db_password || "pitch-twitter-flipper",
			// database: "ybl",
			// time_zone: "America/Los_Angeles",
			// charset: "latin1"
			host: "localhost",
			user: "root",
			password: "laughlin_11217",
			database: "gridgoal",
		});

		this.pool.on('connection', function onConnection(connection) {
			if (!connection.query_altered) {
				connection.query = (function() {
					var cached_query = connection.query;
					connection.query_altered = true;
					return function() {
						connection.last_query_time = new Date();
						connection.last_query = arguments[0];
						var result = cached_query.apply(this, arguments);

						return result;
					}
				})();
			}

			connection.query('SET time_zone = ?', 'America/Los_Angeles');
			connection.query('SET GLOBAL group_concat_max_len=65536');
			connection.last_query_time = new Date();
		});

		this.pool.on('enqueue', function() {
			console.log('UH OH! Waiting for available connection slot');
		});

		this.connectionListeners.forEach(func => { console.log('calling connection listener'); func() });
	};

	setInterval(() => {
		//if pool is set up
		if (this.pool) {
			//set up expiration time
			var expireTime = new Date();
			//expireTime.setMinutes(expireTime.getMinutes() - 1);
			expireTime.setSeconds(expireTime.getSeconds() - 45);

			var closeTime = new Date();
			closeTime.setMinutes(closeTime.getMinutes() - 1);

			//loop through all connections
			this.pool._allConnections.forEach((con, index) => {

				//check if this connection is in free pool, if free check if it has had any activity for 10 minutes
				if (this.pool._freeConnections.indexOf(con) > -1) {

					//if connection hasn't been used for 10 minutes, end it completely
					let closeConnections = 0;
					if (con.last_query_time && con.last_query_time.valueOf() < closeTime.valueOf()) {
						++closeConnections;
						con.destroy();
					}
					// if (closeConnections > 0) console.log(colors.dim.yellow("Closed " + closeConnections + " connections"));
				} else {

					//if connection is not free and has not run a query for 2 minutes, it's hanging and needs to be released
					if (con.last_query_time && con.last_query_time.valueOf() < expireTime.valueOf()) {

						//log query that was never released
						// console.log("UNCLOSED QUERY TIME", con.last_query_time);
						console.log("UNCLOSED QUERY", con.last_query);

						//release connection
						try {
							con.release();
						} catch (e) {
							console.error(__error, e);
						}

					}
				}
			});
		}
	}, 10000);

	this.acquire = function(callback) {
		this.pool.getConnection(function(err, connection) {
			callback(err, connection);
		});
	};

	this.start2 = () => {
		return new Promise((resolve, reject) => {
			// const init = Date.now();
			const connection = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "password",
				database: "gridgoal",
			});

			//wrap query function in our own internal accessors
			connection.q = (...args) => {
				return new Promise((resolve, reject) => {
					connection.query(...args, (err, result) => {
						if (err) reject(err);
						else resolve(result);
					});
				});
			}

			connection.qlog = (...args) => {
				return new Promise((resolve, reject) => {
					connection.query(...args, (err, result) => {
						if (err) {
							console.error(__error, err);
							reject(err);
						}
						else resolve(result);
					});
				});
			}

			//destroy connection as soon as it is finished
			connection.release = () => {
				connection.destroy();
				// console.log(Date.now() - init + "ms connection open time");
			}

			connection.connect(err => {
				if (err) reject(err);
				else resolve(connection);
			});
		});
	}

	this.start = function() {
		return new Promise((resolve, reject) => {
			this.pool.getConnection(function(err, connection) {
				if (err) {
					reject(err);
				} else {
					// const init = Date.now();
					if (!connection.query_altered) {
						connection.query = (function() {
							var cached_query = connection.query;
							connection.query_altered = true;
							return function() {
								connection.last_query_time = new Date();
								connection.last_query = arguments[0];
								var result = cached_query.apply(this, arguments);

								return result;
							}
						})();
					}

					connection.q = (query, args) => {
						//connection.last_query_time = new Date();
						return new Promise((resolve, reject) => {
							connection.query(query, args, (err, results) => {
								if (err) {
									reject(err);
								} else {
									resolve(results);
								}
							});
						});
					}

					connection.qlog = (query, args) => {
						return new Promise((resolve, reject) => {
							connection.query(query, args, (err, results) => {
								if (err) {
									console.error(__error, err);
									reject(err);
								} else {
									resolve(results);
								}
							});
						});
					};

					resolve(connection);

				}
			});
		});
	}

	this.useSocketio = function() {
		return true;
	}

}

module.exports = new Connection();
