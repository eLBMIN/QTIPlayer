var getMovies = function(id, _callback) {
	var url = 'http://lecture2go.uni-hamburg.de/rss/' + id + '.mp4.xml';
	Titanium.Yahoo.yql('SELECT * FROM rss WHERE url = "' + url + '"', function(e) {
		if (!e.data || !e.data.item)
			return;
		var items = e.data.item;
		var rows = [];
		for (var i = 0; i < items.length; i++) {
			try {
				var item = items[i];
				var url = item.enclosure.url;
				var imageurl = url.replace(/fms1\.rrz\.uni\-hamburg\.de\/abo/,'lecture2go.uni-hamburg.de/images').replace(/mp4/,'jpg');
				var filter = item.author + ' ' + item.title;
				var row = Ti.UI.createTableViewRow({
					hasDetail : true,
					selectedBackgroundColor:'orange',
					my_filter: filter,
					backgroundColor : 'black',
					url : item.enclosure.url
				});
				var thumbnail = Ti.UI.createImageView({
					width : 90,
					left : 0,
					top:0,
					defaultImage : '',
					image : imageurl,
					height : 50
				});
				row.add(thumbnail);
				/*require('thumbnail').get(item.enclosure.url, function(image) {
					thumbnail.image=image
				});*/
				var container = Ti.UI.createView({
					top : 0,
					left : 100,
					layout : 'vertical',
					height : Ti.UI.SIZE
				});
				row.add(container);
				container.add(Ti.UI.createLabel({
					text : item.author,
					left : 0,
					right : 5,
					height : 36,
					top : 5,
					bottom : 5,
					color : 'red',
					width : Ti.UI.FILL,
					font : {
						fontSize : 16
					}
				}));
				row.add(Ti.UI.createLabel({
					text : item.title,
					left : 5,
					right : 5,
					bottom:5,
					height : Ti.UI.SIZE,
					top : 60,
					color : 'white',
					width : Ti.UI.FILL,
					font : {
						fontSize : 13
					}
				}));
				rows.push(row);
			} catch(E) {
			}
		}
		_callback(rows);
	});
}

exports.create = function(title, id) {
	var sectiontitleview = Ti.UI.createView({
		height : 25,
		width : Ti.UI.FILL,
		backgroundColor : '#555',
		backgroundImage : '/assets/shadow.png'
	});
	sectiontitleview.add(Ti.UI.createLabel({
		text : title,
		left : 5,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		textAlign : 'left',
		width : Ti.UI.FILL,
		color : 'white',
		font : {
			fontSize : 13
		}
	}));
	var section = Ti.UI.createTableViewSection({
		headerView : sectiontitleview
	});
	getMovies(id, function(rows, _callback) {
		for (var i = 0; i < rows.length; i++) {
			section.add(rows[i]);
		}
		Ti.App.fireEvent('sectionready');
	});
	return section;

}

