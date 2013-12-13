var error_event = new Event('error_event');
var passing_event = new Event('passing_event');
var warning_event = new Event('warning_event');

var webrtc_checking = new Event('webrtc_checking');
var webrtc_pass = new Event('webrtc_pass');
var webrtc_fail = new Event('webrtc_fail');
var webrtc_end = new Event('webrtc_end');

var webcam_checking = new Event('webcam_checking');
var webcam_pass = new Event('webcam_pass');
var webcam_fail = new Event('webcam_fail');
var webcam_end = new Event('webcam_end');

var microphone_checking = new Event('microphone_checking');
var microphone_pass = new Event('microphone_pass');
var microphone_fail = new Event('microphone_fail');
var microphone_end = new Event('microphone_end');

var local_video_stream_checking = new Event('local_video_stream_checking');
var local_video_stream_pass = new Event('local_video_stream_pass');
var local_video_stream_fail = new Event('local_video_stream_fail');
var local_video_stream_end = new Event('local_video_stream_end');

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; // So we don't have to keep checking for vendor prefixes.
var vendorURL = window.URL || window.webkitURL;

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
  document.dispatchEvent(webrtc_checking);
  if (!!getUserMedia) {
    this.passing.push("Using a WebRTC-enabled browser.");
    document.dispatchEvent(passing_event);
    document.dispatchEvent(webrtc_pass);
  } else {
    this.errors.push("Not using a WebRTC-enabled browser.");
    document.dispatchEvent(erorr_event);
    document.dispatchEvent(webrtc_fail);
  }
  document.dispatchEvent(webrtc_end);
  return !!getUserMedia;
}

/*
   findWebcams and findMicrophones can be implmented once
   navigator.getMediaDevices() is available and ready.

   They would find, count, and list all available devices for testing.
*/

// This is all we have to play with for now.
DiagnosticsTest.prototype.getWebcam = function() {
  document.dispatchEvent(webcam_checking);
  var scope = this;
  var result = null;
  var constraints = { video: true };
  getUserMedia.call(navigator, constraints, function(stream) {
    // Success
    scope.webcamStream = stream;
    scope.passing.push("Webcam reached: " + scope.webcamLiveLabel());
    document.dispatchEvent(passing_event);
    document.dispatchEvent(webcam_pass);
    document.dispatchEvent(webcam_end);
    result = true;
  }, function() {
    // Failure
    scope.errors.push("Unable to reach a webcam. Did you allow access? Is there one plugged in? Is it enabled?");
    document.dispatchEvent(error_event);
    document.dispatchEvent(webcam_fail);
    document.dispatchEvent(webcam_end);
    result = false;
  });
  return result;
}

// This is all we have to play with for now.
DiagnosticsTest.prototype.getMicrophone = function() {
  document.dispatchEvent('microphone_checking');
  var scope = this;
  var constraints = { audio: true };
  var result = null;
  getUserMedia.call(navigator, constraints, function(stream) {
    // Success
    scope.microphoneStream = stream;
    scope.passing.push("Able to reach a microphone.");
    document.dispatchEvent(passing_event);
    document.dispatchEvent(microphone_pass);
    document.dispatchEvent(microphone_end);
    result = true;
  }, function() {
    // Failure
    scope.errors.push("Unable to reach a microphone. Did you allow access? Is there one plugged in? Is it enabled?");
    document.dispatchEvent(error_event);
    document.dispatchEvent(microphone_fail);
    document.dispatchEvent(microphone_end);
    result = false;
  });
  return result;
}

DiagnosticsTest.prototype.testWebcamLocal = function(display_element) {
  // var video_source = null;
  // if (vendorURL) {
  //   video_source = vendorURL.createObjectURL(this.webcamStream);
  // } else {
  //   video_source = stream;
  // }
  // display_element.src = video_source;
  document.dispatchEvent(local_video_stream_checking);
  var velem = document.getElementById('local-webcam');
  velem.src = vendorURL.createObjectURL(this.webcamStream);
}

DiagnosticsTest.prototype.pictureWebcamLocal = function(display_element) {
  canvas = document.querySelector('#local-webcam-canvas');
  canvas.width = 640;
  canvas.height = 480;
  canvas.getContext('2d').drawImage(document.querySelector('#local-webcam'), 0, 0, 640, 480);
  var data = canvas.toDataURL('image/png');
  $(canvas).hide();
  document.querySelector('.message-local-webcam-image').setAttribute('src', data);
  document.querySelector('.local-webcam-image').setAttribute('src', data);
}

DiagnosticsTest.prototype.videoCheck = function(display_element) {
  var scope = this;
  var check_wrapper = "<div class='video-check-wrapper'><p>Can you see this video?</p><button class='yes'>yes</button><button class='no'>no</button></div>";
  $('video#local-webcam').after($(check_wrapper));
  $('.video-check-wrapper > button.yes').click(function() {
    scope.passing.push("Video play back works.<img class='message-local-webcam-image' />");
    document.dispatchEvent(passing_event);
    document.dispatchEvent(local_video_stream_pass);
    document.dispatchEvent(local_video_stream_end);
  });
  $('.video-check-wrapper > button.no').click(function() {
    scope.errors.push("Video play back failed.");
    document.dispatchEvent(error_event);
    document.dispatchEvent(local_video_stream_fail);
    document.dispatchEvent(local_video_stream_end);
  });
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
  video_tracks = this.webcamStream.getVideoTracks();
  for (var i = 0; i <= video_tracks.length - 1; i++) {
    if (video_tracks[i].readyState == 'live') {
      return video_tracks[i].label;
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

