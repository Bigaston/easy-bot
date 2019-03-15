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