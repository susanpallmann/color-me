$(document).ready(function() {
	$("input.value_color").on('input', function() {
		var colorHue = $("input#value_colorHue").val();
        	var colorSat = $("input#value_colorSat").val();
        	var colorLgh = $("input#value_colorLgh").val();
		var compColor = getComplementaryColor(colorHue, colorSat, colorLgh);
		var compHue = compColor[0];
		var compSat = compColor[1];
		var compLgh = compColor[2];
		var midHue = Math.round((Number(colorHue) + Number(compHue))/2);
		if (midHue > 360) {
			midHue = midHue - 360;
		}
		var midSat = Math.round((Number(colorSat) + Number(compSat))/2);
		var midLgh = Math.round((Number(colorLgh) + Number(compLgh))/2);
		if (isDarkColor(midHue, midSat, midLgh)) {
			$("#display_color").css("color", "white");
			$("#display_colorComp").css("color", "white");
		} else {
			$("#display_color").css("color", "black");
			$("#display_colorComp").css("color", "black");
		}
		setBackgroundColor(colorHue, colorSat, colorLgh);
        	$("#display_color").css("background-color", "hsl(" + colorHue + ", " + colorSat + "%, " + colorLgh + "%)");
		$("#display_color").html("H: " + colorHue + ", S: " + colorSat + ", L: " + colorLgh);
		$("#display_colorComp").css("background-color", "hsl(" + compHue + ", " + compSat + "%, " + compLgh + "%)");
		$("#display_colorComp").html("H: " + compHue + ", S: " + compSat + ", L: " + compLgh);
	});
	
	//Random BG color gen //
	// Generate any random color from all possible HSL values
	var randomNum = Math.random();
	var hue = Math.round(randomNum * 360);
	var sat = Math.round(Math.random()*80 + 10);
	var lgh = Math.round(Math.random()*60 + 20);
	
	setBackgroundColor(hue, sat, lgh);
	$("input#value_colorHue").val(colorHue);
	$("input#value_colorSat").val(colorHue);
	$("input#value_colorLgh").val(colorHue);
});
