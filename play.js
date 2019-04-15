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
var effectA = false;
var effectB = false;
var effectC = false;
var effectD = false;
var effectE = false;
var effectF = false;
var effectG = false;
var effectH = false;
var effectI = false;
var effectJ = false;
var effectK = false;
var effectL = false;
var effectM = false;
var grows;
var views;
var currentURL;

function determinePerspective() {
  var perspID = "";
  stage = window.location.href.split("&stage=")[1];
  if (stage != undefined) {
    stage = stage.split("&")[0];
    stage = Math.round(Number(stage));
    if (stage < 0 || stage > 4) {
      stage = 0;
    }
  } else {
    stage = 0;
  }
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
        $("div.stage").css("background-image", "linear-gradient(to bottom right, hsl(" + hue + ", " + sat + "%, " + lgh + "%), hsl(" + compHue + ", " + compSat + "%, " + compLgh + "%))");
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
        $("#stage_0 #mug").css("transform", "skew(" + (Math.random()*90-45) + "deg, " + (Math.random()*90-45) + "deg)");
      }
    }, 10);
  });
  
  goToStage(stage);
  $("#stage_0 .nextButton").click(function() {
    goToStage(1);
  });
  $("#stage_1 .nextButton").click(function() {
    goToStage(2);
  });
  $("#stage_2 .nextButton").click(function() {
    goToStage(3);
  });
  $("#stage_3 .nextButton").click(function() {
    goToStage(4);
  });
  
  $(".draggable").on("mousedown", function(e) {
    effectA = true;
    $(this).css("transition", "filter 2s");
    compileEffects(this);
    $(this).attr("draggable", false);
    var prevX = e.pageX;
    var prevY = e.pageY;
    var target = this;
    $(this).parent().on("mousemove", function(e) {
        var x = $(target).offset().left + (e.pageX - prevX);
        var y = $(target).offset().top + (e.pageY - prevY);
        $(target).offset({top: y, left: x});
        prevX = e.pageX;
        prevY = e.pageY;
    });
    $(this).parent().on("mouseup", function(e) {
      $(target).css("filter", "");
      $(this).off("mousemove").off("mouseup");
    });
  });
};

function goToStage(stageNo) {
  if (stageNo > 1) {
    $("#stage_" + (stageNo - 1)).css("top", "-100vh");
  }
  stage = stageNo;
  window.history.pushState("object or string", "Stage " + stageNo, currentURL + "&stage=" + stageNo);
  $("#stage_" + stageNo).css("top", 0);
}




// EFFECTS COMPILER //
function compileEffects(target) {    
    if (stage == 1) {
        if (effectA) {
            runEffectA_1(target);
        }
        if (effectB) {
            runEffectB_1(target);
        }
        if (effectC) {
            runEffectC_1(target);
        }
        if (effectD) {
            runEffectD_1(target);
        }
        if (effectE) {
            runEffectE_1(target);
        }
        if (effectF) {
            runEffectF_1(target);
        }
        if (effectG) {
            runEffectG_1(target);
        }
        if (effectH) {
            runEffectH_1(target);
        }
        if (effectI) {
            runEffectI_1(target);
        }
        if (effectJ) {
            runEffectJ_1(target);
        }
        if (effectK) {
            runEffectK_1(target);
        }
        if (effectL) {
            runEffectL_1(target);
        }
        if (effectM) {
            runEffectM_1(target);
        }
    } else if (stage == 2) {
        if (effectA) {
            runEffectA_2(target);
        }
        if (effectB) {
            runEffectB_2(target);
        }
        if (effectC) {
            runEffectC_2(target);
        }
        if (effectD) {
            runEffectD_2(target);
        }
        if (effectE) {
            runEffectE_2(target);
        }
        if (effectF) {
            runEffectF_2(target);
        }
        if (effectG) {
            runEffectG_2(target);
        }
        if (effectH) {
            runEffectH_2(target);
        }
        if (effectI) {
            runEffectI_2(target);
        }
        if (effectJ) {
            runEffectJ_2(target);
        }
        if (effectK) {
            runEffectK_2(target);
        }
        if (effectL) {
            runEffectL_2(target);
        }
        if (effectM) {
            runEffectM_2(target);
        }
    } else if (stage == 3) {
        if (effectA) {
            runEffectA_3(target);
        }
        if (effectB) {
            runEffectB_3(target);
        }
        if (effectC) {
            runEffectC_3(target);
        }
        if (effectD) {
            runEffectD_3(target);
        }
        if (effectE) {
            runEffectE_3(target);
        }
        if (effectF) {
            runEffectF_3(target);
        }
        if (effectG) {
            runEffectG_3(target);
        }
        if (effectH) {
            runEffectH_3(target);
        }
        if (effectI) {
            runEffectI_3(target);
        }
        if (effectJ) {
            runEffectJ_3(target);
        }
        if (effectK) {
            runEffectK_3(target);
        }
        if (effectL) {
            runEffectL_3(target);
        }
        if (effectM) {
            runEffectM_3(target);
        }
    }
}




// EFFECTS CODES //
function runEffectA_1(target) {
  $(target).css("filter", "saturate(100%)");
}

function runEffectA_2(target) {
  $(target).css("filter", "saturate(200%)");
}

function runEffectA_3(target) {
  $(target).css("filter", "saturate(500%)");
}

function runEffectB_1(target) {
}

function runEffectB_2(target) {
}

function runEffectB_3(target) {
}

function runEffectC_1(target) {
}

function runEffectC_2(target) {
}

function runEffectC_3(target) {
}

function runEffectD_1(target) {
}

function runEffectD_2(target) {
}

function runEffectD_3(target) {
}

function runEffectE_1(target) {
}

function runEffectE_2(target) {
}

function runEffectE_3(target) {
}

function runEffectF_1(target) {
}

function runEffectF_2(target) {
}

function runEffectF_3(target) {
}

function runEffectG_1(target) {
}

function runEffectG_2(target) {
}

function runEffectG_3(target) {
}

function runEffectH_1(target) {
}

function runEffectH_2(target) {
}

function runEffectH_3(target) {
}

function runEffectI_1(target) {
}

function runEffectI_2(target) {
}

function runEffectI_3(target) {
}

function runEffectJ_1(target) {
}

function runEffectJ_2(target) {
}

function runEffectJ_3(target) {
}

function runEffectK_1(target) {
}

function runEffectK_2(target) {
}

function runEffectK_3(target) {
}

function runEffectL_1(target) {
}

function runEffectL_2(target) {
}

function runEffectL_3(target) {
}

function runEffectM_1(target) {
}

function runEffectM_2(target) {
}

function runEffectM_3(target) {
}
