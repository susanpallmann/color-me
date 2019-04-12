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
    var compCol = getComplimentaryColor(hue, sat, lgh);
    var compColStr = "hsl(" + compCol[0] + ", " + compCol[1] + "%, " + compCol[2] + "%)";
    var textCol = "black";
    if (isDarkColor(hue, sat, lgh)) {
      textCol = "white";
    }
    $("#gallery").prepend("<div style='color: " + textCol + "; background-image: linear-gradient(to bottom right, " + hslString + ", " + compColStr + ");'>Color Me " + data.val().title + "</br><small>by " + data.val().creator + "</small></div>");
  });
};
