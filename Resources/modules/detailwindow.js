exports.create = function() {
	var self = Ti.UI.createWindow({
		backgroundImage : '/assets/grid-master.png',
		barColor : '#3F426F'
	});
	self.question = Ti.UI.createWebView({
		height : Ti.UI.SIZE,
		top : 10,
		left : 10,
		right : 10,
		borderRadius : 10,
		disableBounce : true,borderWidth:1

	});
	self.add(self.question);
	self.answers = Ti.UI.createTableView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		left : 10,
		right : 10,
		scrollIndicatorStyle : Ti.UI.iPhone.ScrollIndicatorStyle.BLACK,
		separatorColor : '#fff',
		opacity : 0.97,
		borderRadius : 10,
		borderColor : 'silver',
		borderWidth : 1,
		backgroundColor : 'transparent',
		bottom : 60
	});
	self.add(self.answers);
	self.button = Ti.UI.createButton({
		right : 10,
		bottom : 10,
		title : 'Antwort abgeben',
		width : 200,
		height : 40
	});
	self.add(self.button);
	return self;
}

