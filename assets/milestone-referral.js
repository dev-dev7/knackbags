!function(){var a=window.VL=window.VL||{};return a.instances=a.instances||{},a.invoked?void(window.console&&console.error&&console.error("VL snippet loaded twice.")):(a.invoked=!0,void(a.load=function(b,c,d){var e={};e.publicToken=b,e.config=c||{};var f=document.createElement("script");f.type="text/javascript",f.id="vrlps-js",f.defer=!0,f.src="https://app.viral-loops.com/client/vl/vl.min.js";var g=document.getElementsByTagName("script")[0];return g.parentNode.insertBefore(f,g),f.onload=function(){a.setup(e),a.instances[b]=e},e.identify=e.identify||function(a,b){e.afterLoad={identify:{userData:a,cb:b}}},e.pendingEvents=[],e.track=e.track||function(a,b){e.pendingEvents.push({event:a,cb:b})},e.pendingHooks=[],e.addHook=e.addHook||function(a,b){e.pendingHooks.push({name:a,cb:b})},e.$=e.$||function(a){e.pendingHooks.push({name:"ready",cb:a})},e}))}();var campaign=VL.load("r_2dDGnFQpiFVoXQZ0mEm4ggZK0",{autoLoadWidgets:!0});

//part of the guide found here:
//http://intercom.help/viral-loops/the-milestone-referral/technical-integration/how-to-use-a-custom-form-instead-of-the-form-widget


//capture the data and identify the user after the form is submitted

var vlPreventToggle = false;
var referralCount = 0;
var firstName = ''

function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

function setupViralLoopsUI() {

  if (vlPreventToggle) {
    return;
  }

  let userCode = getUrlParameter('userCode');

  //if we have a logged in user
  if ((campaign.user && campaign.user.referralCode) || userCode) {
    //show the dashboard
    $("#progress_container").show();
    $("#widgets_container").hide();

    if(userCode && userCode !== campaign.user.referralCode) {
      campaign.logout();
      referralCount = 0;
      location.reload();
    }

    var codes = ['SkDUgxiOm','S1VPCKVdQ','B11wgKmvm','SJfgwIVum','SyWPnxxuQ','Iiu61Pj','49odYLg','84KtOE9','mR7Z719','H9BWN92','ev9ompP','0jKvXVo'];
    
    if (codes.includes(campaign.user.referralCode)) {
      $('#LoginModal').show();
    }



    console.log('is new ' + campaign.user.isNew);

    if (campaign.user.isNew) {
      $('#thanksMessage').show();
      $('#welcomeBackMessage').hide();
    } else {
      $('#welcomeBackMessage').show();
      $('#thanksMessage').hide();
    }

    $('#vlCopyInput').attr('value', 'https://knackbags.com/password?referralCode='+ campaign.user.referralCode +'&refSource=copy');
    $('#emailLink').attr('href', 'mailto:?subject=Knack – One Bag Life is here.&body=Check out this new bag from Knack. Knack is all about the idea of a One Bag Life, which is what happens when you free yourself from lugging multiple bags around all the time. %0D%0A %0D%0A Sign up now for early access to Knack bags before they are made available to the general public. %0D%0A %0D%0A Sign up here: ' + ('https://knackbags.com/password&#63;referralCode='+ campaign.user.referralCode +'&amp;refSource=email').replace(/&/g,'%26'));
    $('#facebookLink').attr('href', 'http://www.facebook.com/sharer.php?u=' + ('https://knackbags.com/password?referralCode='+ campaign.user.referralCode +'&refSource=facebook').replace(/&/g,'%26'));
    $('#twitterLink').attr('href', 'http://twitter.com/share?text=Knack is about to launch and they are giving away a few of these awesome backpacks when you sign up to be notified of their launch and invite your friends. &url=' + ('https://knackbags.com/password?referralCode='+ campaign.user.referralCode +'&refSource=twitter').replace(/&/g,'%26'));

    $('.social .social-link').click(function(){ genericSocialShare($(this).attr('href')); });

    $('#logoutLink').click(function(e){ campaign.logout(); window.location.href='/password'; });

    if(!referralCount){
      $.ajax({url: 'https://app.viral-loops.com/api/v2/participant_data?apiToken=3ckrSrVK55p_xp2UqJgL-LC2ADM&params={"participants":[{"referralCode":"'+campaign.user.referralCode+'"}]}', success: function(result){
          updateReferralCount(result.data[0].counters.referrals.total);
          updateFirstName(result.data[0].user.firstname);
        }});

    }


  } else {
    //show the form
    $("#widgets_container").show();
    $("#progress_container").hide();
  }
}

