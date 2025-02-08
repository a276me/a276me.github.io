// var section = window.location.pathname;
//     if (section == "/projects") {
//       $("#index").addClass("hide");
//       $("#research").addClass("hide");
//       $("#home").addClass("hide");
//       $("#projects").removeClass("hide");
//     }
//     else if (section == "/research") {
//       $("#index").addClass("hide");
//       $("#projects").addClass("hide");
//       $("#home").addClass("hide");
//       $("#research").removeClass("hide");
//     }
//     else if (section == "/home") {
//       $("#index").addClass("hide");
//       $("#research").addClass("hide");
//       $("#projects").addClass("hide");
//       $("#home").removeClass("hide");
//     }

//     // onclick of one of the navigation buttons
//     $( "a[data-hide]" ).on( "click", function() {
//       $(window).scrollTop(0);
//       var toHide = $(this).data("hide");
//       var toShow = "#" + $(this).attr("href");
//       var url = "/" + $(this).attr("href");
//       if (url == "/index") {
//         url = "/";
//       }
//       var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
//       var animationArray = ['zoomOutDown', 'zoomOutUp', 'zoomOutRight', 'zoomOutLeft', 'rollOut', 'slideOutUp', 'rotateOutDownRight', 'rotateOutUpRight', 'lightSpeedOut', 'bounceOutUp', 'rotateOutUpLeft', 'slideOutUp'];
//       var animationName = animationArray[Math.floor(Math.random() * animationArray.length)];
//       // var animationName = "zoomOutDown";

//       $(toShow).removeClass("hide");
//       $(toShow).css("z-index", "0");
//       $(toHide).css("z-index", "9999");
//       window.history.pushState(null, null, url);
//       $(toHide).addClass("animated " + animationName).one(animationEnd, function() {

//         $(toHide).addClass('hide').removeClass("animated " + animationName);

//       });
//       return false;
//     });
//     $('#post').on('show.bs.modal', function (event) {
//       var button = $(event.relatedTarget) // Button that triggered the modal
//       var post = button.data('post')
//       var title = button.data('title')
//       var modal = $(this)
//       modal.find('.modal-title').text(title)
//       modal.find('.modal-body').html(post)
//       $('pre code').each(function(i, block) {
//         hljs.highlightBlock(block);
//       });
//     })
//     $('#send').on('click', function () {
//       var $btn = $(this).button('loading')
//       var name = $("#name").val();
//       var email = $("#email").val();
//       var subject = $("#subject").val();
//       var message = $("#message").val();
//       $.get( "http://timothy.expert/sendmail.php", { name: name, email: email, subject: subject, message: message } )
//         .done(function( data ) {
//           eval(data);
//         });
//       return false;
//     })
//     $(window).on('beforeunload', function() {
//       $(window).scrollTop(0);
//     });

document.addEventListener("DOMContentLoaded", function () {
  function showSection(sectionId) {
      document.querySelectorAll(".section").forEach(section => {
          section.classList.add("hidden");
      });
      document.querySelector(sectionId).classList.remove("hidden");
  }

  function handleNavigation(event) {
      event.preventDefault();
      const targetSection = this.getAttribute("href");
      if (!targetSection.startsWith("#")) return;

      showSection(targetSection);
      history.pushState({ section: targetSection }, "", targetSection);
  }

  document.querySelectorAll("a[data-hide]").forEach(link => {
      link.addEventListener("click", handleNavigation);
  });

  window.addEventListener("popstate", function (event) {
      const section = event.state ? event.state.section : "#index";
      showSection(section);
  });

  showSection(window.location.hash || "#index");
});
