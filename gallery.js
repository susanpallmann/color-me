maxThumbs = 6;

window.onload = function() {
  firebase.database().ref('perspectives').orderByChild('timestamp').limitToLast(maxThumbs).on('child_added', function(data) {
    if ($("#gallery div").length >= maxThumbs) {
      $("#gallery div:last-child").remove();
    }
    $("#gallery").prepend("<div style='background-color: " + data.val().color + "'><div>Color me " + data.val().title + "</div><small>by " + data.val().creator + "</small></div>");
  });
};
