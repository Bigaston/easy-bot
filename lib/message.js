module.exports = {
	event : function(pText, pMessage) {
		text = pText;
		if (text.match(/!message:delete!/) != undefined) {
			pMessage.delete();
			text = text.replace(/!message:delete!/g, "");
		}

		return text;
	}
}