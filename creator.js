$("input.value_color").on('input', function() {
				var colorHue = $("input#value_colorHue").val();
        var colorSat = $("input#value_colorSat").val();
        var colorLgh = $("input#value_colorLgh").val();
        $("#display_color").css("background-color", "hsl(" + colorHue + ", " + colorSat + "%, " + colorLgh + "%)");
});
