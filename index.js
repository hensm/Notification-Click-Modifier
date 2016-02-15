const { Cc, Ci } = require("chrome");
const wm = Cc["@mozilla.org/appshell/window-mediator;1"]
		.getService(Ci.nsIWindowMediator);


function onOpenNotification(domWindow) {
	let documentElement = domWindow.document.documentElement;
	documentElement.setAttribute("onclick", null);
	documentElement.addEventListener("click", function(ev) {
		if (ev.button === 0) {
			domWindow.onAlertClick.apply(this, arguments);
		} else {
			let alertBox = domWindow.document.getElementById("alertBox");
			if (alertBox.getAttribute("animate") === "true") {
				alertBox.setAttribute("clicked", true);
			} else {
				domWindow.close();
			}
		}
	}, false);
}

let windowListener = {
	onOpenWindow: function(aWindow) {
		let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
				.getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);

		domWindow.addEventListener("load", function onLoad() {
			domWindow.removeEventListener("load", onLoad, false);
			if (domWindow.document
						 .documentElement
						 .getAttribute("windowtype") === "alert:alert") {
				onOpenNotification(domWindow);
			}
		}, false);
	}
};

function startup() {
	wm.addListener(windowListener);
}
function shutdown() {
	wm.removeListener(windowListener);
}


exports.main = startup;
exports.onUnload = shutdown;