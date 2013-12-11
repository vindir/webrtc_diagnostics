var tests = new Array();

// Visual UI stuff, and then run the first test.
$(window).ready(function() {
  adjust_content_pane_height();
  tests.push(new DiagnosticsTest());
  runDiagnosticsTest(tests[tests.length - 1]);
});

$(window).resize(function() {
  adjust_content_pane_height();
});

//Adjust height of elements on the page.
function adjust_content_pane_height() {
  var page_height = $(window).height();
  var content_position = $('.tab-content').position();
  $('.tab-content').height(page_height - content_position.top - 20);
}

function runDiagnosticsTest(test_object) {
  document.addEventListener('error_event', function(e) {
    $('.test-messages').append(test_object.displayMessage(test_object.errors[test_object.errors.length - 1], 'error'));
  }, false);
  document.addEventListener('passing_event', function(e) {
    $('.test-messages').append(test_object.displayMessage(test_object.passing[test_object.passing.length - 1], 'passing'));
  }, false);
  if(test_object.testWebRTCReadiness()) {
    // Continue with the test if we're in a WebRTC-enabled browser
    // Find webcam
    test_object.getWebcam();
    // Find microphone
    test_object.getMicrophone();
    // Access webcams
    // Access microphones
    // List out devices
    // Run through all webcams, and get user feedback as to if they can see them
    // Run through all microphones, and get user feedback as to if they can hear themselves
    // Attempt to connect to remote client
    // Give feedback on what type of route was taken
  }
  // Finish the test and post results
  test_object.finishTest();
}
