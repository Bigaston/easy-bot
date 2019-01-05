const config = require("./config.json")

const Discord = require("discord.js");
const client = new Discord.Client();

var version = "0.1.0";

client.login(config.token);

var script = {
	"@prefix@" : "!",
	"@customName@" : "Easy Bot",
	"@infoChannel@" : "530841899666374686",

	"#errorCommand#" : "Commande non reconue",
	"#userJoin#" : "%user% a rejoint le serveur!",
	"#userLeave#" : "%user% a quitté le serveur!",

	"bonjour" : ["Bonjour %me%!", "Aurevoir"],
	"hug" : "%me% fait un hug à %1%",
	"phrase" : "%me% : %all%",
	"maison" : {
		"serp" : {
			"homme" : "JE SUIS UN SERPENTARD HOMME",
			"femme" : "JE SUIS UN SERPENTARD FEMME",
			"#errorCommand#" : "IL FAUT DIRE UN SEXE MONSIEUR"
		},
		"grif" : "JE SUIS UN GRYFFONDOR",
		"#errorCommand#" : "A MARCHE PAS"
	},
	"jesuis" : "%someone%"
};

client.on("ready", async () => {
	client.user.setActivity(version);
	changeNickname();
});

function changeNickname() {
	// Detect if the bot username is different
	var serveur = client.guilds.get("352919638864035881");

	if ("@customName@" in script) {
		if (serveur.me.displayName != script["@customName@"]) {
			serveur.me.setNickname(script["@customName@"]);
		}
	} else {
		serveur.me.setNickname("Easy Bot");
	}
}

function chooseResponse(pTable) {
	// Choose a response in pTable
	return pTable[Math.floor(Math.random() * pTable.length)]
}

function replaceArg(pText, pArgs, pMessage) {
	// Replace the args balise in the text
	
	let text = pText
	 
	for (var i=0; i < pArgs.length; i++) {
		text = text.replace(`%${i}%`, pArgs[i])
	}
	text = text.replace("%me%", pMessage.author.username)
	text = text.replace("%all%", pMessage.content.replace(pArgs[0] + " ", ""))
	text = text.replace("%someone%", pMessage.guild.members.random().displayName)	
	text = text.replace(/%[0-9]*%/gi, "nothing")
	return text
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
				response = replaceArg(response, args, message);
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
				response = replaceArg(response, args, message);
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
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})

client.on("guildMemberRemove", user => {
	// Detect user leave
	if ("#userLeave#" in script) {
		var text = script["#userLeave#"]
		text = text.replace("%user%", user.displayName)
		client.channels.get(script["@infoChannel@"]).send(text);
	}
})