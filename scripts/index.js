initialMax = 5;
maxThumbs = initialMax;
galleryCap = 30;
queryRef = firebase.database().ref('perspectives/visible').orderByChild('colorHue').limitToFirst(maxThumbs);
galleryHTML = "";

$(document).ready(function() {
	
	loadGallery(queryRef);
	
	$("button#loadMoreToGallery").click(function() {
		if ($("#gallery > div").length == maxThumbs && maxThumbs < galleryCap) {
			maxThumbs = maxThumbs + initialMax;
			if (maxThumbs > galleryCap) {
				maxThumbs = galleryCap;
			}
			galleryHTML = "";
			var newQueryRef = firebase.database().ref('perspectives/visible').orderByChild('colorHue').limitToFirst(maxThumbs);
			loadGallery(newQueryRef);
		} else if (maxThumbs < galleryCap) {
			alert("No more gallery items to load");
			$("button#loadMoreToGallery").remove();
		} else {
			alert("Cannot load more than " + galleryCap + " items");
			$("button#loadMoreToGallery").remove();
		}
	});
	
	$("#searchButton").click(function() {
		var searchTerm = $("#searchInput").val().toLowerCase();
		var newQueryRef = firebase.database().ref('perspectives/visible/').orderByChild('titleLower').startAt(searchTerm).endAt(searchTerm + '\uf8ff').limitToLast(maxThumbs);
		galleryHTML = "";
		loadGallery(newQueryRef);
	});
	
	//Random BG color gen //
	// Generate any random color from all possible HSL values
	var randomNum = Math.random();
	var hue = Math.round(randomNum * 360);
	var sat = Math.round(Math.random()*80 + 10);
	var lgh = Math.round(Math.random()*60 + 20);
	
	setBackgroundColor(hue, sat, lgh);
	
});

function loadGallery(newQueryRef) {
	queryRef.off();
	queryRef = newQueryRef;
	queryRef.on('child_added', function(data) {
    		if ($("#gallery div").length >= maxThumbs) {
      			$("#gallery div:last-child").remove();
    		}
    		var hue = data.val().colorHue;
    		var sat = data.val().colorSat;
    		var lgh = data.val().colorLgh;
		var key = data.key;
    		var hslString = "hsl(" + hue + ", " + sat + "%, " + lgh + "%)";
    		var compCol = getComplementaryColor(hue, sat, lgh);
    		var compColStr = "hsl(" + compCol[0] + ", " + compCol[1] + "%, " + compCol[2] + "%)";
    		var textCol = "black";
    		if (isDarkColor(hue, sat, lgh)) {
      			textCol = "white";
    		}
		galleryHTML = galleryHTML + "<div id='" + key + "+' style='color: " + textCol + "; background-image: linear-gradient(to bottom right, " + hslString + ", " + compColStr + ");'>Color Me " + data.val().title + "</br><small>by " + data.val().creator + "</small></div>";
		$("#gallery").html(galleryHTML);
		$("#gallery > div").click(function() {
			window.location.href = "/experience?id=" + $(this).attr("id");
		});
	});
}
