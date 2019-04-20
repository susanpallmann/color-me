// Global variables
var stage = 0;  // keeps track of the current stage: values 0-4 where stage 1-3 are the interactive stages
var currentURL; // the current page URL
var lastScrollTime = 0; // the time of last scroll (in milliseconds) to prevent over-scrolling.

// keep the values of the experience, taken from the database
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

// works out the ID of the perspective to load, based on the id present in the URL.
// if the stage is also set in the URL, this is saved so that the experience can start on the given stage.
function determinePerspective() {
    var perspID = "";
  
    // works out the current stage, if provided.
    stage = window.location.href;
    if (stage.includes("&stage=")) {
        stage = window.location.href.split("&stage=")[1];
        if (stage.includes("&")) {
            stage = stage.split("&")[0];
        }
    } else {
        // sets stage to 0 by default if not provided.
        stage = 0;
    }
    
    // ensures the stage is a valid integer from 0-4
    // otherwise sets to 0 by default
    stage = Math.round(Number(stage));
    if (stage < 0 || stage > 4 || isNaN(stage)) {
        stage = 0;
    }
  
    // works out the ID of the perspective, if provided.
    // if the final character of the ID is '+', search for the ID in the visible folder.
    // otherwise search for the ID in the hidden folder.
    currentURL = window.location.href.split("&")[0];
    if (currentURL.includes("?id=")) {
        perspID = currentURL.split("?id=")[1];
        if (perspID.includes("+")) {
            perspID = perspID.split("+")[0];
            visibleInGallery = "visible";
        }
    } else {
        // if no ID is provided, get the ID of the most recent experience added to the gallery
        firebase.database().ref('perspectives/visible').orderByChild('timestamp').limitToFirst(1).once('value', function(snapshot) {
            visibleInGallery = "visible";
            perspID = snapshot.key;
        });
        currentURL = currentURL + "?id=" + perspID + "+";
    }
  
    // returns the ID of the perspective to be played.
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
    if (event.originalEvent.wheelDelta > 0 && stage > 0 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      goToStage(stage - 1);
    }
    else if (event.originalEvent.wheelDelta < 0 && stage < 4 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      goToStage(stage + 1);
    }
  });
  $(window).bind('DOMMouseScroll', function(e) {
    if (e.originalEvent.detail > 0 && stage > 0 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      goToStage(stage - 1);
    }
    else if (e.originalEvent.detail < 0 && stage < 4 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      goToStage(stage + 1);
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
// checks which of the effects are in use for the given experience and runs the respective function.
// takes a target element(s) as input (in the form of a string which will be used in a jQuery selector)
// the target elements are the ones which will be affected by the effects when this function is run.
function compileEffects(target) {
  
    var filterValue = "";
    
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
  var newFilter = partiallyRemoveProperty(target, "filter", "blur");
  if (stage == 1) {
    $(target).css("filter", newFilter + " blur(2px)");
  } else if (stage == 2) {
    $(target).css("filter", newFilter + " blur(5px)");
  } else if (stage == 3) {
    $(target).css("filter", newFilter + " blur(10px)");
  }
}

function runEffect_colorLoss(target) {
  var newFilter = partiallyRemoveProperty(target, "filter", "saturate");
  if (stage == 1) {
    $(target).css("filter", newFilter + " saturate(50%)");
  } else if (stage == 2) {
    $(target).css("filter", newFilter + " saturate(20%)");
  } else if (stage == 3) {
    $(target).css("filter", newFilter + " saturate(0%)");
  }
}

function runEffect_colorChange(target) {
  var newFilter = partiallyRemoveProperty(target, "filter", "hue-rotate");
  if (stage == 1) {
    $(target).css("filter", newFilter + " hue-rotate(" + (Math.random()-0.5)/2 + "turn)");
  } else if (stage == 2) {
    $(target).css("filter", newFilter + " hue-rotate(" + (Math.random()-0.5) + "turn)");
  } else if (stage == 3) {
    $(target).css("filter", newFilter + " hue-rotate(" + (Math.random()-0.5)*2 + "turn)");
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
  var newTransform = partiallyRemoveProperty(target, "transform", "skew");
  if (stage == 1) {
    $(target).css(newTransform + " skew(" + (Math.random()*20-10) + "deg, " + (Math.random()*20-10) + "deg)");
  } else if (stage == 2) {
    $(target).css(newTransform + " skew(" + (Math.random()*90-45) + "deg, " + (Math.random()*90-45) + "deg)");
  } else if (stage == 3) {
    $(target).css(newTransform + " skew(" + (Math.random()*180-90) + "deg, " + (Math.random()*180-90) + "deg)");
  }
}

function runEffect_rituals(target) {
  
}


// Returns a string representing the value of a given property following the removal of a single CSS function from its value
// object: a string representing the element to apply this function to.
// property: the CSS property to be changed.
// cssFunction: the CSS funcion to be removed.
// for example, to get rid of the blur CSS function from the filter property of all divs with class "draggable", do the following:
// partiallyRemoveProperty("div.draggable", "filter", "blur");
function partiallyRemoveProperty(object, property, cssFunction) {
    var propertyValue = $(object).css(property);
    var newValue = "";
    if (propertyValue != null && propertyValue.includes(cssFunction)) {
        var splitValue = propertyValue.split(cssFunction);
        var firstPart = splitValue[0];
        var secondPart =splitValue[1].split(")")[1];
        newValue = firstPart + secondPart;
    } else if (propertyValue != null) {
        return propertyValue;
    }
    return newValue;
}