function updateReferralCount(count){
  referralCount = count;
  document.getElementById("referralCount").innerHTML = referralCount;
}

function updateFirstName(name){
  firstName = name;
  let lol = document.getElementById('logoutLabel');
  if (name) {
    lol.innerText = 'Not '+name+'?';
  }

}

function genericSocialShare(url){
    window.open(url,'sharer','toolbar=0,status=0,width=648,height=395');
    return true;
}

function initVL(){
  let $form =  $("#referral_contact_form");
  $form.one( 'submit', submitSignupForm);

  let $loginForm = $("#referral_login_form");
  $loginForm.on( 'submit', submitSignInForm);
  //when the campaign boots
  campaign.addHook("boot", setupViralLoopsUI);
  campaign.addHook("widgetsLoad", setupViralLoopsUI);
  campaign.addHook("stageChange", setupViralLoopsUI);

  document.addEventListener('shopify:section:select', function(event){
    var sectionId = event.detail.sectionId;
    if (sectionId.toLowerCase() === 'knack-milestone-step-1') {
      //show the form
      $("#widgets_container").show();
      $("#progress_container").hide();
    } else if (sectionId.toLowerCase() === 'knack-milestone-step-2') {
      //show the widgets
      $("#progress_container").show();
      $("#widgets_container").hide();
    }
  })
}

function submitSignInForm(e) {
  //prevent default form action
  e.preventDefault();

  vlPreventToggle = true;

  let $form =  $("#referral_login_form");

  let email = "";

  //get the form data
  let data = $form.serializeArray();


  console.log(data);

  data.forEach(function(field){
    if(field.name === "email"){
      email = field.value;
    }
    /**

     if(field.name == "lastname"){
			lastName = field.value;
          }
     **/
  });

    if (loginFormValidator.errorList.length === 0) {

        $('.preloader').show();

        try {
          campaign.identify({
            email: email
          }, function() {
            //optional callback
            //you can hide the form here and show the widgets
            //$("#form_container").hide();
            //$("#widgets_container").show();

            location.reload();
          });


          setTimeout(function(){ $('.preloader').hide(); },2000)

        } catch(error) {
          $('.preloader').hide();
        }


    } else {
      $('.preloader').hide();
    }


}

function submitSignupForm(e) {

  //prevent default form action
  e.preventDefault();



  vlPreventToggle = true;

  let $form =  $("#referral_contact_form");

  //get the form data
  let data = $form.serializeArray();

  let email = "";
  let firstName = "";
  let lastName = "";

  console.log(data);

  data.forEach(function(field){
    if(field.name === "contact[email]"){
      email = field.value;
    }


    if(field.name == "contact[fname]"){
      firstName = field.value;
    }


     if(field.name == "contact[lname]"){
			lastName = field.value;
      }

  });

  if (referralContactFormValidator.errorList.length === 0) {

    $('.preloader').show();

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://manage.kmail-lists.com/subscriptions/external/subscribe",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      },
      "data": {
        "g": "JqM32A",
        "$fields": "$source",
        "email": email,
        "$email": email,
        "$first_name": firstName,
        "$last_name": lastName,
        "$source": "Shopify form"
      }
    };

    $KL.ajax(settings).done(function (response) {
      console.log(response);
    });

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://manage.kmail-lists.com/subscriptions/external/subscribe",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      },
      "data": {
        "g": "P4x7qs",
        "$fields": "$source",
        "email": email,
        "$email": email,
        "$first_name": firstName,
        "$last_name": lastName,
        "$source": "Shopify form"
      }
    };
    $KL.ajax(settings).done(function (response) {
      console.log(response);
    });

    try{
      campaign.identify({
        firstname: firstName,
        lastname: lastName,
        email: email
      }, function() {
        //optional callback
        //you can hide the form here and show the widgets
        //$("#form_container").hide();
        //$("#widgets_container").show();

        $form.submit();
      });

      setTimeout(function(){ $('.preloader').hide(); },2000)

    } catch(error) {
      $('.preloader').hide();
    }


  } else {
    $('.preloader').hide();

    let $form =  $("#referral_contact_form");
    $form.off('submit', submitSignupForm);
    $form.one( 'submit', submitSignupForm);
  }
}


