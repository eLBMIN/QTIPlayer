exports.create = function() {
	function notConnectedAlert() {
		var alertDialog = Titanium.UI.createAlertDialog({
			title : 'Keine Verbindung zum Internet',
			message : 'Leider benötigt lecture2go eien Verbindung zum Rechenzentrum der Hamburger Uni',
			buttonNames : ['Continue']
		});
		alertDialog.show();
	}

	if (!Ti.Network.online) {
		notConnectedAlert();
	}
}
