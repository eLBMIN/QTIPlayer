Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.OPAQUE_BLACK;



require('offlinealert').create();

var detailWindow = require('modules/detailwindow').create();

var detailNav = Ti.UI.iPhone.createNavigationGroup({
	backgroundImage : '/assets/grid.png',
	window : detailWindow
});
var menueWindow = Titanium.UI.createWindow({
	backgroundImage : '/assets/grid-master.png',
	barColor : '#3F426F',
	title : 'SE1Level1',
	orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
});
var menueNav = Ti.UI.iPhone.createNavigationGroup({
	backgroundImage : '/assets/grid.png',
	window : menueWindow
});

var splitWindow = Ti.UI.iPad.createSplitWindow({
	detailView : detailNav,
	masterView : menueNav
});
splitWindow.addEventListener('visible', function(e) {
	if (e.view == 'detail') {
		e.button.title = "Liste";
		detailWindow.leftNavButton = e.button;
	} else if (e.view == 'master') {
		detailWindow.leftNavButton = null;
	}
});
splitWindow.open();


var searchbar = Titanium.UI.createSearchBar({
	barColor : '#000',
	showCancel : true,
	top : 0,
	hintText : 'Suche …'
});

var menuTable = Titanium.UI.createTableView({
	search : searchbar,
	filterAttribute : 'my_filter',
	top : 50,
	searchHidden : false

});

menueWindow.add(menuTable);
menueWindow.add(searchbar);
require('modules/model_qti').getList('http://lab.min.uni-hamburg.de/qti/SelbsttestLevel1Final.zip', function(_data) {
	var _q = _data.xml;
	if (_q) {

		var row = Ti.UI.createTableViewRow({
			layout : 'vertical',
			height : Ti.UI.SIZE,
			hasChild : true,
			data : _data,
			titletext : _q.title
		});
		row.add(Ti.UI.createLabel({
			text : _q.title,
			left : '10dp',
			top : '10dp',
			height : Ti.UI.SIZE,
			font : {
				fontSize : '22dp'
			}
		}));
		menuTable.appendRow(row);
	}

});
var animationactive = false;
menuTable.addEventListener('click', function(_e) {
	if (animationactive === true)
		return;
	detailWindow.answers.cardinality = _e.rowData.data.xml.responseDeclaration.cardinality;
	detailWindow.answers.correctResponse = _e.rowData.data.xml.responseDeclaration.correctResponse;
	animationactive = true;
	detailWindow.question.opacity = '0.1';
	detailWindow.question.animate({
		opacity : 1,
		duration : 600
	}, function() {
		animationactive = false;
	});
	detailWindow.question.setHtml('<style>* {font-size:13pt!important}</style>' + _e.rowData.data.html.replace(/times new roman/m, 'Helvetica'));
	detailWindow.title = _e.rowData.titletext;
	var answers = _e.rowData.data.xml.itemBody.choiceInteraction.simpleChoice;
	var rows = [];
	var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	for (var i = 0; i < answers.length; i++) {
		rows[i] = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			backgroundColor : 'white',
			borderWidth : 1,
			borderColor : '#444',
			correctResponse : false,
			identifier : answers[i].identifier
		});
		rows[i].add(Ti.UI.createLabel({
			left : 70,
			font : {
				fontSize : 20,
				fontWeight : 'normal'
			},
			color : '#555',
			right : 50,
			text : '\n' + answers[i].text + '\n'
		}));
		rows[i].add(Ti.UI.createLabel({
			left : 10,
			font : {
				fontSize : 60,
				fontWeight : 'bold'
			},
			color : '#ddd',
			text : letters[i]
		}));
	}
	detailWindow.answers.setData(rows);
});

detailWindow.question.addEventListener('postlayout', function() {
	var height = detailWindow.question.rect.height + 20;
	detailWindow.answers.setTop(height);
});
detailWindow.answers.addEventListener('click', function(_e) {
	var row = _e.rowData;
	if (detailWindow.answers.cardinality === 'single') {
		for (var i = 0; i < _e.section.rowCount; i++) {
			_e.section.rows[i].hasCheck = false;
		}
		row.hasCheck = true;
	}
	if (detailWindow.answers.cardinality === 'multiple') {
		row.hasCheck = (row.hasCheck === true) ? false : true;
	}
});
