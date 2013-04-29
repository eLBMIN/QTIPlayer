function Video() {
	if (!(this instanceof Video)) {
		return new Video();
	}
	return this.init();
}

Video.prototype.init = function() {
	this.ui = Ti.UI.createWindow({
		barImage : '/assets/mobile-bar.png',
		backgroundImage : '/assets/grid-master.png',
		orientationModes : [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT]
	});
	var self = this;
	this.actind = require('/modules/actind').create();
	this.player = Ti.Media.createVideoPlayer({
		width : 720,
		height : 420,
		bottom : 0,
		height : 320,
		width : 480,
		visible : false,
		borderRadius : 6,
		allowsAirPlay : true,
		mediaControlStyle : Ti.Media.VIDEO_CONTROL_EMBEDDED,
		scalingMode : Ti.Media.VIDEO_SCALING_ASPECT_FIT
	});
	this.ui.addEventListener('dblclick', function(_e) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Jawoll!', 'Nein, weitergucken'],
			message : 'Möchten Sie den Film beenden und zurück zur Liste?',
			title : 'Filmende'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				return;
			}
			self.player.stop();
			self.actind.hide();
			self.player.hide();
			self.ui.close();
		});
		dialog.show();
	});
	this.ui.add(this.player);
	this.ui.add(this.actind);
	this.player.addEventListener('playbackState', function(_e) {
		if (_e.playbackState == Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
			self.actind.hide();
			self.player.show();
		}
	});
	return this;
}

Video.prototype.start = function(_url) {
	this.ui.open({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
	this.actind.show();
	this.actind.message = 'Lade Film vom RRZ …';
	if (this.player.playing == true) {
		this.player.stop();
	}
	Ti.API.log(_url);
	this.player.url = _url;
	//this.player.play();
};

Video.prototype.getView = function() {
	return this.ui;
};
module.exports = Video;
