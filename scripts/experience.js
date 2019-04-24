// Global variables
var stage = 0;  // keeps track of the current stage: values 0-4 where stage 1-3 are the interactive stages
var currentURL; // the current page URL
var lastScrollTime = 0; // the time of last scroll (in milliseconds) to prevent over-scrolling.
var dragging = false;   // whether or not a draggable item is being dragged
var prevX;
var prevY;
var intervals = [];

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
        // loads the experience and then moves to the current stage.
        loadPerspective(perspID);
        goToStage(stage);
    } else {
        // if no ID is provided, get the ID of the most recent experience added to the gallery
        var dataRef = firebase.database().ref('perspectives/visible/').orderByChild('timestamp').limitToFirst(1);
        dataRef.on('child_added', function(data) {
            perspID = data.key;
            dataRef.off();
            currentURL = currentURL + "?id=" + perspID + "+";
            visibleInGallery = "visible";
            loadPerspective(perspID);
            goToStage(stage);
        });
    }
}

// loads all the data from the database and applies it to the page
// requires the ID of the experience that is to be loaded
function loadPerspective(perspID) {
    // calls the reference of the experience, based on its position in the database
    firebase.database().ref('perspectives/' + visibleInGallery + '/' + perspID).once('value').then(function(snapshot) {
        // sets global variables using the respective data in the database
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
        
        // increments the "views" value in the database for the loaded experience.
        var newViews = Number(views + 1);
        if (perspID != "") {
            firebase.database().ref('perspectives/' + visibleInGallery + '/' + perspID).child('views').set(newViews);
        }
        
        // sets the background color using the hue, saturation and lightness in the database
        setBackgroundColor(hue, sat, lgh);
        
        // finds the complementary color
        var compColor = getComplementaryColor(hue, sat, lgh);
        compHue = compColor[0];
        compSat = compColor[1];
        compLgh = compColor[2];
        
        // sets the background gradient for each stage, such that the gradient is smooth across all stages.
        $("div.stage:nth-child(odd)").css("background-image", "radial-gradient(at bottom right, hsl(" + compHue + ", " + compSat + "%, " + compLgh + "%), hsl(" + hue + ", " + sat + "%, " + lgh + "%))");
        $("div.stage:nth-child(even)").css("background-image", "radial-gradient(at top right, hsl(" + compHue + ", " + compSat + "%, " + compLgh + "%), hsl(" + hue + ", " + sat + "%, " + lgh + "%))");
        
        // sets the text for the title, description, views and back button text on the page
        $("title").html("Color Me " + title + " by " + creator);
        $("div.textbox").html(description);
        $("#viewCounter").html(newViews);
        $("#backButton").html(backButton);
        
        // removes the page cover once the experience has fully loaded
        $("#pageCover").css("opacity", "0");
        $("#pageCover").css("height", "0");
    });
}

