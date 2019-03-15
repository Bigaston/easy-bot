var fs = require('fs');
var script = require("../script.json");
const lang = require("./lang.json");
eval(fs.readFileSync("./lib/function.js").toString());

module.exports = {
	param : function (pText) {
		text = pText;
		var h = new Date();
		text = text.replace("%date%", sendLang("dateFormat").replace("dd", addZero(h.getDate())).replace("mm", addZero(h.getMonth())).replace("yyyy", h.getFullYear()));
		text = text.replace("%day%", h.getDate());
		text = text.replace("%month%", h.getMonth());
		text = text.replace("%year%", h.getFullYear());
		text = text.replace("%time%", addZero(h.getHours()) + ":" + addZero(h.getMinutes()));
		text = text.replace("%hours%", h.getHours());
		text = text.replace("%min%", h.getMinutes());
		text = text.replace("%sec%", h.getSeconds());

		return text;
	}

}