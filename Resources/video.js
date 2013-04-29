exports.get = function(id, _callback) {
	var self = {};
	self.got = false
	self.tempFile =  Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, id +'.mp4');
	self.xhr = Ti.Network.createHTTPClient();
	self.xhr.ondatastream = function(e) {
		if (self.got) return;
		self.got = true;
		_callback(self.tempFile.nativePath);
	};
	self.xhr.onload = function(e) {
		self.tempFile.write(this.responseData);
		
	};
	self.xhr.open('POST', 'http://fms1.rrz.uni-hamburg.de/download/getFile');
	//self.xhr.file = self.tempFile;
	self.xhr.send({
		l2g : id,
		type : "video"
	});
}