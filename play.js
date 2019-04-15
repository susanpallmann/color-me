var stage = 0;
var title;
var creator;
var description;
var timestamp;
var hue;
var sat;
var lgh;
var compHue;
var compSat;
var compLgh;
var backButton;
var effectA;
var effectB;
var effectC;
var effectD;
var effectE;
var effectF;
var effectG;
var effectH;
var effectI;
var effectJ;
var effectK;
var effectL;
var effectM;
var grows;
var views;
var currentURL;
var currentStage;

function determinePerspective() {
  var perspID = "";
  currentStage = window.location.href.split("&stage=")[1];
  if (currentStage != undefined) {
    currentStage = currentStage.split("&")[0];
  }
  currentStage = Number(currentStage);
  currentURL = window.location.href.split("&")[0];
  if (currentURL.includes("?id=")) {
    perspID = currentURL.split("?id=")[1];
  }
  return perspID;
}

function loadPerspective(perspID) {
    firebase.database().ref('perspectives/' + perspID).once('value').then(function(snapshot) {
        title = snapshot.child('title').val();
        creator = snapshot.child('creator').val();
        description = snapshot.child('description').val();
        timestamp = snapshot.child('timestamp').val();
        hue = snapshot.child('colorHue').val();
        sat = snapshot.child('colorSat').val();
        lgh = snapshot.child('colorLgh').val();
        backButton = snapshot.child('backButton').val();
        effectA = snapshot.child('effectA').val();
        effectB = snapshot.child('effectB').val();
        effectC = snapshot.child('effectC').val();
        effectD = snapshot.child('effectD').val();
        effectE = snapshot.child('effectE').val();
        effectF = snapshot.child('effectF').val();
        effectG = snapshot.child('effectG').val();
        effectH = snapshot.child('effectH').val();
        effectI = snapshot.child('effectI').val();
        effectJ = snapshot.child('effectJ').val();
        effectK = snapshot.child('effectK').val();
        effectL = snapshot.child('effectL').val();
        effectM = snapshot.child('effectM').val();
        grows = snapshot.child('grows').val();
        views = snapshot.child('views').val();
        var newViews = Number(views + 1);
        firebase.database().ref('perspectives/' + perspID).child('views').set(newViews);
        setBackgroundColor(hue, sat, lgh);
        var compColor = getComplementaryColor(hue, sat, lgh);
        compHue = compColor[0];
        compSat = compColor[1];
        compLgh = compColor[2];
        $("div.stage").css("background-image", "linear-gradient(to bottom right, hsl(" + hue + ", " + sat + ", " + lgh + "), hsl(" + compHue + ", " + compSat + ", " + compLgh + "))");
        $("title").html("Color Me " + title + " by " + creator);
        $("div.textbox").html(description);
        $("#viewCounter").html(newViews);
    });
}

window.onload = function() {
  var perspID = determinePerspective();
  loadPerspective(perspID);
  
  $("#stage_1 #mug").click(function() {
    $(this).css("transition", "transform 1s ease-in");
    var timer = setInterval(function() {
      if (Math.random() < 0.02) {
        $("#stage_1 #mug").css("transform", "skew(" + (Math.random()*90-45) + "deg, " + (Math.random()*90-45) + "deg)");
      }
    }, 10);
  });
  
  if (currentStage != undefined) {
    goToStage(currentStage);
  } else {
    goToStage(1);
  }
  $("#stage_1 .nextButton").click(function() {
    goToStage(2);
  });
  $("#stage_2 .nextButton").click(function() {
    goToStage(3);
  });
  $("#stage_3 .nextButton").click(function() {
    goToStage(4);
  });
  $("#stage_4 .nextButton").click(function() {
    goToStage(5);
  });
};

function goToStage(stageNo) {
  if (stageNo > 1) {
    $("#stage_" + (stageNo - 1)).css("top", "-100vh");
  }
  currentStage = stageNo;
  window.history.pushState("object or string", "Stage " + stageNo, currentURL + "&stage=" + stageNo);
  $("#stage_" + stageNo).css("top", 0);
}





// EFFECTS COMPILER //
function compileEffects() {    
    if (stage == 1) {
        if (effectA) {
            runEffectA_1();
        }
        if (effectB) {
            runEffectB_1();
        }
        if (effectC) {
            runEffectC_1();
        }
        if (effectD) {
            runEffectD_1();
        }
        if (effectE) {
            runEffectE_1();
        }
        if (effectF) {
            runEffectF_1();
        }
        if (effectG) {
            runEffectG_1();
        }
        if (effectH) {
            runEffectH_1();
        }
        if (effectI) {
            runEffectI_1();
        }
        if (effectJ) {
            runEffectJ_1();
        }
        if (effectK) {
            runEffectK_1();
        }
        if (effectL) {
            runEffectL_1();
        }
        if (effectM) {
            runEffectM_1();
        }
    } else if (stage == 2) {
        if (effectA) {
            runEffectA_2();
        }
        if (effectB) {
            runEffectB_2();
        }
        if (effectC) {
            runEffectC_2();
        }
        if (effectD) {
            runEffectD_2();
        }
        if (effectE) {
            runEffectE_2();
        }
        if (effectF) {
            runEffectF_2();
        }
        if (effectG) {
            runEffectG_2();
        }
        if (effectH) {
            runEffectH_2();
        }
        if (effectI) {
            runEffectI_2();
        }
        if (effectJ) {
            runEffectJ_2();
        }
        if (effectK) {
            runEffectK_2();
        }
        if (effectL) {
            runEffectL_2();
        }
        if (effectM) {
            runEffectM_2();
        }
    } else if (stage == 3) {
        if (effectA) {
            runEffectA_3();
        }
        if (effectB) {
            runEffectB_3();
        }
        if (effectC) {
            runEffectC_3();
        }
        if (effectD) {
            runEffectD_3();
        }
        if (effectE) {
            runEffectE_3();
        }
        if (effectF) {
            runEffectF_3();
        }
        if (effectG) {
            runEffectG_3();
        }
        if (effectH) {
            runEffectH_3();
        }
        if (effectI) {
            runEffectI_3();
        }
        if (effectJ) {
            runEffectJ_3();
        }
        if (effectK) {
            runEffectK_3();
        }
        if (effectL) {
            runEffectL_3();
        }
        if (effectM) {
            runEffectM_3();
        }
    }
}




// EFFECTS CODES //
function runEffectA_1() {
}

function runEffectA_2() {
}

function runEffectA_3() {
}

function runEffectB_1() {
}

function runEffectB_2() {
}

function runEffectB_3() {
}

function runEffectC_1() {
}

function runEffectC_2() {
}

function runEffectC_3() {
}

function runEffectD_1() {
}

function runEffectD_2() {
}

function runEffectD_3() {
}

function runEffectE_1() {
}

function runEffectE_2() {
}

function runEffectE_3() {
}

function runEffectF_1() {
}

function runEffectF_2() {
}

function runEffectF_3() {
}

function runEffectG_1() {
}

function runEffectG_2() {
}

function runEffectG_3() {
}

function runEffectH_1() {
}

function runEffectH_2() {
}

function runEffectH_3() {
}

function runEffectI_1() {
}

function runEffectI_2() {
}

function runEffectI_3() {
}

function runEffectJ_1() {
}

function runEffectJ_2() {
}

function runEffectJ_3() {
}

function runEffectK_1() {
}

function runEffectK_2() {
}

function runEffectK_3() {
}

function runEffectL_1() {
}

function runEffectL_2() {
}

function runEffectL_3() {
}

function runEffectM_1() {
}

function runEffectM_2() {
}

function runEffectM_3() {
}