// all functions to trigger after the page is loaded
// this is not after the experience has loaded but once all HTML elements have rendered behind the page cover
$(document).ready(function() {
    
  var randomNum = Math.random();
  var randHue = Math.round(randomNum * 360);
  var randSat = Math.round(Math.random()*80 + 10);
  var randLgh = Math.round(Math.random()*60 + 20);
  setBackgroundColor(randHue, randSat, randLgh);
    
  // sets up the page by working out the experience to load, loading it and navigating to the required stage
  determinePerspective();
  
  // sets click events for all next buttons
  // when a next button in a given stage is clicked, you are navigated to the next stage
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
  
  // sets function for when a draggable element is first touched
  // to make an element draggable, give it the "draggable" class
  $(".draggable").on("mousedown touchstart", function(e) {
    e.preventDefault();
    dragging = true;
    // set the element transition property
    // this makes the effect smooth, rather than immediate
    $(this).css("transition", "2s");
    // ensure that the transition only applies to relevant properties
    // if "top" and "left" property are listed here, the drag will be very slow
    $(this).css("transition-property", "filter, opacity, transform");
    
    // determines which effects are used in the given experience and applies them to the element
    compileEffects(this);
    
    if (e.type === "touchstart") {
        prevX = e.originalEvent.touches[0].pageX;
        prevY = e.originalEvent.touches[0].pageY;
    } else {
        // calculates the mouse/touch x and y positions
        prevX = e.pageX;
        prevY = e.pageY;
    }
    
    // this line is required so that the draggable element can be selected in the following touch event
    var target = this;
    
    // sets function for when a drag occurs
    $(window).on("mousemove touchmove", function(e) {
        // prevents default event functions
        e.preventDefault();
        
        // calculates the current x and y positions of the mouse/finger
        if (e.type === "touchmove") {
            var thisX = e.originalEvent.changedTouches[0].pageX;
            var thisY = e.originalEvent.changedTouches[0].pageY;
            var x = $(target).offset().left + (thisX - prevX);
            var y = $(target).offset().top + (thisY - prevY);
        } else {
            var x = $(target).offset().left + (e.pageX - prevX);
            var y = $(target).offset().top + (e.pageY - prevY);
        }
        
        // sets the draggable element to be at the new position
        $(target).offset({top: y, left: x});
        
        // sets the z-index to be the same as the offset from the top
        // this ensures that the draggable elements further down the page appear to be in front of those further up
        $(target).css("z-index", Math.round((y+$(target).height())));
        
        // updates the previous x and y values
        // needed for the next time this function is called
        if (e.type === "touchmove") {
            prevX = e.originalEvent.changedTouches[0].pageX;
            prevY = e.originalEvent.changedTouches[0].pageY;
        } else {
            // calculates the mouse/touch x and y positions
            prevX = e.pageX;
            prevY = e.pageY;
        }
    });
    
    // sets function for when the drag ends/finger is lifted
    $(window).on("mouseup touchend", function(e) {
      // sets css properties to none
      if (stage != 3) {
        $(target).css("filter", "");
        $(target).css("transform", "");
        $(target).css("opacity", "");
        $("body").css("filter", "");
      }
      
      // detaches the drag functions from this element
      // if these lines are not used, the next touch will be treated as a continuation of the previous drag
      $(window).off("mousemove touchmove");
      $(window).off("mouseup touchend");
    });
  });
  
  // sets functions for when the navigation dots are clicked
  $(".navMarker").click(function() {
    // checks if the dot is NOT a link to the current stage (i.e. is inactive)
    // if dot is already active, do not do anything as the stage has already been navigated to
    if ($(this).hasClass("markerInactive")) {
      // gets the respective stage number from the navigation marker's ID.
      var stageNav = $(this).attr("id").split("-")[1];
      // navigates to the given stage
      goToStage(stageNav);
    }
  });
  
  // sets functions for when the mouse wheel is scrolled (doesn't work in Firefox)
  $(window).on('mousewheel', function(e) {
    var scrollAmt = e.originalEvent.wheelDelta;
    var iterations = 1;
    // if scrolling up and not already at the first stage, go to the previous stage
    // the current time must be 0.5s before the last time this event was triggered, to prevent scrolling through too many stages
    if (scrollAmt > 50 && stage > 0 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      if ((stage - iterations) < 0) {
        goToStage(0);
      } else {
        goToStage(stage - iterations);
      }
    }
    // if scrolling down and not already at the last stage, go to the next stage
    // the current time must be 0.5s before the last time this event was triggered, to prevent scrolling through too many stages
    else if (scrollAmt < -50 && stage < 4 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      if ((stage + iterations) > 4) {
        goToStage(4);
      } else {
        goToStage(stage + iterations);
      }
    }
  });
    
  // sets functions for when the mouse wheel is scrolled in Firefox
  $(window).on('DOMMouseScroll', function(e) {
    // if scrolling up and not already at the first stage, go to the previous stage
    // the current time must be 0.5s before the last time this event was triggered, to prevent scrolling through too many stages
    if (e.originalEvent.detail < 0 && stage > 0 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      goToStage(stage - 1);
    }
    // if scrolling down and not already at the last stage, go to the next stage
    // the current time must be 0.5s before the last time this event was triggered, to prevent scrolling through too many stages
    else if (e.originalEvent.detail > 0 && stage < 4 && Date.now() > lastScrollTime + 500) {
      lastScrollTime = Date.now();
      goToStage(stage + 1);
    }
  });
  
  $(window).on('mousedown touchstart', function(e) {
      if (e.type === "touchstart") {
          prevX = e.originalEvent.touches[0].pageX;
          prevY = e.originalEvent.touches[0].pageY;
      } else {
          prevX = e.pageX;
          prevY = e.pageY;
      }
      $(window).on('mouseup touchend', function(e) {
        if (e.type === "touchend") {
            var x = e.originalEvent.changedTouches[0].pageX - prevX;
            var y = e.originalEvent.changedTouches[0].pageY - prevY;
        } else {
            var x = e.pageX - prevX;
            var y = e.pageY - prevY;
        }
        if (!dragging && Math.abs(x) < Math.abs(y) && Date.now() > lastScrollTime + 500) {
            if (y < 50) {
                var targetStage = stage + 1;
                if (targetStage > 4) {
                    targetStage = 4;
                }
                goToStage(targetStage);
            } else if (y > 50) {
                var targetStage = stage - 1;
                if (targetStage < 0) {
                    targetStage = 0;
                }
                goToStage(targetStage);
            }
        }
        lastScrollTime = Date.now();
        dragging = false;
        $(window).off("mouseup touchend");
      });
      
  });
  
  // HOW TO MAKE SCROLL EVENT WORK ON MOBILE??
  
});

