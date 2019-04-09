// Initialize Firebase
var config = {
  apiKey: "AIzaSyBNFTPiWRlwZznLctp-tkenqQWHfpzBbFI",
  authDomain: "perspectives-f401a.firebaseapp.com",
  databaseURL: "https://perspectives-f401a.firebaseio.com",
  projectId: "perspectives-f401a",
  storageBucket: "perspectives-f401a.appspot.com",
  messagingSenderId: "805764424713"
};
firebase.initializeApp(config);

function onSave() {
  var values = {
    title: '',
    creator: '',
    description: '',
    timestamp: Date.now(),
    color: '',
    backButton: '',
    effectA: false,
    effectB: false,
    effectC: false,
    effectD: false,
    effectE: false,
    effectF: false,
    effectG: false,
    effectH: false,
    effectI: false,
    effectJ: false,
    effectK: false,
    effectL: false,
    effectM: false,
    grows: true,
    visibleInGallery: true,
    views: 0
  };
  var perspID = newPerspective(values);
}

// Creates a new perspective and returns ID.
function newPerspective(values) {
  var perspID = firebase.database().ref('perspectives/').push(values).getKey();
  loadPerspective(perspID);
  return perspID;
}

// Loads a perspective by its ID.
function loadPerspective(perspID) {
    firebase.database().ref('perspectives/' + perspID).once('value').then(function(snapshot) {
        var data1 = snapshot.child('data1').val();
        var data2 = snapshot.child('data2').val();
        var data3 = snapshot.child('data3').val();
        alert (perspID + " has values: " + data1 + ", " + data2 + ", " + data3);
    });
}

//
$(document).ready(function() {
	// Hamburger menu //
	$("nav").css("right", (-1*$("nav").width()) + "px");
	$("#nav-hamburger").click(function(){
		if ($(this).hasClass("animcomplete")) {
			$(this).removeClass("animcomplete");
			$(this).addClass("closed");
			$("nav").css("right", (-1*$("nav").width()) + "px");
			setTimeout(function() {
				$("#nav-hamburger").removeClass("closed");
			}, 500);
		} else {
		$(this).addClass("open");
			$("nav").css("right", "0");
			setTimeout(function() {
				$("#nav-hamburger").removeClass("open");
				$("#nav-hamburger").addClass("animcomplete");
			}, 500);
		}
	});
	// End hamburger menu //
	
	//Random color gen //
	var randomNum = Math.random();
	var randomCol = "black";
	if (randomNum < 0.1) {
		randomCol = "#3D7199";
	} else if (randomNum < 0.2) {
		randomCol = "#D65177";
	} else if (randomNum < 0.3) {
		randomCol = "#DD9E6E";
	} else if (randomNum < 0.4) {
		randomCol = "#987FC6";
	} else if (randomNum < 0.5) {
		randomCol = "#59C14D";
	} else if (randomNum < 0.6) {
		randomCol = "#D69168";
	} else if (randomNum < 0.7) {
		randomCol = "#43B785";
	} else if (randomNum < 0.8) {
		randomCol = "#E5C319";
	} else if (randomNum < 0.9) {
		randomCol = "#FF6B6B";
	} else {
		randomCol = "#ADAFB1";
	}
	$("body").css("background-image", "linear-gradient(to bottom right, white, " + randomCol + ")");
});
