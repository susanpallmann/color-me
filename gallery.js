maxThumbs = 6;

window.onload = function() {
  firebase.database().ref('perspectives').orderByChild('timestamp').limitToLast(maxThumbs).on('child_added', function(data) {
    if ($("#gallery div").length >= maxThumbs) {
      $("#gallery div:last-child").remove();
    }
    var hsl = getHSLFromString(data.val().color);
    console.log(hsl);
    var compCol = getComplimentaryColor(hsl[0], hsl[1], hsl[2]);
    console.log(compCol[0]);
    var compColStr = "hsl(" + compCol[0] + ", " + compCol[1] + "%, " + compCol[2] + "%)";
    console.log(compColStr);
    var textCol = "black";
    if (isDarkColor(hsl[0], hsl[1], hsl[2])) {
      textCol = "white";
    }
    $("#gallery").prepend("<div style='color: " + textCol + "; background-image: linear-gradient(to bottom right, " + data.val().color + ", " + compColStr + ");'>Color Me " + data.val().title + "</br><small>by " + data.val().creator + "</small></div>");
  });
};