initVL();
var referralContactFormValidator = null;
var loginFormValidator = null;


  var $btnCopy = $('.copyBtn');

  $btnCopy.on('click', function() {
    var clipboard = new ClipboardJS('.copyBtn');

    clipboard.on('success', function(e) {
      $btnCopy.text('Copied');

      setTimeout(function() {
        $btnCopy.html('<i class="fas fa-copy"></i>');
      }, 2500);
    });
  });

  $(document).ready(function() {
    referralContactFormValidator = $('#referral_contact_form').validate({
      rules: {
        'contact[email]': {
          required: true,
          email: true
        },
        'contact[fname]': {
          required: true
        },
        'contact[lname]': {
          required: true
        }        
      }
    });

      loginFormValidator = $('#referral_login_form').validate({
          rules: {
              'email': {
                  required: true,
                  email: true
              }
          }
      });
      $('#videoTabs .tab-label').click(function(event){
        let selectedIndex = $('#videoTabs .tab-label').index(this);
        $('#videoTabs .tab-label').removeClass('selected');
        $('#videoTabs .tab-content').hide();
        $('#videoTabs .tab-label:eq('+selectedIndex+')').addClass('selected');
        $('#videoTabs .tab-content:eq('+selectedIndex+')').show();
      });
    
    $('#videoTabs2 .tab-label').click(function(event){
        let selectedIndex = $('#videoTabs2 .tab-label').index(this);
        $('#videoTabs2 .tab-label').removeClass('selected');
        $('#videoTabs2 .tab-content').hide();
        $('#videoTabs2 .tab-label:eq('+selectedIndex+')').addClass('selected');
        $('#videoTabs2 .tab-content:eq('+selectedIndex+')').show();
      });
theme.VideoSection = (function() {
  var youtubeReady;
  var videos = [];
  var youtubePlayers = [];
  var youtubeVideoOptions = {
    width: 1280,
    height: 720,
    playerVars: {
      autohide: 0,
      branding: 0,
      cc_load_policy: 0,
      controls: 0,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      quality: 'hd720',
      rel: 0,
      showinfo: 0,
      wmode: 'opaque'
    },
    events: {
      onReady: onVideoPlayerReady,
      onStateChange: onVideoStateChange
    }
  };

  var vimeoReady = false;
  var vimeoVideoOptions = {
    byline: false,
    title: false,
    portrait: false,
    loop: true
  };

  var selectors = {
    videoParent: '.video-parent-section'
  };

  var classes = {
    loading: 'loading',
    loaded: 'loaded',
    interactable: 'video-interactable'
  };

  function videoSection(container) {
    var $container = this.$container = $(container);
    var sectionId = this.sectionId = $container.attr('data-section-id');
    var youtubePlayerId = this.youtubePlayerId = 'YouTubeVideo-' + this.sectionId;
    this.namespace = '.' + youtubePlayerId;
    var vimeoPlayerId = this.vimeoPlayerId = 'Vimeo-' + this.sectionId;
    var $vimeoTrigger = this.$vimeoTrigger = $('#VimeoTrigger-' + this.sectionId);
    var mp4Video = 'Mp4Video-' + this.sectionId;

    var $youtubeDiv = $('#' + youtubePlayerId);
    var $vimeoDiv = $('#' + vimeoPlayerId);
    var $mp4Div = $('#' + mp4Video);

    this.vimeoPlayer = [];

    if ($youtubeDiv.length) {
      this.youtubeVideoId = $youtubeDiv.data('video-id');
      this.initYoutubeVideo();
    }

    if ($vimeoDiv.length) {
      this.vimeoVideoId = $vimeoDiv.data('video-id');
      this.initVimeoVideo();
    }

    if ($mp4Div.length) {
      setParentAsLoaded($mp4Div);

      startMp4Playback(mp4Video).then(function() {
        // Video played as expected, don't do anything
      }).catch(function(error) {
        // Video cannot be played with autoplay, so let
        // user interact with video element itself
        setVideoToBeInteractedWith($mp4Div);
      })
    }
  }

  function startMp4Playback(mp4Video) {
    return document.querySelector('#' + mp4Video).play();
  }

  function onVideoPlayerReady(evt) {
    var $player = $(evt.target.a);
    var playerId = $player.attr('id');
    youtubePlayers[playerId] = evt.target; // update stored player
    var player = youtubePlayers[playerId];

    setParentAsLoading($player);

    youtubePlayers[playerId].mute();

    // Remove from tabindex because YouTube iframes are annoying and you can focus
    // on the YouTube logo and it breaks
    $player.attr('tabindex', '-1');

    // Add out of view pausing
    videoVisibilityCheck(playerId);
    $(window).on('scroll.' + playerId, {id: playerId}, $.throttle(150, videoVisibilityCheck));
  }

  function videoVisibilityCheck(id) {
    var playerId;

    if (typeof id === 'string') {
      playerId = id;
    } else {
      // Data comes in as part of the scroll event
      playerId = id.data.id;
    }

    if (theme.isElementVisible($('#' + playerId))) {
      playVisibleVideo(playerId);
    } else {
      pauseHiddenVideo(playerId);
    }
  }

  function playVisibleVideo(id) {
    if (youtubePlayers[id] && typeof youtubePlayers[id].playVideo === 'function') {
      youtubePlayers[id].playVideo();
    }
  }

  function pauseHiddenVideo(id) {
    if (youtubePlayers[id] && typeof youtubePlayers[id].pauseVideo === 'function') {
      youtubePlayers[id].pauseVideo();
    }
  }

  function onVideoStateChange(evt) {
    var $player = $(evt.target.a);
    var playerId = $player.attr('id');
    var player = youtubePlayers[playerId];

    switch (evt.data) {
      case -1: // unstarted
        // Handle low power state on iOS by checking if
        // video is reset to unplayed after attempting to buffer
        if (videos[playerId].attemptedToPlay) {
          setParentAsLoaded($player);
          setVideoToBeInteractedWith($player);
        }
        break;
      case 0: // ended
        player.playVideo();
        break;
      case 1: // playing
        setParentAsLoaded($player);
        break;
      case 3: // buffering
        videos[playerId].attemptedToPlay = true;
        break;
    }
  }

  function setParentAsLoading($el) {
    $el
      .closest(selectors.videoParent)
      .addClass(classes.loading);
  }

  function setParentAsLoaded($el) {
    $el
      .closest(selectors.videoParent)
      .removeClass(classes.loading)
      .addClass(classes.loaded);
  }

  function setVideoToBeInteractedWith($el) {
    $el
      .closest(selectors.videoParent)
      .addClass(classes.interactable);
  }

  videoSection.prototype = $.extend({}, videoSection.prototype, {
    initYoutubeVideo: function() {
      videos[this.youtubePlayerId] = {
        id: this.youtubePlayerId,
        videoId: this.youtubeVideoId,
        type: 'youtube',
        attemptedToPlay: false
      };

      if (!youtubeReady) {
        window.loadYouTube();
        $('body').on('youTubeReady' + this.namespace, this.loadYoutubeVideo.bind(this));
      } else {
        this.loadYoutubeVideo();
      }
    },

    loadYoutubeVideo: function() {
      var args = $.extend({}, youtubeVideoOptions, videos[this.youtubePlayerId]);
      args.playerVars.controls = 0;
      youtubePlayers[this.youtubePlayerId] = new YT.Player(this.youtubePlayerId, args);

      youtubeReady = true;
    },

    initVimeoVideo: function() {
      videos[this.vimeoPlayerId] = {
        divId: this.vimeoPlayerId,
        id: this.vimeoVideoId,
        type: 'vimeo'
      };

      var $player = $('#' + this.vimeoPlayerId);
      setParentAsLoading($player);

      // Button to play video on mobile
      this.$vimeoTrigger.on('click', + this.namespace, function(evt) {
        // $(evt.currentTarget).addClass('hide');
        this.requestToPlayVimeoVideo(this.vimeoPlayerId);
      }.bind(this));

      if (!vimeoReady) {
        window.loadVimeo();
        $('body').on('vimeoReady' + this.namespace, this.loadVimeoVideo.bind(this));
      } else {
        this.loadVimeoVideo();
      }
    },

    loadVimeoVideo: function() {
      var args = $.extend({}, vimeoVideoOptions, videos[this.vimeoPlayerId]);
      this.vimeoPlayer[this.vimeoPlayerId] = new Vimeo.Player(videos[this.vimeoPlayerId].divId, args);

      vimeoReady = true;

      // Only autoplay on larger screens
      if (!theme.config.bpSmall) {
        this.requestToPlayVimeoVideo(this.vimeoPlayerId);
      } else {
        var $player = $('#' + this.vimeoPlayerId);
        setParentAsLoaded($player);
      }
    },

    requestToPlayVimeoVideo: function(id) {
      // The slider may initialize and attempt to play the video before
      // the API is even ready, because it sucks.

      if (!vimeoReady) {
        // Wait for the trigger, then play it
        $('body').on('vimeoReady' + this.namespace, function() {
          this.playVimeoVideo(id);
        }.bind(this))
        return;
      }

      this.playVimeoVideo(id);
    },

    playVimeoVideo: function(id) {
      this.vimeoPlayer[id].play();
      this.vimeoPlayer[id].setVolume(0);

      var $player = $('#' + id);
      setParentAsLoaded($player);
    },

    onUnload: function(evt) {
      var sectionId = evt.target.id.replace('shopify-section-', '');
      var playerId = 'YouTubeVideo-' + sectionId;
      youtubePlayers[playerId].destroy();
      $(window).off('scroll' + this.namespace);
      $('body').off('vimeoReady' + this.namespace);
    }
  });

  return videoSection;
})();    
  });


