var fs = require('fs');
var script = require("../script.json");
const lang = require("./lang.json");
eval(fs.readFileSync("./lib/function.js").toString());

module.exports = {
	param : function (pText) {
		text = pText;
		var h = new Date();
		text = text.replace("%date:date%", sendLang("dateFormat").replace("dd", addZero(h.getDate())).replace("mm", addZero(h.getMonth())).replace("yyyy", h.getFullYear()));
		text = text.replace("%date:day%", h.getDate());
		text = text.replace("%date:month%", h.getMonth());
		text = text.replace("%date:year%", h.getFullYear());
		text = text.replace("%date:time%", addZero(h.getHours()) + ":" + addZero(h.getMinutes()));
		text = text.replace("%date:hours%", h.getHours());
		text = text.replace("%date:min%", h.getMinutes());
		text = text.replace("%date:sec%", h.getSeconds());

		return text;
	}

}