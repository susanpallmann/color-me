var maxThumbs = 12;
var queryRef = firebase.database().ref('perspectives/visible').orderByChild('colorHue').limitToFirst(maxThumbs);
var galleryHTML = "";
var galleryItemSize = 170;
var galleryMinGap = 20;


$(document).ready(function() {
	
	determineStage();
	goToStage(stage);
	loadGallery(queryRef);
	
	$("#searchButton").click(function() {
		beginSearch();
	});
	$("#searchInput").on('input', function() {
		var prevOrder = $("#searchSort").text();
		if (prevOrder == "sorted by color") {
			$("#searchSort").text("sorted by name");
			beginSearch();
		}
	});
	$("#searchInput").keypress(function(event){
    		var keycode = (event.keyCode ? event.keyCode : event.which);
    		if(keycode == '13'){
        		beginSearch();
    		}
	});
	$("#searchSort").click(function() {
		var prevOrder = $(this).text();
		if (prevOrder == "sorted by color") {
			$(this).text("sorted by name");
			$("#searchButton").attr("disabled", false);
			$("#searchInput").attr("value", "");
			$("#searchInput").attr("disabled", false);
			beginSearch();
		} else {
			$(this).text("sorted by color");
			galleryHTML = "";
			$("#searchButton").attr("disabled", true);
			$("#searchInput").attr("value", "must sort by name");
			$("#searchInput").attr("disabled", true);
			var newQueryRef = firebase.database().ref('perspectives/visible').orderByChild('colorHue').limitToFirst(maxThumbs);
			loadGallery(newQueryRef);
			
		}
	});
	$("#searchCount").click(function() {
		switch(maxThumbs) {
			case 6:
				$(this).text("load 12");
				maxThumbs = 12;
				break;
			case 12:
				$(this).text("load 18");
				maxThumbs = 18;
				break;
			case 18:
				$(this).text("load 24");
				maxThumbs = 24;
				break;
			case 24:
				$(this).text("load 30");
				maxThumbs = 30;
				break;
			case 30:
				$(this).text("load 36");
				maxThumbs = 36;
				break;
			default:
				$(this).text("load 6");
				maxThumbs = 6;
		}
		if ($("#searchSort").text() == "sorted by name") {
			beginSearch();
		} else {
			var newQueryRef = firebase.database().ref('perspectives/visible').orderByChild('colorHue').limitToFirst(maxThumbs);
			galleryHTML = "";
			loadGallery(newQueryRef);
		}
	});
	
	
	$(window).resize(function() {
		setGalleryMargins();
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
		setGalleryMargins();
		$("#gallery > div").click(function() {
			window.location.href = "/experience?id=" + $(this).attr("id");
		});
	});
}

function setGalleryMargins() {
	var galleryWidth = $("#gallery").width();
	var galleryNoPerRow = Math.floor(galleryWidth/(galleryItemSize+galleryMinGap));
	var galleryGap = galleryMinGap + (galleryWidth - (galleryNoPerRow*(galleryItemSize) + (galleryNoPerRow-1)*2*galleryMinGap))/(2*(galleryNoPerRow - 1));
	$("#gallery > div").css("margin", galleryGap + "px");
	$("#gallery > div:nth-child(" + galleryNoPerRow + "n + " + galleryNoPerRow).css("margin-right", 0);
	$("#gallery > div:nth-child(" + galleryNoPerRow + "n + 1").css("margin-left", 0);
}

function beginSearch() {
	var searchTerm = $("#searchInput").val().toLowerCase();
	var newQueryRef = firebase.database().ref('perspectives/visible/').orderByChild('titleLower').startAt(searchTerm).endAt(searchTerm + '\uf8ff').limitToLast(maxThumbs);
	galleryHTML = "";
	loadGallery(newQueryRef);
}
