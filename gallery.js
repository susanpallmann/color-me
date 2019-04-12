maxThumbs = 6;

window.onload = function() {
  firebase.database().ref('perspectives').orderByChild('visibleInGallery').equalTo(true).limitToLast(maxThumbs).on('child_added', function(data) {
    if ($("#gallery div").length >= maxThumbs) {
      $("#gallery div:last-child").remove();
    }
    var hue = data.val().colorHue;
    var sat = data.val().colorSat;
    var lgh = data.val().colorLgh;
    var hslString = "hsl(" + hue + ", " + sat + "%, " + lgh + "%)";
    var compCol = getComplementaryColor(hue, sat, lgh);
    var compColStr = "hsl(" + compCol[0] + ", " + compCol[1] + "%, " + compCol[2] + "%)";
    var textCol = "black";
    if (isDarkColor(hue, sat, lgh)) {
      textCol = "white";
    }
    $("#gallery").prepend("<div style='color: " + textCol + "; background-image: linear-gradient(to bottom right, " + hslString + ", " + compColStr + ");'>Color Me " + data.val().title + "</br><small>by " + data.val().creator + "</small></div>");
  });
  
  //Random BG color gen //
	// Generate any random color from all possible HSL values
	var randomNum = Math.random();
	var hue = Math.round(randomNum * 360);
	var sat = Math.round(Math.random()*100);
	var lgh = Math.round(Math.random()*100);
	
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
	$("body").css("background-image", "linear-gradient(to bottom right, hsl(" + hue + ", " + sat + "%, " + lgh + "%), hsl("  + compHue + ", " + compSat + "%, " + compLgh + "%)");
	
	// set text color to white if colors are dark, or black if colors are light
	if (isDarkColor(midHue, midSat, midLgh)) {
		$("body").css("color", "white");
	} else {
		$("body").css("color", "black");
	};
};
