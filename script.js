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
	$("#nav-hamburger").click(function(){
		if ($(this).hasClass("animcomplete")) {
			$(this).removeClass("animcomplete");
			$(this).addClass("closed");
			$("nav li").css("opacity", "0");
			$("nav li").css("height", "0");
			setTimeout(function() {
				$("#nav-hamburger").removeClass("closed");
				$("nav").css("display", "none");
			}, 500);
		} else {
		$(this).addClass("open");
			$("nav").css("display", "block");
			$("nav li").css("opacity", "1");
			$("nav li").css("height", "32px");
			setTimeout(function() {
				$("#nav-hamburger").removeClass("open");
				$("#nav-hamburger").addClass("animcomplete");
			}, 500);
		}
	});
	// End hamburger menu //
	
	//Random color gen //
	var randomNum = Math.random();
	var randomCol = Math.round(randomNum * 360);
	var compCol = randomCol + (50-sat*0.5) + (Math.abs(lgh-50)) + 20;
	if (compCol > 360) {
		compCol = compCol - 360;
	}
	var midCol = (randomCol + compCol)/2;
	var sat = Math.round(Math.random()*100);
	var compSat = sat;
	if (sat*2 > 160) {
		compSat = 160-sat;
	} else if (sat*2 < 40) {
		compSat = 40-sat;
	}
	var midSat = (sat + compSat)/2;
	var lgh = Math.round(Math.random()*100);
	var compLgh = lgh;
	if (lgh*2 > 180) {
		compLgh = 180-lgh;
	} else if (lgh*2 < 20) {
		compLgh = 20-lgh;
	}
	var midLgh = (lgh + compLgh)/2;
	$("body").css("background-image", "linear-gradient(to bottom right, hsl(" + randomCol + ", " + sat + "%, " + lgh + "%), hsl("  + compCol + ", " + compSat + "%, " + compLgh + "%)");
	if (isDarkColor(midCol, midSat, midLgh)) {
		$("body").css("color", "white");
	} else {
		$("body").css("color", "black");
	};
});



function isDarkColor(hue, sat, lgh) {
  // determines cut-offs for whether a theme is dark or bright at every 60 degrees of hue
  // these values can be changed but the arrays must be the same length and have at least 2 values
  var colorStops = [0, 60, 120, 180, 240, 300, 360]; // must be between 0 and 360
  var maxLghVals = [55, 40, 45, 40, 65, 50, 65]; // must be between 0 and 100
  var maxLghValAtZeroSaturation = 50; // must be between 0 and 100
  
  // sets starting values, to be changed following calculation
  var maxLgh = 50;
  var distanceFromPrev = 0;
  var distanceFromNext = 60;
  var i;
  var leng = colorStops.length;
  
  // determines which interval of hues the given color falls within
  for (i = 1; i < leng; i++) {
    // checks if the color is within the current hue range
    if (hue <= colorStops[i]) {
      // calculates how far the color is from the hue at the start of the interval
      distanceFromPrev = hue - colorStops[i-1];
      // calculates how far the color is from the hue at the end of the interval
      distanceFromNext = colorStops[i] - hue;
      // calculates a max lightness, weighted for the hues that the current color is closest to
      maxLgh = ((distanceFromPrev * maxLghVals[i]) + (distanceFromNext * maxLghVals[i-1]))/(distanceFromPrev + distanceFromNext);
    }
  }
  // recalculates max lightness, weighted for saturation
  // if saturation is 0, max lightness will be the same as maxLghValAtZeroSaturation
  // if saturation is 100, max lightness will not change from previous calculation
  maxLgh = (((100 - sat) * maxLghValAtZeroSaturation) + (sat * maxLgh))/100;
  
  // if the lightness of the current color is less than or equal to the calculated cut-off, the color is considered dark
  if (lgh <= maxLgh) {
    return true;
  } else {
    return false;
  }
}

function getHSLFromString(hslString) {
	var hue = hslString.split("hsl(")[1].split(",")[0];
	var sat = hslString.split(",")[1].split("%")[0];
	var lgh = hslString.split(",")[2].split("%")[0];
	return [hue, sat, lgh];
}
