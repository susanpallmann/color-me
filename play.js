function determinePerspective() {
  var perspID = "";
  var currentURL = window.location.href;
  if (currentURL.includes("?id=")) {
    perspID = currentURL.split("?id=")[1];
  }
  return perspID;
}

function loadPerspective(perspID) {
    firebase.database().ref('perspectives/' + perspID).once('value').then(function(snapshot) {
        var title = snapshot.child('title').val();
        var creator = snapshot.child('creator').val();
        var hue = snapshot.child('colorHue').val();
        var sat = snapshot.child('colorSat').val();
        var lgh = snapshot.child('colorLgh').val();
        var views = snapshot.child('views').val();
        var newViews = Number(views + 2);
        firebase.database().ref('perspectives/' + perspID).child('views').set(newViews);
        alert(hue, sat, lgh);
        setBackgroundColor(hue, sat, lgh);
        $("#viewCounter").html(newViews);
    });
}

window.onload = function() {
  var perspID = determinePerspective();
  loadPerspective(perspID);
};
