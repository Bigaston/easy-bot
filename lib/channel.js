console.log(sendLang("importChannel"));

function testChannel(pScript, pMess) {
	//return 0 if not find, 1 if find
	key = Object.keys(pScript);

	for (k = 0; k < key.length; k++) {
		if (key[k].match(/#channel:[0-9]+#/) != undefined) {
			if (key[k].match(/#channel:[0-9]+#/)[0] == "#channel:" + pMess.channel.id + "#") {
				return pScript["#channel:" + pMess.channel.id + "#"];
			}
		}
	}

	if ("#default#" in pScript) {
		return pScript["#default#"];
	}

	return 0;
}