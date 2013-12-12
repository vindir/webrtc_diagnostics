var error_event = new Event('error_event');
var passing_event = new Event('passing_event');
var warning_event = new Event('warning_event');

var webcam_access = new Event('webcam_access');

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; // So we don't have to keep checking for vendor prefixes.

function DiagnosticsTest() {
  this.webcams = null; // Should hold an array of webcam names
  this.webcamError = false; // Should we care about how many webcam failures there are, or should we just stop at the first?
  this.webcamStream = null; // Hold the webcam stream here
  this.microphones = null; // Should hold an array of microphone names
  this.microphoneError = false;
  this.microphoneStream = null;
  this.errors = new Array(); // Should be an array of errors
  this.warnings = new Array(); // Should be an array of warnings
  this.passing = new Array(); // Should be an array of passing messages
}

DiagnosticsTest.prototype.testWebRTCReadiness = function() {
  if (!!getUserMedia) {
    this.passing.push("Using a WebRTC-enabled browser.");
    document.dispatchEvent(passing_event);
  } else {
    this.errors.push("Not using a WebRTC-enabled browser.");
    document.dispatchEvent(erorr_event);
  }
  return !!getUserMedia;
}

/*
   findWebcams and findMicrophones can be implmented once
   navigator.getMediaDevices() is available and ready.

   They would find, count, and list all available devices for testing.
*/

// This is all we have to play with for now.
DiagnosticsTest.prototype.getWebcam = function() {
  var scope = this;
  var constraints = { video: true };
  getUserMedia.call(navigator, constraints, function(stream) {
      // Success
      scope.webcamStream = stream;
      scope.passing.push("Webcam reached: " + scope.webcamLiveLabel());
      document.dispatchEvent(webcam_access);
      return true;
  }, function() {
    // Failure
    scope.errors.push("Unable to reach a webcam. Did you allow access? Is there one plugged in? Is it enabled?");
    document.dispatchEvent(error_event);
    return false;
  });
}

// This is all we have to play with for now.
DiagnosticsTest.prototype.getMicrophone = function() {
  var scope = this;
  var constraints = { audio: true };
  getUserMedia.call(navigator, constraints, function(stream) {
    // Success
    scope.microphoneStream = stream;
    scope.passing.push("Able to reach a microphone.");
    document.dispatchEvent(passing_event);
    return true;
  }, function() {
    // Failure
    scope.errors.push("Unable to reach a microphone. Did you allow access? Is there one plugged in? Is it enabled?");
    document.dispatchEvent(error_event);
    return false;
  });
}

DiagnosticsTest.prototype.testWebcamLocal = function(display_element) {
  video_element = $('video.test-webcam');
  // Attempt to display the webcam feed locally. If not, store an error.
  video_element.src = window.URL.createObjectURL(this.webcamStream);
  video_element.play();
  // Attempt to echo the webcam feed back to ourselves via WebRTC, and ask if the user can see it. If not, store an error.
  // this.echoWebcam(webcam_stream, echo_element);
}

DiagnosticsTest.prototype.testWebcamEcho = function(display_element) {
  // Attempt to echo the webcam stream back to ourselves locally. If not, store an error.
}

// Return a microphone element that changes based on the volume.
DiagnosticsTest.prototype.testMicrophone = function(microphone) {
  // Display a feedback bar
  $('');
  // Attempt to echo the microphone audio back to the user
  // Ask user if they can hear themselves
}

DiagnosticsTest.prototype.echoWebcam = function(webcam, echo_element) {
  // Attempt to use WebRTC to echo back locally to ourselves
  // Ask if user can see the echoed back feed
  // If error, put meaningful and human-readable error message in this.errors
}

DiagnosticsTest.prototype.displayMicrophone = function(microphone, display_element) {
  // Attempt to get feedback on microphone and display it as an indicator bar
  // Store the microphone element in the microphone object
  this.microphones.microphone += { display: new MicrophoneFeedbackBar() }
  // If error, put meaningful and human-readable error message in this.errors
}

DiagnosticsTest.prototype.finishTest = function() {
  // Summarize results
  // Generate score
  // Send results back to Mojo Lingo so we can display them like how iswebrtcreadyyet.com does because that's SO COOL (and so are we!)
}

// Will return an HTML element with the message formatted for display properly.
// type wants a string of 'passing', 'error', or 'warning'
DiagnosticsTest.prototype.displayMessage = function(message, type) {
  var div_class = "message " + type;
  var html = "<div class='" + div_class + "'><p>" + message + "</p></div>";
  return html;
}

DiagnosticsTest.prototype.webcamLiveLabel = function() {
  // Go through each object and make sure we grab and return the live feed only.
  for (var i = 0; i < this.webcamStream.length - 1; i++) {
    if (this.webcamStream[i].readyState == 'live') {
      return this.webcamStream[i].label;
    }
  }
}

// Will create a feedback display bar. You must insert it somewhere.
function MicrophoneFeedbackBar() {
  this.level = 0; // Will hold percentage of volume.
  this.noiseColor = '#149bdf';
  this.element = "<div class='microphone-wrapper'><div class='microphone-volume' style='background-color:" + this.noiseColor + ";'></div></div>";
  return this.element;
}

MicrophoneFeedbackBar.prototype.changeLevel = function(percentage) {
  if (percentage < 100) {
    percentage = percentage * 100;
  }
  this.level = percentage;
  $(this.element).css({ width: this.level + "%" });
}

MicrophoneFeedbackBar.prototype.color = function(hex_color) {
  this.color = hex_color;
  $(this.element).css({ color: this.color });
}

