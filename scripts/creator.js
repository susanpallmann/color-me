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
	
	$("button#formSubmit").click(function() {
		var formValues = {
			title: $("#value_title").val(),
			creator: $("#value_creator").val(),
			description: $("#value_description").val(),
			backButton: $("#value_backButton").val(),
			visibleInGallery: $("#value_visibleInGallery").is(":checked"),
			colorHue: Number($("#value_colorHue").val()),
			colorSat: Number($("#value_colorSat").val()),
			colorLgh: Number($("#value_colorLgh").val()),
			effect_pulling: $("#value_pulling").is(":checked"),
			effect_melting: $("#value_melting").is(":checked"),
			effect_blackHole: $("#value_blackHole").is(":checked"),
			effect_fading: $("#value_fading").is(":checked"),
			effect_blurring: $("#value_blurring").is(":checked"),
			effect_colorLoss: $("#value_colorLoss").is(":checked"),
			effect_colorChange: $("#value_colorChange").is(":checked"),
			effect_popups: $("#value_popups").is(":checked"),
			effect_shaking: $("#value_shaking").is(":checked"),
			effect_outOfReach: $("#value_outOfReach").is(":checked"),
			effect_immobility: $("#value_immobility").is(":checked"),
			effect_distortion: $("#value_distortion").is(":checked"),
			effect_rituals: $("#value_rituals").is(":checked"),
			timestamp: Date.now(),
			views: 0
		}
		$("body").html("Saving... Do not close this tab.");
		var experienceID = newPerspective(formValues);
	});
	
	//Random BG color gen //
	// Generate any random color from all possible HSL values
	var randomNum = Math.random();
	var hue = Math.round(randomNum * 360);
	var sat = Math.round(Math.random()*80 + 10);
	var lgh = Math.round(Math.random()*60 + 20);
	
	setBackgroundColor(hue, sat, lgh);
	$("input#value_colorHue").val(hue);
	$("input#value_colorSat").val(sat);
	$("input#value_colorLgh").val(lgh);
});

// Creates a new perspective and returns ID.
function newPerspective(values) {
  var perspRef = firebase.database().ref('perspectives/').push(values);
  perspRef.then(() => {
  	var perspID = perspRef.getKey();
	$("body").html("<a href='/experience?id=" + perspID + "'>Play Now</a>");
	return perspID;
  });
}
