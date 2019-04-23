var stage = 0;  // keeps track of the current stage: values 0-4 where stage 1-3 are the interactive stages
var currentURL; // the current page URL

$(document).ready(function() {
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
      console.log("touchstart triggered by window");
      if (e.type === "touchstart") {
          prevX = e.originalEvent.touches[0].pageX;
          prevY = e.originalEvent.touches[0].pageY;
      } else {
          prevX = e.pageX;
          prevY = e.pageY;
      }
      $(window).on('mouseup touchend', function(e) {
        console.log("touchend triggered by window");
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
});


function determineStage() {
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
}


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
}
