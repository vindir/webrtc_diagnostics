var tests = new Array();

// Visual UI stuff, and then run the first test.
$(window).ready(function() {
  // Allow the bootstrap tabs to be activated via JS
  $('.nav.nav-tabs a').tab();
  // Make sure the main content pane is tall enough
  adjust_content_pane_height();
  // Create a new initial test instance
  tests.push(new DiagnosticsTest());
  // Run the new initial test instance
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
  document.addEventListener('error_event', function() {
    $('.test-messages').append(test_object.displayMessage(test_object.errors[test_object.errors.length - 1], 'error'));
  }, false);
  document.addEventListener('passing_event', function() {
    $('.test-messages').append(test_object.displayMessage(test_object.passing[test_object.passing.length - 1], 'passing'));
  }, false);
  document.addEventListener('webcam_access', function() {
    // Now that we've accessed the webcam, switch to the local tab for video display.
    $('a[href=#local]').tab('show');
  })

  if(test_object.testWebRTCReadiness()) {
    // Continue with the test if we're in a WebRTC-enabled browser
    // Find webcam
    if (test_object.getWebcam()) {
      $('.webcam-test-message').append(test_object.displayMessage('Attempting to display webcam...', 'warning'));
      test_object.testWebcamLocal($('.test-webcam'));
    }
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