// navigates to the given stage
// takes stage number as input (from 0-4)
function goToStage(stageNo) {
  // sets global stage variable to the new stage number
  stage = stageNo;
  
  // sets the URL to correspond with the new stage number
  window.history.pushState("object or string", "Stage " + stageNo, currentURL + "&stage=" + stageNo);
  
  // sets all the navigation markers to be inactive
  // then sets only the navigation marker for the given stage to be active
  $(".navMarker.markerActive").removeClass("markerActive").addClass("markerInactive");
  $("#navMarker-" + stageNo).removeClass("markerInactive").addClass("markerActive");
    
  // loops through all the stage numbers
  // moves each stage above or below the view port based on its 
  var i;
  for (i = 0; i < 5; i++) {
    if (i == stageNo) {
      $("#stage_" + i).css("top", 0);
    } else {
      $("#stage_" + i).css("top", (100*(i-stageNo)) + "vh");
    }
  }
  $(".stage").css("transition", "0.5s ease-in-out");
  browserCompatibleCSS(".draggable", "filter", "");
  browserCompatibleCSS(".draggable", "transform", "");
  $(".draggable").css("opacity", "");
  $(".ui").css("transition", "0.2s");
  browserCompatibleCSS(".ui", "filter", "");
  intervals.forEach(clearInterval);
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
    if (stage == 2) {
        compileEffectsAtRandom(target);
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
  var prevOpacity = $(target).css("opacity");
  if (stage == 1) {
    $(target).css("opacity", prevOpacity - 0.1);
  } else if (stage == 2) {
    $(target).css("opacity", Math.random());
  } else if (stage == 3) {
    $(target).css("opacity", prevOpacity / 2);
  }
}

function runEffect_blurring(target) {
  var currentBlurValue = getPartialPropertyValue(target, "filter", "blur");
  if (currentBlurValue == "none") {
      currentBlurValue = 0;
  } else {
      currentBlurValue = Number(currentBlurValue.split("px")[0]);
  }
  var newFilter = partiallyRemoveProperty(target, "filter", "blur");
  if (stage == 1) {
    browserCompatibleCSS(target, "filter", newFilter + " blur(" + Number(currentBlurValue + 1) + "px)");
  } else if (stage == 2) {
    browserCompatibleCSS(target, "filter", newFilter + " blur(" + Number(Math.random()*20) + "px)");
  } else if (stage == 3) {
    browserCompatibleCSS(target, "filter", newFilter + " blur(" + Number(currentBlurValue + 5) + "px)");
    $(".ui").css("transition", "filter 20s");
    browserCompatibleCSS(".ui", "filter", "blur(5px)");
    browserCompatibleCSS("header", "filter", "");
  }
}

function runEffect_colorLoss(target) {
  var newFilter = partiallyRemoveProperty("body", "filter", "grayscale");
  $("body").css("transition", "filter 2s");
  var currentOpacity = $(target).css("opacity");
  if (stage == 1) {
    browserCompatibleCSS("body", "filter", newFilter + " saturate(80%)");
    $(target).css("opacity", currentOpacity - 0.05);
  } else if (stage == 2) {
    browserCompatibleCSS("body", "filter", newFilter + " saturate(40%)");
    $(target).css("opacity", currentOpacity - 0.1);
  } else if (stage == 3) {
    browserCompatibleCSS("body", "filter", newFilter + " saturate(0%)");
    $(target).css("opacity", currentOpacity - 0.1);
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
      $(window).off("mousemove touchmove");
      $(window).off("mouseup touchup");
    }
  } else if (stage == 3) {
    $(target).css("transition-property", $(target).css("transition-property") + ", top, left");
    if (Math.random() < 0.8) {
      $(target).css("filter", "");
      $(target).css("transform", "");
      $(target).css("opacity", "");
      $(window).off("mousemove touchmove");
      $(window).off("mouseup touchup");
    }
  }
}

function runEffect_distortion(target) {
  var previousSkew = 0;
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
    if (propertyValue != "none" && propertyValue.includes(cssFunction)) {
        var splitValue = propertyValue.split(cssFunction);
        var firstPart = splitValue[0];
        var secondPart =splitValue[1].split(")")[1];
        newValue = firstPart + secondPart;
    } else if (propertyValue != "none") {
        return propertyValue;
    }
    return newValue;
}

function getPartialPropertyValue(object, property, cssFunction) {
    var propertyValue = $(object).css(property);
    if (propertyValue != "none" && propertyValue.includes(cssFunction)) {
        propertyValue = propertyValue.split(cssFunction + "(")[1].split(")")[0];
        return propertyValue;
    } else {
        return "none";
    }
}

function compileEffectsAtRandom(target) {
    var newInterval = setInterval(function() {
        if (Math.random() < 0.02) {
            compileEffects(target);
        }
    }, 100);
    intervals.push(newInterval);
}

function browserCompatibleCSS(object, property, value) {
    $(object).css(property, value);
    $(object).css("-webkit-" + property, value);
    $(object).css("-moz-" + property, value);
    $(object).css("-ms-" + property, value);
    $(object).css("-o-" + property, value);
}
