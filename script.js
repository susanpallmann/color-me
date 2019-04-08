// Initialize Firebase
var config = {
  apiKey: "AIzaSyBNFTPiWRlwZznLctp-tkenqQWHfpzBbFI",
  authDomain: "perspectives-f401a.firebaseapp.com",
  databaseURL: "https://perspectives-f401a.firebaseio.com",
  projectId: "perspectives-f401a",
  storageBucket: "perspectives-f401a.appspot.com",
  messagingSenderId: "805764424713"
};
firebase.initializeApp(config);
var bigOne = document.getElementById('bigOne');
var dbRef = firebase.database().ref().child('text');
dbRef.on('value', snap => bigOne.innerText = snap.val());

function onSave() {
  var values = {
    title: '',
    description: '',
    color: '',
    backButton: '',
    effectA: false,
    effectB: false,
    effectC: false,
    effectD: false,
    effectE: false,
    effectF: false,
    effectG: false,
    effectH: false,
    effectI: false,
    effectJ: false,
    effectK: false,
    effectL: false,
    effectM: false,
    grows: true,
    visibleInGallery: true
  };
  
}

// Creates a new perspective and returns ID.
function newPerspective(values) {
  var perspID = firebase.database().ref('perspectives/').push(values).getKey();
  loadPerspective(perspID);
  return perspID;
}

// Loads a perspective by its ID.
function loadPerspective(perspID) {
    firebase.database().ref('perspectives/' + perspID).once('value').then(function(snapshot) {
        var data1 = snapshot.child('data1').val();
        var data2 = snapshot.child('data2').val();
        var data3 = snapshot.child('data3').val();
        alert (perspID + " has values: " + data1 + ", " + data2 + ", " + data3);
    });
}
