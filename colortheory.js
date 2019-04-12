function isDarkColor(hue, sat, lgh) {
  // determines cut-offs for whether a theme is dark or bright at every 60 degrees of hue
  // these values can be changed but the arrays must be the same length and have at least 2 values
  var colorStops = [0, 60, 120, 180, 240, 300, 360]; // must be between 0 and 360
  var maxLghVals = [55, 40, 45, 40, 65, 50, 65]; // must be between 0 and 100
  var maxLghValAtZeroSaturation = 60; // must be between 0 and 100
  
  // sets starting values, to be changed following calculation
  var maxLgh = 50;
  var distanceFromPrev = 0;
  var distanceFromNext = 60;
  var i;
  var leng = colorStops.length;
  
  // determines which interval of hues the given color falls within
  for (i = 1; i < leng; i++) {
    // checks if the color is within the current hue range
    if (hue <= colorStops[i]) {
      // calculates how far the color is from the hue at the start of the interval
      distanceFromPrev = hue - colorStops[i-1];
      // calculates how far the color is from the hue at the end of the interval
      distanceFromNext = colorStops[i] - hue;
      // calculates a max lightness, weighted for the hues that the current color is closest to
      maxLgh = ((distanceFromPrev * maxLghVals[i-1]) + (distanceFromNext * maxLghVals[i-1]))/(distanceFromPrev + distanceFromNext);
    }
  }
  // recalculates max lightness, weighted for saturation
  // if saturation is 0, max lightness will be the same as maxLghValAtZeroSaturation
  // if saturation is 100, max lightness will not change from previous calculation
  maxLgh = (((100 - sat) * maxLghValAtZeroSaturation) + (sat * maxLgh))/100;
  
  // if the lightness of the current color is less than or equal to the calculated cut-off, the color is considered dark
  if (lgh <= maxLgh) {
    return true;
  } else {
    return false;
  }
}
