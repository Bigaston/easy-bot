const Discord = require("discord.js");
const client = new Discord.Client();
var fs = require('fs');

// Import JSON Files
const package = require("./package.json")
var script = require("./script.json");
const lang = require("./lib/lang.json");

// Import lib and function
eval(fs.readFileSync("./lib/function.js").toString());
console.log(sendLang("importGlobal"));
const channel = require("./lib/channel.js");
const date = require("./lib/date.js");

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
	args[0] = args[0].replace(script["@prefix@"], "");
	i = 0;
	while (i < args.length) {
		if (args[i] in sscript) {
			if (Array.isArray(sscript[args[i]])) {
				var response = chooseResponse(sscript[args[i]]);
				response = replaceCommandArg(response, args, message);
				message.channel.send(response);
			} else if (typeof(sscript[args[i]]) == "object") {
				sscript = clone(sscript[args[i]])
				if (channel.trigger(sscript, message) == 0) {
					if (i == args.length - 1) {
						if ("#errorCommand#" in sscript) {
							message.channel.send(sscript["#errorCommand#"]);
						}
					}
				} else {
					sscript = channel.trigger(sscript, message);
					if (Array.isArray(sscript)) {
						var response = chooseResponse(sscript);
						response = replaceCommandArg(response, args, message);
						message.channel.send(response);
					} else if (typeof(sscript) == "object") {
						if (args.length == 0) {
							i--;
						}
					} else {
						var response = sscript;
						response = replaceCommandArg(response, args, message);
						message.channel.send(response);
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

		i++;
	}
})

client.on("guildMemberAdd", user => {
	// Detect user join
	if ("#userJoin#" in script) {
		var text = script["#userJoin#"]
		text = text.replace("%user%", `<@${user.id}>`)
		text = replaceGlobalArg(text, user.guild)
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})

client.on("guildMemberRemove", user => {
	// Detect user leave
	if ("#userLeave#" in script) {
		var text = script["#userLeave#"]
		text = text.replace("%user%", user.displayName)
		text = replaceGlobalArg(text, user.guild)
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})

client.on("guildCreate", guild => {
	//Detect a new Discord server
	if ("@infoChannel@" in script) {
		client.channels.get(script["@infoChannel@"]).send(sendLang("join").replace("${botname}", client.user.username));
	}
})