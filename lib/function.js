function sendLang(pMess) {
	if ("@lang@" in script) {
		if (script["@lang@"] in lang) {
			return lang[script["@lang@"]][pMess];
		} else {
			return lang["en"][pMess];
		}
	} else {
		return lang["en"][pMess];
	}
}

function startVerif() {
	isOk = true;

	fetch('https://raw.githubusercontent.com/Bigaston/easy-bot/master/package.json')
		.then( function (response) {
			if (response.ok)
				return response.json();
			throw new Error(sendLang("errChechV"));
		})
		.then( function (data) {
			online = data.version.split(".");
			local = package.version.split(".");

			for (i = 0; i < 3; i++) {
				online[i] = parseInt(online[i]);
				local[i] = parseInt(local[i]);
			}

			if (online[0] > local[0]) {
				console.log(sendLang("newVersion").replace("${versionNumber}", data.version).replace("${currentVersion}", package.version));
			} else if (online[0] == local[0]) {
				if (online[1] > local[1]) {
					console.log(sendLang("newVersion").replace("${versionNumber}", data.version).replace("${currentVersion}", package.version));
				} else if (online[1] == local[1]) {
					if (online[2] > local[2]) {
						console.log(sendLang("newVersion").replace("${versionNumber}", data.version).replace("${currentVersion}", package.version));
					} 
				}
			}
		})
		.catch( function (error) {
			console.log(error.message);
		});

	if (("@prefix@" in script) == false) {
		isOk = false;
		console.log(sendLang("errPrefix"));
	}

	if (("@token@" in script) == false) {
		isOk = false;
		console.log(sendLang("errToken"));
	}

	if ("#userJoin#" in script || "#userLeave#" in script) {
		if (("@infoChannel@" in script) == false) {
			isOk = false;
			console.log(sendLang("errInfChan"));
		}
	}

	if (isOk == false) {
		console.log(sendLang("closeApp"));
		process.exit();
	} else {
		console.log(sendLang("startApp"));
	}
}

function changeNickname(pServeur) {
	// Detect if the bot username is different

	if ("@customName@" in script) {
		if (pServeur.me.displayName != script["@customName@"]) {
			pServeur.me.setNickname(script["@customName@"]);
		}
	}
}

function changeGame() {
	if ("@customGame@" in script) {
		client.user.setActivity(script["@customGame@"]);
	} else {
		client.user.setActivity("EasyBot v" + package.version);
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

	// Replace channel
	text = channel.param(text, pMessage);

	text = message.event(text, pMessage);

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

	//Repplacement for a date
	text = date.param(text);

	return text;
}

function addZero(pInt) {
	if (pInt < 10) {
		return "0" + pInt;
	} else {
		return "" + pInt;
	}
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

function checksecurity(pArgs) {
	for (i = 0; i < pArgs.length; i++) {
		if (pArgs[i].match(/^@[a-z]+@$/g) != undefined) {
			return false;
		}
	}

	return true;
}