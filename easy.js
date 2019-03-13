const Discord = require("discord.js");
const client = new Discord.Client();

var script = require("./script.json");
const lang = require("./lang.json");

var version = "0.3.0";

client.login(script["@token@"]);

client.on("ready", async () => {
	client.user.setActivity(version);

	var clientGuild = client.guilds.array();
	for (var i=0; i < clientGuild.length; i++) {
		serveurObj = client.guilds.get(clientGuild[i].id);
		changeNickname(serveurObj);
	}
});

function changeNickname(pServeur) {
	// Detect if the bot username is different

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
		if ("@lang@" in script) {
			client.channels.get(script["@infoChannel@"]).send(lang[script["@lang@"]].join);
		} else {
			client.channels.get(script["@infoChannel@"]).send(lang["en"].join);
		}
	}
})