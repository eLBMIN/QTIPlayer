var getQTIbyURL = function(_url, _callback) {
	var bar_fn = Ti.Filesystem.applicationDataDirectory + Ti.Utils.md5HexDigest(_url);
	var bar = Ti.Filesystem.getFile(bar_fn);
	if (!bar.exists()) {
		res = bar.createDirectory();
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				var foo_fn = Ti.Filesystem.applicationDataDirectory + 'qti.zip';
				var foo = Ti.Filesystem.getFile(foo_fn);
				foo.write(this.responseData);
				require('ti.compression').unzip(bar_fn, foo_fn, true);
				_callback({
					success : true,
					qti : bar_fn
				});
			},
			onerror : function(e) {
				console.log(e.error);
			}
		});
		xhr.open('GET', _url);
		xhr.send();
	} else {
		_callback({
			success : true,
			qti : bar_fn
		})
	}
};

exports.getList = function(_url, _callback) {
	getQTIbyURL(_url, function(_data) {
		var qtidir = Ti.Filesystem.getFile(_data.qti);
		if (qtidir.exists() === false)
			return;
		var dir_files = qtidir.getDirectoryListing();
		for (var i = 0; i < dir_files.length; i++) {
			if (!dir_files[i].match(/\.xml$/i))
				continue;
			var xmlfilename = Ti.Filesystem.getFile(_data.qti +'/'+ dir_files[i]);console.log(xmlfilename);
			try {
				var xmlstring = xmlfilename.read().text;
				var XMLTools = require('modules/XMLTools');
				var parser = new XMLTools(xmlstring);
				var obj = parser.toObject();
				var regex = /<itemBody>(.*?)<choiceInteraction/gim;
				var html = regex.exec(xmlstring);
				if (!html) {
					continue
				}
				console.log(obj);
				_callback({
					html : (html) ? html[1] : '',
					xml : obj
				});
			} catch(E) {
				//console.log(E);
			}
		}
	});
}
