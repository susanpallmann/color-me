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
        var colorHue = snapshot.child('colorHue').val();
        var colorSat = snapshot.child('colorSat').val();
        var colorLgh = snapshot.child('colorLgh').val();
        var views = snapshot.child('views').val();
    });
    firebase.database().ref('perspectives/' + perspID).set({views: views + 1});
    alert("This experience has " + views + 1 + " views!");
}

window.onload = function() {
  var perspID = determinePerspective();
  loadPerspective(perspID);
};
