var tests = new Array();

// Visual UI stuff, and then run the first test.
$(window).ready(function() {
  adjust_content_pane_height();
  tests[] = new DiagnosticsTest();
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
  if(test_object.testWebRTCReadiness()) {
    // Continue with the test if we're in a WebRTC-enabled browser
    // Find webcams
    test_object.findWebcams();
    // Find microphones
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
