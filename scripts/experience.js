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
var effect_pulling = false;
var effect_melting = false;
var effect_blackHole = false;
var effect_fading = false;
var effect_blurring = false;
var effect_colorLoss = false;
var effect_colorChange = false;
var effect_popups = false;
var effect_shaking = false;
var effect_outOfReach = false;
var effect_immobility = false;
var effect_distortion = false;
var effect_rituals = false;
var visibleInGallery = "hidden";
var views;
var currentURL;
var lastScrollTime = 0;

function determinePerspective() {
  var perspID = "";
  stage = window.location.href;
  if (stage.includes("&stage=")) {
    stage = window.location.href.split("&stage=")[1];
    if (stage.includes("&")) {
      stage = stage.split("&")[0];
    }
  } else {
    stage = 0;
  }
  stage = Math.round(Number(stage));
  if (stage < 0 || stage > 4 || isNaN(stage)) {
    stage = 0;
  }
  currentURL = window.location.href.split("&")[0];
  if (currentURL.includes("?id=")) {
    perspID = currentURL.split("?id=")[1];
    if (perspID.includes("+")) {
      perspID = perspID.split("+")[0];
      visibleInGallery = "visible";
    }
  }
  return perspID;
}

function loadPerspective(perspID) {
    firebase.database().ref('perspectives/' + visibleInGallery + '/' + perspID).once('value').then(function(snapshot) {
        title = snapshot.child('title').val();
        creator = snapshot.child('creator').val();
        description = snapshot.child('description').val();
        timestamp = snapshot.child('timestamp').val();
        hue = snapshot.child('colorHue').val();
        sat = snapshot.child('colorSat').val();
        lgh = snapshot.child('colorLgh').val();
        backButton = snapshot.child('backButton').val();
        effect_pulling = snapshot.child('effect_pulling').val();
        effect_melting = snapshot.child('effect_melting').val();
        effect_blackHole = snapshot.child('effect_blackHole').val();
        effect_fading = snapshot.child('effect_fading').val();
        effect_blurring = snapshot.child('effect_blurring').val();
        effect_colorLoss = snapshot.child('effect_colorLoss').val();
        effect_colorChange = snapshot.child('effect_colorChange').val();
        effect_popups = snapshot.child('effect_popups').val();
        effect_shaking = snapshot.child('effect_shaking').val();
        effect_outOfReach = snapshot.child('effect_outOfReach').val();
        effect_immobility = snapshot.child('effect_immobility').val();
        effect_distortion = snapshot.child('effect_distortion').val();
        effect_rituals = snapshot.child('effect_rituals').val();
        views = snapshot.child('views').val();
        var newViews = Number(views + 1);
        firebase.database().ref('perspectives/' + visibleInGallery + '/' + perspID).child('views').set(newViews);
        setBackgroundColor(hue, sat, lgh);
        var compColor = getComplementaryColor(hue, sat, lgh);
        compHue = compColor[0];
        compSat = compColor[1];
        compLgh = compColor[2];
        $("div.stage:nth-child(odd)").css("background-image", "radial-gradient(at bottom right, hsl(" + compHue + ", " + compSat + "%, " + compLgh + "%), hsl(" + hue + ", " + sat + "%, " + lgh + "%))");
        $("div.stage:nth-child(even)").css("background-image", "radial-gradient(at top right, hsl(" + compHue + ", " + compSat + "%, " + compLgh + "%), hsl(" + hue + ", " + sat + "%, " + lgh + "%))");
        $("title").html("Color Me " + title + " by " + creator);
        $("div.textbox").html(description);
        $("#viewCounter").html(newViews);
        $("#backButton").html(backButton);
    });
}

