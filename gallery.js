maxThumbs = 6;

function loadGallery() {
  var galleryHTML = "";
  firebase.database().ref('perspectives').orderByChild('title').limitToFirst(maxThumbs).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      galleryHTML = galleryHTML + "<div style='display:inline-block; width: 200px; height: 200px; background-color: " + childSnapshot.val().color + "'>" + childSnapshot.val().title + "<br><small></small>by " + childSnapshot.val().creator + "</div>";
    });
  });
  $("#gallery div div").html(galleryHTML);
}

window.onload = function() {
  loadGallery();
  //firebase.database().ref('perspectives').on('child_added', function(data) {
  //  if ($("#gallery div div span").length >= maxThumbs) {
  //    $("#gallery div div span:last-child").remove();
  //  }
  //  $("#gallery div div").prepend("<div style='display:inline-block; width: 200px; height: 200px; background-color: " + data.val().color + "'>" + data.val().title + "<br><small></small>by " + data.val().creator + "</div>");
  //});
};
