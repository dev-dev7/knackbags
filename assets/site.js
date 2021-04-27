$(document).ready(function(){
    
  $('.prodImages').slick({
        dots: true,
    	arrows: false,
        infinite: false,
        speed: 500,
        fade: true,
        draggable: false,
        slide: 'li',
        cssEase: 'linear',
        centerMode: true,
        slidesToShow: 1,
        variableWidth: false,
        autoplay: false,

        customPaging: function (slider, i) {
            return $('.slick-thumbs li:nth-child(' + (i + 1) + ')').html();
        }
    });


  $('.smoothScroll').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 100
        }, 800); // The number here represents the speed of the scroll in milliseconds
        return false;
      }
    }
  });

  if ($(window).width() < 480) {
    $('#shipping').attr('data-balloon-pos', 'down-right');
    $('#freeReturns').attr('data-balloon-pos', 'down-left');
  }

 var iFrameDOM = $(".video-wrapper iframe").contents();

  iFrameDOM.find(".ytp-share-button-visible").css("display", "none");
//$(".product-image-main .image-wrap img").each(function() {
 //   var imageCaption = $(this).attr("alt");
 //   if (imageCaption != '') {
 //       $("<div class='img-caption'>" + imageCaption + "</div>").insertAfter(this);
 //   }
//}); 
  
  try {
  
    var $vFrame = $('.videoFrame');

    if ($vFrame) {
      $vFrame.load(function() {
        var css = '<style type="text/css">.ytp-share-button-visible{display:none};</style>';
        $vFrame.contents().find("head").append(css);
      })
    }
  } catch(e) {}
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}


if ( window.location.pathname == '/' ){
    // Index (home) page
  var campaign = getUrlParam('utm_campaign',null);
  if(campaign  && campaign.indexOf('referralcandy') > -1){
   window.location.replace("https://knackbags.com/pages/referral-gwp");
  } else {
   // not from referral candy
  }

} else {
    // Other page
   
}

window.addEventListener("klaviyoForms", function(e) { 
  if (e.detail.type == 'open' || e.detail.type == 'embedOpen') {
    ga('send', 'event', 'Klaviyo form', 'form_open', e.detail.formId);
  }
  if (e.detail.type == 'submit') {
    ga('send', 'event', 'Klaviyo form', 'form_submit', e.detail.formId);
  }
  if (e.detail.type == 'close') {
    ga('send', 'event', 'Klaviyo form', 'form_close', e.detail.formId);
  }
});