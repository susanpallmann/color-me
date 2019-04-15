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
    colorHue: 0,
    colorSat: 0,
    colorLgh: 0,
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
});



function isDarkColor(hue, sat, lgh) {
  // determines cut-offs for whether a theme is dark or bright at every 60 degrees of hue
  // these values can be changed but the arrays must be the same length and have at least 2 values
  var colorStops = [0, 60, 120, 180, 240, 300, 360]; // must be between 0 and 360
  var maxLghVals = [55, 45, 50, 55, 75, 70, 55]; // must be between 0 and 100
  var maxLghValAtZeroSaturation = 65; // must be between 0 and 100
  
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
      maxLgh = (Number(distanceFromPrev * maxLghVals[i]) + Number(distanceFromNext * maxLghVals[i-1]))/Number(distanceFromPrev + distanceFromNext);
      i = leng;
    }
  }
  // recalculates max lightness, weighted for saturation
  // if saturation is 0, max lightness will be the same as maxLghValAtZeroSaturation
  // if saturation is 100, max lightness will not change from previous calculation
  maxLgh = (Number((100 - sat) * maxLghValAtZeroSaturation) + Number(sat * maxLgh))/100;
  
  // if the lightness of the current color is less than or equal to the calculated cut-off, the color is considered dark
  if (lgh <= maxLgh) {
    return true;
  } else {
    return false;
  }
}

// returns an array with values [hue, saturation, lightness] from a css hsl string in the form "hsl(XXX, XXX%, XXX%)"
function getHSLFromString(hslString) {
	var hue = Number(hslString.split("hsl(")[1].split(",")[0]);
	var sat = Number(hslString.split(",")[1].split("%")[0]);
	var lgh = Number(hslString.split(",")[2].split("%")[0]);
	return [hue, sat, lgh];
}

// returns an array with values [hue, saturation, lightness] representing a color complementary to the input HSL values
function getComplementaryColor(hue, sat, lgh) {
	// find a complementary hue
	// if saturation is low, make the hue difference greater
	// if lightness is extreme, make the hue difference greater
	var compHue = Math.round(Number(hue) + Number((50-sat*0.5)) + Number((Math.abs(lgh-50)) + 20));
	if (compHue > 360) {
		compHue = compHue - 360;
	}
	
	// find a complementary saturation
	// if saturation is very high, make the complement slightly less saturated
	// if saturation is very low, make the complement slightly more saturated
	var compSat = sat;
	if (sat > 80) {
		compSat = 160-sat;
	} else if (sat < 20) {
		compSat = 40-sat;
	}
	
	// find a complementary lightness
	// if lightness is very high, make the complement slightly less
	var compLgh = lgh;
	if (lgh > 90) {
		compLgh = 180-lgh;
	} else if (lgh < 10) {
		compLgh = 20-lgh;
	}
	
	// returns complementary hsl values
	return [compHue, compSat, compLgh];
}

function setBackgroundColor(hue, sat, lgh) {
	// Gets complementary color's HSL values
	var compCol = getComplementaryColor(hue, sat, lgh);
	var compHue = compCol[0];
	var compSat = compCol[1];
	var compLgh = compCol[2];
	
	// Gets intermediate HSL values between two colors
	var midHue = (hue + compHue)/2;
	var midSat = (sat + compSat)/2;
	var midLgh = (lgh + compLgh)/2;
	
	// set background to gradient of random color and its complement
	$("body").css("background-image", "radial-gradient(at bottom right, hsl(" + hue + ", " + sat + "%, " + lgh + "%), hsl("  + compHue + ", " + compSat + "%, " + compLgh + "%)");
	
	// set text color to white if colors are dark, or black if colors are light
	if (isDarkColor(midHue, midSat, midLgh)) {
		$("body").css("color", "white");
		$("#container-hamburger span").css("background-color", "white");
		$(".navMarker").css("background-color", "white");
	} else {
		$("body").css("color", "black");
		$("#container-hamburger span").css("background-color", "black");
		$(".navMarker").css("background-color", "black");
	};
}
