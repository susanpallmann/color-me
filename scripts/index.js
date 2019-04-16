initialMax = 5;
maxThumbs = initialMax;
galleryCap = 30;
queryRef = firebase.database().ref('perspectives').orderByChild('visibleInGallery').equalTo(true).limitToLast(maxThumbs);

$(document).ready(function() {
	
	loadGallery();
	
	$("button#loadMoreToGallery").click(function() {
		if ($("#gallery > div").length == maxThumbs && maxThumbs < galleryCap) {
			maxThumbs = maxThumbs + initialMax;
			if (maxThumbs > galleryCap) {
				maxThumbs = galleryCap;
			}
			$("#gallery").html("");
			loadGallery();
		} else {
			alert("No more gallery items to load");
		}
	});
	
	//Random BG color gen //
	// Generate any random color from all possible HSL values
	var randomNum = Math.random();
	var hue = Math.round(randomNum * 360);
	var sat = Math.round(Math.random()*80 + 10);
	var lgh = Math.round(Math.random()*60 + 20);
	
	setBackgroundColor(hue, sat, lgh);
	
});

function loadGallery() {
	queryRef.off();
	queryRef = firebase.database().ref('perspectives').orderByChild('visibleInGallery').equalTo(true).limitToLast(maxThumbs);
	queryRef.on('child_added', function(data) {
    		if ($("#gallery div").length >= maxThumbs) {
      			$("#gallery div:last-child").remove();
    		}
    		var hue = data.val().colorHue;
    		var sat = data.val().colorSat;
    		var lgh = data.val().colorLgh;
		var key = data.key;
		console.log(key);
    		var hslString = "hsl(" + hue + ", " + sat + "%, " + lgh + "%)";
    		var compCol = getComplementaryColor(hue, sat, lgh);
    		var compColStr = "hsl(" + compCol[0] + ", " + compCol[1] + "%, " + compCol[2] + "%)";
    		var textCol = "black";
    		if (isDarkColor(hue, sat, lgh)) {
      			textCol = "white";
    		}
		$("#gallery").prepend("<div id='" + key + "' style='color: " + textCol + "; background-image: linear-gradient(to bottom right, " + hslString + ", " + compColStr + ");'>Color Me " + data.val().title + "</br><small>by " + data.val().creator + "</small></div>");
		$("#gallery div#" + key).click(function() {
			window.location.href = "/experience?id=" + key;
		});
	});
}
