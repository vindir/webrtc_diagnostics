var error_event = new Event('error_event');
var passing_event = new Event('passing_event');
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; // So we don't have to keep checking for vendor prefixes.

function DiagnosticsTest() {
  this.webcams = null; // Should hold an array of webcam names
  this.webcamError = false; // Should we care about how many webcam failures there are, or should we just stop at the first?
  this.microphones = null; // Should hold an array of microphone names
  this.microphoneError = false;
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
   findWebcams and findMicrophones would be much better suited to using
   navigator.getMediaDevices() as soon as it is available and ready.
*/

DiagnosticsTest.prototype.findWebcams = function() {
  // Find all connected and accessible webcams and store them in this.webcams
  // If none are found, put a meaningful and human-readable error message in this.errors
}

DiagnosticsTest.prototype.findMicrophones = function() {
  // Find all connected and accessible microphones and store them in this.microphones
  // If none are found, but a meaningful and human-readable error message in this.errors
}

// This is all we have to play with for now.
DiagnosticsTest.prototype.getWebcam = function() {
  var constraints = { video: true };
  getUserMedia.call(navigator, constraints, function(stream) {
    // Success
    this.passing.push("Able to reach a webcam.");
    document.dispatchEvent(passing_event);
    this.testWebcam(stream);
  }, function() {
    // Failure
    this.errors.push("Unable to reach a webcam. Is there one plugged in? Is it enabled?");
    document.dispatchEvent(error_event);
  });
}

// This is all we have to play with for now.
DiagnosticsTest.prototype.getMicrophone = function() {
  var constraints = { audio: true };
  getUserMedia(constraints, function(stream) {
    // Success
    this.testMicrophone(stream);
  }, function() {
    // Failure
    this.errors.push("Unable to reach a microphone. Is there one plugged in? Is it enabled?");
    document.dispatchEvent(error_event);
  });
}

DiagnosticsTest.prototype.webcamCount = function() {
  return this.webcams.length;
}

DiagnosticsTest.prototype.webcamNames = function() {
  return Object.keys(this.webcams);
}

DiagnosticsTest.prototype.microphoneCount = function() {
  return this.microphones.length;
}

DiagnosticsTest.prototype.microphoneNames = function() {
  return Object.keys(this.microphones);
}

DiagnosticsTest.prototype.testWebcam = function(webcam, display_element, echo_element) {
  // Attempt to access the webcam. If not, store an error.
  this.accessWebcam(webcam);
  // Attempt to displaya the webcam feed locally. If not, store an error.
  this.displayWebcam(webcam, display_element);
  // Attempt to echo the webcam feed back to ourselves via WebRTC, and ask if the user can see it. If not, store an error.
  this.echoWebcam(webcam, echo_element);
}

DiagnosticsTest.prototype.testWebcams = function(display_element) {
  for (webcam in this.webcams) {
    this.testWebcam(webcam, display_element);
  }
}

DiagnosticsTest.prototype.testMicrophone = function(microphone) {
  // Access microphone
  // Display a feedback bar
  // Attempt to echo the microphone audio back to the user
  // Ask user if they can hear themselves
}

DiagnosticsTest.prototype.accessWebcam = function(webcam) {
  // Attempt to access webcam
  // If error, put meaningful and human-readable error message in this.errors
}

DiagnosticsTest.prototype.displayWebcam = function(webcam, display_element) {
  // Attempt to display the webcam feed localling in specified display_element
  // If error, put meaningful and human-readable error message in this.errors
}

DiagnosticsTest.prototype.echoWebcam = function(webcam, echo_element) {
  // Attempt to use WebRTC to echo back locally to ourselves
  // Ask if user can see the echoed back feed
  // If error, put meaningful and human-readable error message in this.errors
}

DiagnosticsTest.prototype.accessMicrophone = function(microphone) {
  // Attempt to access the microphone
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
  var div_class = "passing " + type;
  var html = "<div class='" + div_class + "'><p>" + message + "</p></div>";
  return html;
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

