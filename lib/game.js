module.exports = {
	event : function (pText, pClient) {
		text = pText;

		if (text.match(/!game:set\[.+\]!/) != undefined) {
			pClient.user.setActivity(text.match(/!game:set\[.+\]!/)[0].replace("!game:set[", "").replace("]!", ""))
			text = text.replace(/!game:set\[.+\]!/, "")
		}

		return text;
	}
}