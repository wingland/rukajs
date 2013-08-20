var UT = window.UT = new Object();
UT.callMethod = [ "get", "put", "post", "delete" ];
UT.callMethod.forEach( function(method) {
	UT[method] = function(url, data, callback, type) {
		if (typeof data === "function") {
			type = type || callback;
			callback = data;
			data = undefined;
		}
		UT.ajax( {
			url : url,
			data : data,
			type : type,
			success : callback,
			method : method
		});
	};
});
UT.ajax = function(options) {
	options = options || {};
	if ((typeof options.method) == 'string')
		options.method = options.method.toLowerCase();
	else
		return;
	var encapUrl = options.url;
	if (options.data && UT.equalsIgnoreCase(options.method, "get")) {
		var dataSuffix = UT.param(options.data);
		encapUrl = options.url + dataSuffix;
	}
	utXHR = (window.XMLHttpRequest) ? (new XMLHttpRequest()) : null;
	if (!utXHR)
		return;
	if (UT.findIgnoreCase(UT.callMethod, options.method))
		utXHR.open(options.method, encapUrl, true);
	utXHR.onreadystatechange = function() {
		if (utXHR.readyState ==4 && utXHR.status == 200) {
			var result = utXHR.response;
			if (UT.equalIC(options.type, "JSON")) {
				try {
					result = JSON.parse(result);
				} catch (e) {
					console.error("Accept Error:unexcepted response content");
				}
			}
			if (typeof options.success == "function") {
				options.success(result);
			}
		}
	};
	try {
		utXHR.send(UT.parse(options.data));
	} catch (e) {
		console.error(e);
	}

};
UT.parse = function(o) {
	if (UT.isXML(o))
		return null;
	// TODO:add XML parsing
	if (o instanceof Object) {
		return JSON.stringify(o);
	}
	return null;
};
UT.param = function(o) {
	var str = "";
	if (o instanceof Object && !(o instanceof Array)) {
		var paramStr = new Array();
		for (prefix in o) {
			if ((typeof o[prefix]) == 'string'
					|| (typeof o[prefix]) == 'number') {
				var s = prefix + "=" + o[prefix];
				paramStr.push(s);
			}
		}
		str = paramStr.join("&").replace("/%20/g", "+");
	}
	if (str != null && str != "")
		return "?" + str;
	else
		return "";
};
UT.findIC = UT.findIgnoreCase = function(a, s) {
	if (!a instanceof Array)
		return false;
	for (i in a) {
		if (typeof a[i] === "string" && typeof s === "string")
			if (s.toLowerCase() == a[i].toLowerCase())
				return true;
			else if (s == a[i])
				return true;
	}
	return false;
};
UT.equalIC = UT.equalsIgnoreCase = function(s1, s2) {
	return s1 && s2 ? s1.toLowerCase() == s2.toLowerCase() : false;
};
UT.isXML = function(elem) {
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};