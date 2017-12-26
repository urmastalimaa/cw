;(function () {

	'use strict';

	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

  var rsvpSubmissionKey = 'rsvp_submitted';

  function disableRsvpForm() {
    $("#rsvp-form button[type='submit']").hide();
    $("#rsvp-form select,input,textarea").prop('disabled', true);
  }

  function disableRsvpClear() {
    $("#rsvp-form button#clear").hide();
  }

  function enableRsvpClear() {
    $("#rsvp-form button#clear").show();
  }

  function clearRsvp() {
    disableRsvpClear();
    $("#rsvp-form button[type='submit']").show();
    $("#rsvp-form select,input,textarea").prop('disabled', false);
  }

  function gatherChoices(containerSelector) {
    return $(containerSelector)
      .find("input")
      .filter(function(_index, input) { return $(input).is(":checked") })
      .map(function(_index, input) { return input.name })
      .toArray()
  }

  function gatherFormData() {
    var $target = $("#rsvp-form");
    return {
      Name: $target.find("#inputName").val(),
      Participation: $target.find("#inputParticipation option:selected").text(),
      Transportation: $target.find("#inputTransportation option:selected").text(),
      MainCourse: gatherChoices("#mainCourseChoices")
    };
  }


  function onRsvpSuccess() {
    localStorage[rsvpSubmissionKey] = "true";
    $("#formResult")
      .removeClass("alert-danger")
      .addClass("alert-success")
      .text("Thank you, please submit again if responding for another Person")
      .show()
      .delay(3000)
      .fadeOut('fast');
  }

  function onRsvpFail() {
    $("#formResult")
      .removeClass("alert-success")
      .addClass("alert-danger")
      .text("There was an error with sending the RSVP. Please try again later.")
      .show();
  }

  function setupForm() {
    if (localStorage[rsvpSubmissionKey] === "true") {
      $("#registrationQuery")
        .text("RSVP successfully sent")
        .addClass("alert-success");
      $('button#clear').on('click', function(event) {
        localStorage[rsvpSubmissionKey] = "false";
        clearRsvp();
      });
    } else {
      disableRsvpClear();
    }

    $("#rsvp-form").validator().on('submit', function(event){
      // Silly obfuscation
      var baseURL = atob("aHR0cHM6Ly82MXZzdDh6c3BpLmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL3Byb2Q=")
      var formTargetURL = baseURL + "/rsvp";
      if (!event.isDefaultPrevented()) {
        event.preventDefault();

        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: formTargetURL,
          data: JSON.stringify(gatherFormData()),
          crossDomain: true,
          dataType: 'json'
        }).then(onRsvpSuccess, onRsvpFail);
      }
    });
  }

  function setupFullDesc() {
    $("button.read-toggle").on('click', function(event) {
      $(event.target).parents(".couple-description").toggleClass("expanded");
      $(event.target).parents("#couple-about-each-other").toggleClass("expanded");
      $(event.target).parents(".text")[0].scrollIntoView();
    });
  }

	$(function(){
		loaderPage();
    setupForm();
    setupFullDesc();
	});

}());
