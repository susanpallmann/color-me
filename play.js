function determinePerspective() {
  var perspID = "";
  var currentURL = window.location.href;
  if (currentURL.includes("?")) {
    perspID = currentURL.split("?")[1];
  }
  return perspID;
}

function loadPerspective(perspID) {
    firebase.database().ref('perspectives/' + perspID).once('value').then(function(snapshot) {
        var title = snapshot.child('title').val();
        var creator = snapshot.child('creator').val();
        var color = snapshot.child('color').val();
        alert(title + " by " + creator + ", theme: " + color);
    });
}

window.onload = function() {
  var perspID = determinePerspective();
  loadPerspective();
};
