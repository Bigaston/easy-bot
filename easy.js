const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch")
var fs = require('fs');
var shell = require('shelljs');
var path = require('path');

// Import JSON Files'
const package = require("./package.json")
var script = require("./script.json");
const lang = require("./lib/lang.json");
const config = require("./config.json");

const bcrypt = require("bcrypt");

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ user: {}, number: 0, token: ""})
	.write();

var cookieSession = require('cookie-session')
const express = require('express');
const app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(cookieSession({
	name: 'session',
	keys: config.secret_key,
  
	// Cookie Options
	maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

var randtoken = require('rand-token');


if (db.get("token").value() == "") {
	db.set("token", randtoken.generate(32)).write()
}

// Import lib and function
eval(fs.readFileSync("./lib/function.js").toString());
console.log(sendLang("importGlobal"));
const channel = require("./lib/channel.js");
const date = require("./lib/date.js");
const message = require("./lib/message.js");
const role = require("./lib/role.js");
const game = require("./lib/game.js");
const server = require("./lib/server.js");

//Verification of the neededs parameters
startVerif();

client.login(script["@token@"]);

client.on("ready", async () => {
	console.log(sendLang("discordLogin"));

	var clientGuild = client.guilds.array();
	for (var i=0; i < clientGuild.length; i++) {
		serveurObj = client.guilds.get(clientGuild[i].id);
		changeNickname(serveurObj);
	}

	changeGame();
});

client.on("message", message => {
	// Commands
	if(message.author.bot) return;
	if (message.content.startsWith(script["@prefix@"])) {
		args = message.content.split(/[ ]+/);
	} else {
		return;
	}

	var sscript = clone(script);
	args[0] = args[0].replace(script["@prefix@"], "").toLowerCase();

	if (checksecurity(args) == false) {
		if ("#errorCommand#" in sscript) {
			message.channel.send(sscript["#errorCommand#"]);
		}
		return;
	}

	i = 0;
	while (i < args.length) {
		if (args[i] in sscript) {
			if (Array.isArray(sscript[args[i]])) {
				var response = chooseResponse(sscript[args[i]]);
				response = replaceCommandArg(response, args, message);
				if (response != "") {
					message.channel.send(response);
				}
			} else if (typeof(sscript[args[i]]) == "object") {
				sscript = clone(sscript[args[i]])
				if (channel.trigger(sscript, message) == 0) {
					if (i == args.length - 1) {
						if ("#errorCommand#" in sscript) {
							response = sscript["#errorCommand#"]
							response = replaceCommandArg(response, args, message);
							if (response != "") {
								message.channel.send(response);
							}
						}
					}
				} else {
					sscript = channel.trigger(sscript, message);
					if (Array.isArray(sscript)) {
						var response = chooseResponse(sscript);
						response = replaceCommandArg(response, args, message);
						if (response != "") {
							message.channel.send(response);
						}
					} else if (typeof(sscript) == "object") {
						if (args.length == 0) {
							i--;
						}
					} else {
						var response = sscript;
						response = replaceCommandArg(response, args, message);
						if (response != "") {
							message.channel.send(response);
						}
					}
				}
			} else {
				var response = sscript[args[i]];
				response = replaceCommandArg(response, args, message);
				if (response != "") {
					message.channel.send(response);
				}
			}
		} else if ("#default#" in sscript) {
			if (Array.isArray(sscript["#default#"])) {
				var response = chooseResponse(sscript["#default#"]);
				response = replaceCommandArg(response, args, message);
				if (response != "") {
					message.channel.send(response);
				}
			} else if (typeof(sscript["#default#"]) == "object") {
				sscript = clone(sscript["#default#"])
				if (i == args.length - 1) {
					if ("#errorCommand#" in sscript) {
						response = sscript["#errorCommand#"]
						response = replaceCommandArg(response, args, message);
						if (response != "") {
							message.channel.send(response);
						}
					}
				}
			} else {
				var response = sscript["#default#"];
				response = replaceCommandArg(response, args, message);
				if (response != "") {
					message.channel.send(response);
				}
			}
		} else if ("#errorCommand#" in sscript) {
			response = sscript["#errorCommand#"]
			response = replaceCommandArg(response, args, message);
			if (response != "") {
				message.channel.send(response);
			}
		}

		i++;
	}
})

client.on("guildMemberAdd", user => {
	// Detect user join
	if ("#userJoin#" in script) {
		var text = script["#userJoin#"]
		text = text.replace("%user%", `<@${user.id}>`)
		text = replaceGlobalArg(text, user.guild)
		text = server.param(text, user.guild);
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})

client.on("guildMemberRemove", user => {
	// Detect user leave
	if ("#userLeave#" in script) {
		var text = script["#userLeave#"]
		text = text.replace("%user%", user.displayName)
		text = replaceGlobalArg(text, user.guild)
		text = server.param(text, user.guild);
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})

client.on("guildCreate", guild => {
	//Detect a new Discord server
	if ("@infoChannel@" in script) {
		client.channels.get(script["@infoChannel@"]).send(sendLang("join").replace("${botname}", client.user.username));
	}
})

app.get('/', function(req, res) {
	if (config.online_login) {
		if (db.get("number").value() == 0) {
			res.sendFile(__dirname + "/web/createuser.html");
		} else {
			res.sendFile(__dirname + "/web/index.html")
		}
	} else {
		res.redirect("/dashboard")
	}

});

app.get("/dashboard", function(req, res) {
	if (config.online_login) {
		if (req.session.token == db.get("user." + req.session.name + ".token").value()) {
			res.sendFile(__dirname + "/web/dashboard.html")
		} else {
			res.redirect("/")
		}
	} else {
		res.sendFile(__dirname + "/web/dashboard.html")
	}

})

app.get("/get_code", function(req, res) {
	if (config.online_login) {
		if (req.session.token == db.get("user." + req.session.name + ".token").value()) {
			res.status(200).json({version: package.version, code: script, api: db.get("token").value()});
		} else {
			res.status(403)
		}
	} else {
		res.status(200).json({version: package.version, code: script, api: db.get("token").value()});
	}
})

app.post("/update", function(req, res) {
	if (config.online_login) {
		if (req.session.token == db.get("user." + req.session.name + ".token").value()) {
			script = JSON.parse(req.body.code)
			var clientGuild = client.guilds.array();
			for (var i=0; i < clientGuild.length; i++) {
				serveurObj = client.guilds.get(clientGuild[i].id);
				changeNickname(serveurObj);
			}
		
			changeGame();

			fs.writeFile('script.json', req.body.code, 'utf8', function(err, data) {
				if (err) throw err;
				res.redirect("/dashboard")
			});
		} else {
			res.status(403)
		}
	} else {
		script = JSON.parse(req.body.code)

		var clientGuild = client.guilds.array();
		for (var i=0; i < clientGuild.length; i++) {
			serveurObj = client.guilds.get(clientGuild[i].id);
			changeNickname(serveurObj);
		}
	
		changeGame();

		fs.writeFile('script.json', req.body.code, 'utf8', function(err, data) {
			if (err) throw err;
			res.redirect("/dashboard")
		});
	}
})

app.post("/newuser", function(req, res) {
	if (db.get("user." + req.body.name).value() == undefined) {
		password = bcrypt.hashSync(req.body.password, 12);

		db.set("user." +  req.body.name, {"password" : password, "token" : ""}).write()
		db.update("number", n => n + 1).write()

		res.redirect("/");
	}
})

app.post("/editpassword", function(req, res) {
	if (req.session.token == db.get("user." + req.session.name + ".token").value()) {
		password = bcrypt.hashSync(req.body.password, 12);

		db.set("user." +  req.session.name, {"password" : password, "token" : ""}).write()
		req.session.token = "nothing";
		res.redirect("/");
	}
})

app.post("/login", function(req, res) {
	if (db.get("user." + req.body.name).value() != undefined) {
		if (bcrypt.compareSync(req.body.password, db.get("user." + req.body.name).value().password)) {
			var token = randtoken.generate(32);
			db.set("user." + req.body.name + ".token", token).write();

			req.session.token = token;
			req.session.name = req.body.name;
			res.redirect("/dashboard")
		} else {
			res.redirect("/");
		}
	} else {
		res.redirect("/");
	
	}
})

app.get("/update_bot", function(req, res){
	if (config.online_login) {
		if (req.session.token == db.get("user." + req.session.name + ".token").value()) {
			shell.exec("git reset --hard && git pull", (code, stdout, stderr) => {
				if (code == 0) {
					shell.exec("npm install", (code, stdout, stderr) => {
						if (code == 0) {
							if (path.basename(__filename) == "easy.js") {
								process.exit();	
								res.send("Maj OK! Please refresh this page!")
							} else {
								shell.exec("rm -r " + path.basename(__filename), (code, stdout, stderr) => {
									if (code==0) {
										shell.exec("mv easy.js " + path.basename(__filename), (code, stdout, stderr) => {
											if (code == 0) {
												res.redirect("/dashboard");
												process.exit();			
											} else {
												res.send("Error : " + stdout + " - " + stderr);
											}
										})
									} else {
										res.send("Error : " + stdout + " - " + stderr);
									}
								})
							}
						} else {
							res.send("Error : " + stdout + " - " + stderr);
						}
					});
				} else {
					res.send("Error : " + stdout + " - " + stderr);
				}
			})
		} else {
			res.status(403)
		}
	} else {
		shell.exec("git reset --hard && git pull", (code, stdout, stderr) => {
			if (code == 0) {
				shell.exec("npm install", (code, stdout, stderr) => {
					if (code == 0) {
						if (path.basename(__filename) == "easy.js") {
							process.exit();	
							res.send("Maj OK! Please refresh this page!")
						} else {
							shell.exec("rm -r " + path.basename(__filename), (code, stdout, stderr) => {
								if (code==0) {
									shell.exec("mv easy.js " + path.basename(__filename), (code, stdout, stderr) => {
										if (code == 0) {
											res.redirect("/dashboard");
											process.exit();			
	
										} else {
											res.send("Error : " + stdout + " - " + stderr);
										}
									})
								} else {
									res.send("Error : " + stdout + " - " + stderr);
								}
							})
						}
					} else {
						res.send("Error : " + stdout + " - " + stderr);
					}
				});
			} else {
				res.send("Error : " + stdout + " - " + stderr);
			}
		})
	}

})

app.post("/api/:event", function(req, res){
	if (req.query.t != db.get("token").value()) {
		res.send(403)
		return;
	}

	if ("?" + req.params.event + "?" in script) {
		text = script["?" + req.params.event + "?"]
		body = req.body;
		key = Object.keys(body);

		// Ko-Fi exception
		if (key.length == 1 && key[0] == "data") {
			body = JSON.parse(body["data"]);
			key = Object.keys(body);
		}
		
		for (i = 0; i < key.length; i++) {
			text = text.replace("%web:" + key[i] + "%", body[key[i]])
		}


		text = replaceGlobalArg(text);
		text = game.event(text, client);
		text = channel.event(text, client);

		res.status(200).send(text);
	} else {
		res.send(404)
	}
})

app.listen(config.port, function() {
	console.log(sendLang("startExpress").replace("${port}", config.port));
});