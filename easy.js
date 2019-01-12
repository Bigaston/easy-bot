const config = require("./config.json")

const Discord = require("discord.js");
const client = new Discord.Client();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

var express = require('express');
var app = express();

var bodyParser = require('body-parser')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'pug');
app.set('views', './views')
app.use(express.static("./static/"))

var version = "0.3.0";

db.defaults({ serveur : [] })
  .write()

client.login(config.token);

client.on("ready", async () => {
	client.user.setActivity(version);
	verifyGuilds();

	var serveurList = db.get("serveur").value()

	for (var i=0; i < serveurList.length; i++) {
		serveurObj = client.guilds.get(serveurList[i].id);
		changeNickname(serveurObj);
	}
});

function verifyGuilds() {
	// Detect if serveur is in the API or not
	var clientGuild = client.guilds.array();

	for (var i=0; i < clientGuild.length; i++) {
		if (db.get("serveur").find({ id: clientGuild[i].id}).value() == undefined) {
			db.get("serveur").push({ id: clientGuild[i].id, code: {"@prefix@": "!"}}).write()
		}
	}
}

function changeNickname(pServeur) {
	// Detect if the bot username is different
	var script = db.get("serveur").find({ id: pServeur.id}).value().code;
	if ("@customName@" in script) {
		if (pServeur.me.displayName != script["@customName@"]) {
			pServeur.me.setNickname(script["@customName@"]);
		}
	}
}

function chooseResponse(pTable) {
	// Choose a response in pTable
	return pTable[Math.floor(Math.random() * pTable.length)]
}

function replaceCommandArg(pText, pArgs, pMessage) {
	// Replace the args balise in the text
	
	let text = pText
	 
	for (var i=0; i < pArgs.length; i++) {
		var reg = new RegExp("%" + i + "%", "g")
		text = text.replace(reg, pArgs[i])
	}

	text = text.replace("%me%", pMessage.author.username)
	text = text.replace("%all%", pMessage.content.replace(pArgs[0] + " ", ""))
	
	text = replaceGlobalArg(text, pMessage.guild);

	text = text.replace(/%[0-9]*%/gi, "nothing")
	return text
}

function replaceGlobalArg(pText, pServ) {
	var text = pText;

	text = text.replace("%someone%", pServ.members.random().displayName)
	
	// Repalacement for random number
	if (text.match(/%[0-9]*-[0-9]*%/g) != undefined) {
		let number = text.match(/%[0-9]*-[0-9]*%/g);
		for (var i=0; i < number.length; i++) {
			let min = number[i].match(/%[0-9]*-/)[0];
			min = min.replace("%", "").replace("-", "");
			min = parseInt(min);
			let	max = number[i].match(/-[0-9]*%/)[0];
			max = max.replace("%", "").replace("-", "");
			max = parseInt(max);
			let randomNumber = Math.floor(Math.random() * max) + min;
			text = text.replace(/%[0-9]*-[0-9]*%/, randomNumber)
		}
		
	}

	return text;
}

function clone(obj) {
	// Command to clone the script object
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

client.on("message", message => {
	// Commands
	var script = db.get("serveur").find({ id: message.guild.id}).value().code;
	if(message.author.bot) return;
	if (message.content.startsWith(script["@prefix@"])) {
		args = message.content.split(/[ ]+/);
	} else {
		return;
	}

	var sscript = clone(script);
	args[0] = args[0].replace(script["@prefix@"], "");

	for (var i=0; i < args.length; i++) {
		if (args[i] in sscript) {
			if (Array.isArray(sscript[args[i]])) {
				var response = chooseResponse(sscript[args[i]]);
				response = replaceCommandArg(response, args, message);
				message.channel.send(response);
			} else if (typeof(sscript[args[i]]) == "object") {
				sscript = clone(sscript[args[i]])
				if (i == args.length - 1) {
					if ("#errorCommand#" in sscript) {
						message.channel.send(sscript["#errorCommand#"]);
					}
				}
			} else {
				var response = sscript[args[i]];
				response = replaceCommandArg(response, args, message);
				message.channel.send(response);
			}
		} else if ("#default#" in sscript) {
			if (Array.isArray(sscript["#default#"])) {
				var response = chooseResponse(sscript["#default#"]);
				response = replaceCommandArg(response, args, message);
				message.channel.send(response);
			} else if (typeof(sscript["#default#"]) == "object") {
				sscript = clone(sscript["#default#"])
				if (i == args.length - 1) {
					if ("#errorCommand#" in sscript) {
						message.channel.send(sscript["#errorCommand#"]);
					}
				}
			} else {
				var response = sscript["#default#"];
				response = replaceCommandArg(response, args, message);
				message.channel.send(response);
			}
		} else if ("#errorCommand#" in sscript) {
			message.channel.send(sscript["#errorCommand#"]);
		}
	}
})

client.on("guildMemberAdd", user => {
	// Detect user join
	var script = db.get("serveur").find({ id: user.guild.id}).value().code;
	if ("#userJoin#" in script) {
		var text = script["#userJoin#"]
		text = text.replace("%user%", `<@${user.id}>`)
		text = replaceGlobalArg(text, user.guild)
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})

client.on("guildMemberRemove", user => {
	// Detect user leave
	var script = db.get("serveur").find({ id: user.guild.id}).value().code;
	if ("#userLeave#" in script) {
		var text = script["#userLeave#"]
		text = text.replace("%user%", user.displayName)
		text = replaceGlobalArg(text, user.guild)
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})

client.on("guildCreate", guild => {
	//Detect a new Discord server
	if (db.get("serveur").find({ id: guild.id}).value() == undefined) {
		db.get("serveur").push({ id: guild.id, code: {"@prefix@": "!"}}).write()
	}
})

client.on("guildDelete", guild => {
	//Detect a new Discord server
	db.get("serveur")
  		.remove({ id: guild.id })
  		.write()
})

app.listen(config.port, function() {
	console.log("Démarage du serveur sur le port " + config.port)
});

app.get('/discord_login', function(req, res) {
	
});