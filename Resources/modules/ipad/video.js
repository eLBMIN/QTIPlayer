function Video() {
	return this.init();
}

Video.prototype.init = function() {
	this.window = Ti.UI.createWindow({
		
		backgroundImage : '/assets/grid-master.png',
	});
	var self = this;
	this.actind = require('/modules/actind').create();
	this.topcontainer = Ti.UI.createScrollView({
		layout : 'horizontal',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		bottom : 420,
		top : 0,
		contentHeight : Ti.UI.SIZE,
		contentWidth : Ti.UI.FILL,
	});
	this.player = Ti.Media.createVideoPlayer({
		width : 720,
		height : 420,
		bottom : 0,
		backgroundColor:'white',
		borderRadius : 6,
		allowsAirPlay : true,
		visible : false,
		mediaControlStyle : Ti.Media.VIDEO_CONTROL_EMBEDDED,
		scalingMode : Ti.Media.VIDEO_SCALING_ASPECT_FIT
	});
	this.thumbnails = [];
	var self = this;
	this.window.addEventListener('dblclick', function(_e) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Film beenden', 'Nein, weitergucken'],
			message : 'Möchten Sie den Film tatsächlich beenden?',
			title : 'Filmende'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				return;
			}
			self.stop();

		});
		dialog.show();
	});
	this.window.add(this.topcontainer);
	this.window.add(this.player);
	this.window.add(this.actind);
	this.player.addEventListener('playbackState', function(_e) {
		if (_e.playbackState == Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
			self.player.show();
			self.actind.animate(Ti.UI.createAnimation({
				opacity : 0
			}));
		}
	});
	return this;
}

Video.prototype.stop = function(_callback) {
	var self = this;
	this.actind.show();
	this.player.cancelAllThumbnailImageRequests();
	if (this.player.playing == true) {
		Ti.API.log('PLAYER stopped');
		this.player.stop();
		this.actind.message = 'Stoppe Video';
		this.player.hide();
	}
	while (self.thumbnails.length) {
		self.topcontainer.remove(self.thumbnails.pop());
	}
	Ti.API.log('removing of thumbnails');
	if ( typeof (_callback) == 'function')
		_callback(true);
}

Video.prototype.start = function(_url) {
	var self = this;
	this.stop(function() {
		Ti.API.log('ready to PLAY');
		self.player.url = _url;
		Ti.API.log('URL set to ' + _url);
		self.actind.message = 'Lade Film vom RRZ …';
		var times = [];
		for (var i = 0; i < 50; i++)
			times.push(1 * i);
		self.player.requestThumbnailImagesAtTimes(times, Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, function(_e) {
			var thumbnail = Ti.UI.createImageView({
				width : 100,
				top : 0,
				left : 1,
				height : 55,
				borderRadius : 3,
				image : _e.image,
				visible : false
			});
			self.thumbnails.push(thumbnail);
			self.topcontainer.add(thumbnail);
			setTimeout(function() {
				thumbnail.show();
			}, 300);
		});

	});
};

Video.prototype.getView = function() {
	return this.window;
};
module.exports = Video;
