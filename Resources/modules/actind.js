exports.create = function() {
	return Ti.UI.createActivityIndicator({
		color : 'black',
		backgroundColor : 'orange',
		borderRadius : 8,
		width : 200,
		height : 60,
		font : {
			fontWeight : 'bold'
		},
		opacity : 0.7,
		zIndex : 999,
		font : {
			fontSize : 13
		},
		borderColor : 'black',
		borderWidth : 2,
		borderColor : 'white'
	});
}
