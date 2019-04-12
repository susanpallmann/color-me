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
        firebase.database().ref('perspectives/' + perspID).set({views: views + 1});
        alert("This experience has " + views + 1 + " views!");
        var compCol = getComplementaryColor(hue, sat, lgh);
        var compHue = compCol[0];
        var compSat = compCol[1];
        var compLgh = compCol[2];
        $("body").css("background-image", "linear-gradient(to bottom right, hsl(" + hue + ", " + sat + "%, " + lgh + "%), hsl("  + compHue + ", " + compSat + "%, " + compLgh + "%)");
        $("#viewCounter").html(views + 1);
        alert("This experience has " + views + 1 + " views!");
    });
}

window.onload = function() {
  var perspID = determinePerspective();
  loadPerspective(perspID);
};
