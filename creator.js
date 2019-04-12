$(document).ready(function() {
	$("input.value_color").on('input', function() {
		var colorHue = $("input#value_colorHue").val();
        	var colorSat = $("input#value_colorSat").val();
        	var colorLgh = $("input#value_colorLgh").val();
		var compColor = getComplementaryColor(colorHue, colorSat, colorLgh);
		var compHue = compColor[0];
		var compSat = compColor[1];
		var compLgh = compColor[2];
        	$("#display_color").css("background-color", "hsl(" + colorHue + ", " + colorSat + "%, " + colorLgh + "%)");
		$("#display_colorComp").css("background-color", "hsl(" + compHue + ", " + compSat + "%, " + compLgh + "%)");
	});
});