window.onload = function() {
  $("img").attr("draggable", false);
  var perspID = determinePerspective();
  loadPerspective(perspID);
  
  $("#stage_1 #mug").click(function() {
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
  
  $(".draggable").on("mousedown touchdown", function(e) {
    effectA = true;
    $(this).css("transition", "2s");
    $(this).css("transition-property", "filter, opacity, transform");
    compileEffects(this);
    var prevX = e.pageX;
    var prevY = e.pageY;
    var target = this;
    $(this).parent().on("mousemove touchmove", function(e) {
        var x = $(target).offset().left + (e.pageX - prevX);
        var y = $(target).offset().top + (e.pageY - prevY);
        $(target).offset({top: y, left: x});
        $(target).css("z-index", Math.round((y+$(target).height())));
        prevX = e.pageX;
        prevY = e.pageY;
    });
    $(window).on("mouseup touchup", function(e) {
      $(target).css("filter", "");
      $(target).css("transform", "");
      $(target).css("opacity", "");
      $(target).parent().off("mousemove touchmove");
      $(window).off("mouseup touchup");
    });
  });
  
  $(".navMarker").click(function() {
    if ($(this).hasClass("markerInactive")) {
      var stageNav = $(this).attr("id").split("-")[1];
      goToStage(stageNav);
    }
  });
  
  $(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta > 0 && stage > 0 && Date.now() > lastScrollTime + 250) {
      lastScrollTime = Date.now();
      goToStage(stage - 1);
    }
    else if (event.originalEvent.wheelDelta < 0 && stage < 4 && Date.now() > lastScrollTime + 250) {
      lastScrollTime = Date.now();
      goToStage(stage + 1);
    }
  });
  $(window).bind('DOMMouseScroll', function(e) {
    console.log(Date.now() + ", " + lastScrollTime);
    if (e.originalEvent.detail > 0 && stage > 0 && Date.now() > lastScrollTime + 250) {
      lastScrollTime = Date.now();
      goToStage(stage - 1);
      console.log("scrolled");
    }
    else if (e.originalEvent.detail < 0 && stage < 4 && Date.now() > lastScrollTime + 250) {
      lastScrollTime = Date.now();
      goToStage(stage + 1);
      console.log("scrolled");
    }
  });
  
};

function goToStage(stageNo) {
  if (stageNo > 1) {
    $("#stage_" + (stageNo - 1)).css("top", "-100vh");
  }
  stage = stageNo;
  window.history.pushState("object or string", "Stage " + stageNo, currentURL + "&stage=" + stageNo);
  $(".navMarker.markerActive").removeClass("markerActive").addClass("markerInactive");
  $("#navMarker-" + stageNo).removeClass("markerInactive").addClass("markerActive");
  var i;
  for (i = 0; i < 5; i++) {
    if (i == stageNo) {
      $("#stage_" + i).css("top", 0);
    } else {
      $("#stage_" + i).css("top", (100*(i-stageNo)) + "vh");
    }
  }
  $(".stage").css("transition", "0.5s ease-in-out");
}




// EFFECTS COMPILER //
function compileEffects(target) {
    
    if (effect_pulling) {
        runEffect_pulling(target);
    }
    if (effect_melting) {
        runEffect_melting(target);
    }
    if (effect_blackHole) {
        runEffect_blackHole(target);
    }
    if (effect_fading) {
        runEffect_fading(target);
    }
    if (effect_blurring) {
        runEffect_blurring(target);
    }
    if (effect_colorLoss) {
        runEffect_colorLoss(target);
    }
    if (effect_colorChange) {
        runEffect_colorChange(target);
    }
    if (effect_popups) {
        runEffect_popups(target);
    }
    if (effect_shaking) {
        runEffect_shaking(target);
    }
    if (effect_outOfReach) {
        runEffect_outOfReach(target);
    }
    if (effect_immobility) {
        runEffect_immobility(target);
    }
    if (effect_distortion) {
        runEffect_distortion(target);
    }
    if (effect_rituals) {
        runEffect_rituals(target);
    }
}




// EFFECTS CODES //
function runEffect_pulling(target) {
  if (stage == 1) {
    $(target).css("top", $(target).css("top") + (Math.random()-0.5)*10);
    $(target).css("left", $(target).css("left") + (Math.random()-0.5)*10);
  } else if (stage == 2) {
    $(target).css("top", $(target).css("top") + (Math.random()-0.5)*20);
    $(target).css("left", $(target).css("left") + (Math.random()-0.5)*20);
  } else if (stage == 3) {
    $(target).css("top", $(target).css("top") + (Math.random()-0.5)*50);
    $(target).css("left", $(target).css("left") + (Math.random()-0.5)*50);
  }
}

