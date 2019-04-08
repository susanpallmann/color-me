function loadGallery() {
  var galleryHTML = "";
  firebase.database().ref('perspectives').orderByChild('title').limitToFirst(6).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      galleryHTML ++ "<span style='width: 200px; height: 200px; background-color: " + childSnapshot.val().color + "'>" + childSnapshot.val().title + "<br><small></small>by " + childSnapshot.val().creator + "</span>";
    });
  });
  $("#gallery div div").html(galleryHTML);
}

window.onload = function() {
  loadGallery();
  firebase.database().ref('perspectives').on('child_added', function(data) {
    $("#gallery div div span:last-child").remove();
    $("#gallery div div").prepend("<span style='width: 200px; height: 200px; background-color: " + data.val().color + "'>" + data.val().title + "<br><small></small>by " + data.val().creator + "</span>");
  });
};
