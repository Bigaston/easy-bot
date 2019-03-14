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

console.log(sendLang("importGlobal"));

eval(fs.readFileSync("./lib/function.js").toString());
eval(fs.readFileSync("./lib/channel.js").toString());

