var tests = new Array();
var passing = 0;

// Visual UI stuff, and then run the first test.
$(window).ready(function() {
  // Allow the bootstrap tabs to be activated via JS
  $('.nav.nav-tabs a').tab();
  // Make sure the main content pane is tall enough
  adjust_content_pane_height();
  // Make sure our checklist is size and positioned properly
  adjust_test_checklist_size();
  // Create a new initial test instance
  tests.push(new DiagnosticsTest());
  // Run the new initial test instance
  runDiagnosticsTest(tests[tests.length - 1]);
});

$(window).resize(function() {
  adjust_content_pane_height();
  adjust_test_checklist_size();
});

//Adjust height of elements on the page.
function adjust_content_pane_height() {
  var page_height = $(window).height();
  var content_position = $('.tab-content').position();
  $('.tab-content').height(page_height - content_position.top - 20);
}

function adjust_test_checklist_size() {
  var tab_height = $('.nav.nav-tabs').outerHeight(true)
  var tab_position = $('.nav.nav-tabs').position();

  var calc_height = $('.tab-content').outerHeight() - tab_height - 20; // Subtract double the padding
  var calc_width = $('.nav.nav-tabs').width() - 20; // Subtract double the padding
  var calc_top = tab_position.top + tab_height;
  $('#test-checklist').css({ height: calc_height + 'px', width: calc_width + 'px', top: calc_top, left: tab_position.left });
}

function increase_passing() {
  passing++;
  $('#test-checklist .score .passing').html(passing);
}

function runDiagnosticsTest(test_object) {
  document.addEventListener('error_event', function() {
    $('#logs .messages').append(test_object.displayMessage(test_object.errors[test_object.errors.length - 1], 'error'));
  }, false);

  document.addEventListener('passing_event', function() {
    $('#logs .messages').append(test_object.displayMessage(test_object.passing[test_object.passing.length - 1], 'passing'));
    increase_passing();
  }, false);

  document.addEventListener('webrtc_checking', function() {
    $('#test-checklist .webrtc').addClass('checking').removeClass('waiting');
  });

  document.addEventListener('webrtc_pass', function () {
    $('#test-checklist .webrtc').addClass('passed').removeClass('checking');
  })

  document.addEventListener('webrtc_fail', function() {
    $('#test-checklist .webrtc').addClass('failed').removeClass('checking');
  });

  document.addEventListener('webcam_checking', function() {
    $('#test-checklist .webcam').addClass('checking').removeClass('waiting');
  });

  document.addEventListener('webcam_pass', function() {
    // Now that we've accessed the webcam, switch to the local tab for video display.
    $('.test-local-webcam-message').append(test_object.displayMessage('Attempting to display webcam ' + test_object.webcamLiveLabel() + '.', 'warning'));
    test_object.testWebcamLocal($('#local-webcam'));
    $('a[href=#local]').tab('show');
    test_object.videoCheck($('video#local-webcam'));
    $('#test-checklist .webcam').removeClass('checking').addClass('passed');
  });

  document.addEventListener('webcam_fail', function () {
    $('#test-checklist .webcam').removeClass('checking').addClass('failed');
  });

  document.addEventListener('microphone_checking', function() {
    $('#test-checklist .microphone').addClass('checking').removeClass('waiting');
  });

  document.addEventListener('microphone_pass', function() {
    $('#test-checklist .microphone').addClass('passed').removeClass('checking');
  });

  document.addEventListener('microphone_fail', function() {
    $('#test-checklist .microphone').addClass('failed').removeClass('checking');
  });

  document.addEventListener('local_video_stream_checking', function() {
    $('#test-checklist .webcam-playback').addClass('checking').removeClass('waiting');
  });

  document.addEventListener('local_video_stream_pass', function() {
    $('a[href=#overall]').tab('show');
    $('#local .span12').addClass('span9').removeClass('span12');
    $('#local .span9').after('<div class="span3"></div>');
    $('#local .span3').append('<canvas id="local-webcam-canvas"></canvas><p>' + test_object.webcamLiveLabel() + '</p><img class="local-webcam-image" />');
    // and then take a picture of the camera, stop the stream, and remove the buttons
    test_object.pictureWebcamLocal(null);
    $('#test-checklist .webcam-playback').addClass('passed').removeClass('checking');
  });

  document.addEventListener('local_video_stream_end', function() {
    $('a[href=#overall]').tab('show');
    // Remove buttons
    $('.video-check-wrapper').remove();
    // Hide local video element and message
    $('video#local-webcam').hide();
    $('.test-local-webcam-message').hide();
  });

  document.addEventListener('local_video_stream_fail', function() {
    $('#test-checklist .webcam-playback').addClass('failed').removeClass('checking');
    // stop the stream and remove the buttons
  });

  if(test_object.testWebRTCReadiness()) {
    // Continue with the test if we're in a WebRTC-enabled browser
    // Find webcam and show it
    test_object.getWebcam();
    // testWebcamLocal is ran in the event listner that's thrown once the webcam stream is allowed.
    // Find microphone and show it
    test_object.getMicrophone();
    // Attempt to connect to remote client
    // Give feedback on what type of route was taken
  }
  // Finish the test and post results
  test_object.finishTest();
}