function runEffect_melting(target) {
}

function runEffect_blackHole(target) {
}

function runEffect_fading(target) {
  if (stage == 1) {
    $(target).css("opacity", "0.8");
  } else if (stage == 2) {
    $(target).css("opacity", "0.5");
  } else if (stage == 3) {
    $(target).css("opacity", "0");
  }
}

function runEffect_blurring(target) {
  if (stage == 1) {
    $(target).css("filter", $(target).css("filter") + " blur(2px)");
  } else if (stage == 2) {
    $(target).css("filter", $(target).css("filter") + " blur(5px)");
  } else if (stage == 3) {
    $(target).css("filter", $(target).css("filter") + " blur(10px)");
  }
}

function runEffect_colorLoss(target) {
  if (stage == 1) {
    $(target).css("filter", $(target).css("filter") + " saturate(50%)");
  } else if (stage == 2) {
    $(target).css("filter", $(target).css("filter") + " saturate(20%)");
  } else if (stage == 3) {
    $(target).css("filter", $(target).css("filter") + " saturate(0%)");
  }
}

function runEffect_colorChange(target) {
  if (stage == 1) {
    $(target).css("filter", $(target).css("filter") + " hue-rotate(" + (Math.random()-0.5)/2 + "turn)");
  } else if (stage == 2) {
    $(target).css("filter", $(target).css("filter") + " hue-rotate(" + (Math.random()-0.5) + "turn)");
  } else if (stage == 3) {
    $(target).css("filter", $(target).css("filter") + " hue-rotate(" + (Math.random()-0.5)*2 + "turn)");
  }
}

function runEffect_popups(target) {
  if (stage == 1) {
    if (Math.random() < 0.2) {
      var isConfirmed = confirm("Are you sure about that?");
    }
  } else if (stage == 2) {
    var isConfirmed = confirm("Are you sure about that?");
    if (isConfirmed && Math.random() < 0.5) {
      var isConfirmed = confirm("Are you really sure?");
    }
  } else if (stage == 3) {
    var escaped = false;
    while(!escaped) {
      if (Math.random() < 0.3) {
        var isConfirmed = confirm("Are you sure about that?");
      } else if (Math.random() < 0.5) {
        var isConfirmed = confirm("Are you really sure?");
      } else {
        var isConfirmed = confirm("I wouldn't be so sure. Are you?");
      }
      if (Math.random() < 0.1) {
        escaped = true;
      }
    }
  }
}

function runEffect_shaking(target) {
}

function runEffect_outOfReach(target) {
}

function runEffect_immobility(target) {
  if (stage == 1) {
    $(target).css("transition-property", $(target).css("transition-property") + ", top, left");
  } else if (stage == 2) {
    $(target).css("transition-property", $(target).css("transition-property") + ", top, left");
    if (Math.random() < 0.3) {
      $(target).css("filter", "");
      $(target).css("transform", "");
      $(target).css("opacity", "");
      $(target).parent().off("mousemove touchmove");
      $(window).off("mouseup touchup");
    }
  } else if (stage == 3) {
    $(target).css("transition-property", $(target).css("transition-property") + ", top, left");
    if (Math.random() < 0.8) {
      $(target).css("filter", "");
      $(target).css("transform", "");
      $(target).css("opacity", "");
      $(target).parent().off("mousemove touchmove");
      $(window).off("mouseup touchup");
    }
  }
}

function runEffect_distortion(target) {
  if (stage == 1) {
    $(target).css("transform", "skew(" + (Math.random()*20-10) + "deg, " + (Math.random()*20-10) + "deg)");
  } else if (stage == 2) {
    $(target).css("transform", "skew(" + (Math.random()*90-45) + "deg, " + (Math.random()*90-45) + "deg)");
  } else if (stage == 3) {
    $(target).css("transform", "skew(" + (Math.random()*180-90) + "deg, " + (Math.random()*180-90) + "deg)");
  }
}

function runEffect_rituals(target) {
}
