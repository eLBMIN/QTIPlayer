exports.get = function(url, _callback) {
	var videoPlayer = Ti.Media.createVideoPlayer({
		url : url,
		mediaControlStyle : Titanium.Media.VIDEO_CONTROL_EMBEDDED,
		scalingMode : Ti.Media.VIDEO_SCALING_ASPECT_FIT
	});
	setTimeout(function() {
		videoPlayer.requestThumbnailImagesAtTimes([0,1], Ti.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, function(_e) {
			if (_e.success == true && typeof (_callback) == 'function') 
				_callback(_e.image);
		});
	},100);
}
