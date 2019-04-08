maxThumbs = 6;

window.onload = function() {
  firebase.database().ref('perspectives').on('child_added', function(data) {
    if ($("#gallery div div span").length >= maxThumbs) {
      $("#gallery div div span:last-child").remove();
    }
    $("#gallery div div.span12").prepend("<div style='display:inline-block; width: 200px; height: 200px; background-color: " + data.val().color + "'>" + data.val().title + "<br><small></small>by " + data.val().creator + "</div>");
  });
};
