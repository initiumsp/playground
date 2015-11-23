(function() {
	var pageWrap = $( '#pagewrap' ),
		pages = $( 'div.container' ),
		mode = 'low',
		currentPage = 0,
		player = null,
		sptimer = null,
		triggerLoading = pageWrap.find( 'a.pageload-link' ),
		loader = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 600, easingIn : mina.easeinout, callback: function(){
			$('body').trigger('animationEnd.loader');
		} } ),
		videoHandler = {
			id1: 'video_1',
			id2: 'video_2',
			playnow: false,
			init: function(){
				var $vid_obj = videojs(document.getElementById(this.id1), {"controls": false, "autoplay": false, "preload": "auto"}, function() {
				});
				$vid_obj.ready(function(){
				  var $video = $('#'+videoHandler.id1);
				  var src = (mode == 'normal')? $video.data('v720') : ((mode == 'low')? $video.data('v480') : $video.data('v1080'));
				  $("#video_1 video").attr("src",src);
				  player = this;
				  player.on('ended', function() {
				    videoHandler.ended();
				  });
				  if(videoHandler.playnow){
				  	this.play();
				  }
				});
			},
			init2: function(){
				var $vid_obj2 = videojs(document.getElementById(this.id2), {"controls": true, "autoplay": false, "preload": "false"}, function() {
				});
				$vid_obj2.ready(function(){
				  var $video = $('#'+videoHandler.id2);
				  var src = (mode == 'normal')? $video.data('v720') : ((mode == 'low')? $video.data('v480') : $video.data('v1080'));
				  $("#video_2 video").attr("src",src);
				});
			},
			play: function(){
				if(player) player.play();
			},
			stop: function(){
				if(player) player.pause();	
			},
			ended: function(){
				videoHandler.stop();
				$('#skip_video').fadeOut();
				$('#page-2 .intro').fadeIn();
				$('body').addClass('skipped');
			},
			replay: function(){
				$('#skip_video').fadeIn();
				$('#page-2 .intro').fadeOut();	
				$('body').removeClass('skipped');
				videoHandler.play();
			},
			stopped: function(){
				return (player && player.paused());
			}
		};


	function addResponsiveClass(){
		if ( $(window).width() > 767 ) 
			$('body').addClass('desktop').removeClass('mobile');
		else
			$('body').addClass('mobile').removeClass('desktop');
	}
	addResponsiveClass();
	$(window).resize(addResponsiveClass);

	$('body.desktop a.gallery').colorbox({
		scalePhotos: true,
    	maxWidth: '70%'
	});

	$('.menu a').click(function(e){
		e.preventDefault();
		$('.menu').slideUp('fast');
		videoHandler.ended();
		$('.menu-button span').toggleClass('sp-menu sp-menu-close');
		$('body').scrollTo( $($(this).attr('href')), 800,  {offset: {top: -100}});
		//return true;
	});

    $('.menu-button, header .title').click(function(e){
    	e.preventDefault();
    	$('.menu').slideToggle('fast');
    	$('.menu-button span').toggleClass('sp-menu sp-menu-close');
    });

    $('#sandpool a').click(function(e){
    	e.preventDefault();
    	if($(this).hasClass('on'))
    		return;
    	if(sptimer){
    		clearTimeout(sptimer);
    		sptimer = null;
    	}
    	$(this).addClass('on').siblings('a.on').removeClass('on');
    	$('.click-img.on').removeClass('on');
    	$('#sandpool .' +$(this).data('img')).addClass('on');
    	sptimer = setTimeout(function(){
    		resetSandPool();
    	}, 8000);
    });
    function resetSandPool(){
    	$('.click-img.on').removeClass('on');
    	$('.sp-p-discussion-1').addClass('on');
    	$('#sandpool a').removeClass('on');
    }

	function drawslider(){
		$('.big-slider').slick({
			arrows: true,
			dots: false,
			prevArrow: '<button type="button" class="slick-prev sp sp-slick-prev">Previous</button>',
			nextArrow: '<button type="button" class="slick-next sp sp-slick-next">Next</button>',
  			// lazyLoad: 'progressive',
  			slidesToShow: 1,
  			slidesToScroll: 1
		});

		// $('.slider').slick({
		// 	arrows: false,
		// 	dots: false,
		// 	fade: true, 
		// 	autoplay: true
		// });

		// update label of slider
		// var currSlide = '';
		// $('.slider1').on('beforeChange', function(event, slick, currentSlide, nextSlide){
		// 	var i = nextSlide + 1;
		// 	currSlide = $('.slider1').slick('getSlick').$slides[nextSlide];
		// 	$('.label1').html( $(currSlide).data('label'));
		// });
		// currSlide = $('.slider1').slick('getSlick').$slides[0];
		// $('.label1').html( $(currSlide).data('label'));

		// currSlide = '';
		// $('.slider2').on('beforeChange', function(event, slick, currentSlide, nextSlide){
		// 	var i = nextSlide + 1;
		// 	currSlide = $('.slider2').slick('getSlick').$slides[nextSlide];
		// 	$('.label2').html( $(currSlide).data('label'));
		// });
		// currSlide = $('.slider2').slick('getSlick').$slides[0];
		// $('.label2').html( $(currSlide).data('label'));

		// update slider count and highlight selected group name on change
		$('.big-slider').on('afterChange', function(event, slick, currentSlide){
			slide = $('.big-slider').slick('getSlick').$slides[currentSlide];
			img = $(slide).find('img');
			group = $(img).data('group');
			$('.big-slider-wrapper .slider-count').html(currentSlide+1+'/'+$('.big-slider').slick('getSlick').$slides.length);
			$.each($('.slider-anchor a'), function(index, value){
				$(this).removeClass('sp-button-on');
				if(!$(this).hasClass('sp-button-off')){
					$(this).addClass('sp-button-off');
				}
				if ( $(this).data('group') === group) {
					$(this).removeClass('sp-button-off');
					$(this).addClass('sp-button-on');
				}

			});
		});
		$('.big-slider-wrapper .slider-count').html('1/'+$('.big-slider').slick('getSlick').$slides.length);

		// jump to the first slide of group after anchor is clicked
		$('.slider-anchor a').on('click', function(e){
			e.preventDefault();
			group = $(this).data('group');
			var count = $('.big-slider').slick('getSlick').$slides.length;
			for (i=0; i<=count; i++){
				slide = $('.big-slider').slick('getSlick').$slides[i];
				img = $(slide).find('img');
				if( $(img).data('group') === group){
					$('.big-slider').slick('slickGoTo',$(slide).data('slick-index'));
					$('.big-slider-wrapper .slider-count').html($(slide).data('slick-index')+1+'/'+$('.big-slider').slick('getSlick').$slides.length);
					return;
				}
			}
		});
	}

	function init() {
		var state = 0;
		var timer = null;
		$(triggerLoading).bind('click', function(e){
				e.preventDefault();
				loader.show();
				timer = setInterval(function(){
					state++;
					state = state%12;
					if(state == 0){
						loader.hide();
						clearInterval(timer);
						timer = null;
					}
					$('#icon').attr('class', 'state'+state);
				}, 200);
				$('body').bind('animationEnd.loader', function(){
					pages.eq(currentPage).removeClass('show');
					currentPage = currentPage ? 0 : 1;
					pages.eq(currentPage).addClass('show');
					$('body').addClass('loaded');
					if(player){
						videoHandler.play();
					}
					else{
						videoHandler.playnow = true;
					}
					loaded();
					drawslider();
				});
		});	
		$('#start_video').bind('click', function(e){
			e.preventDefault();
			$('body').scrollTo('#long_content', 800);
			videoHandler.stop();
		});
		$('#skip_video').bind('click', function(e){
			e.preventDefault();
			videoHandler.ended();
		});
		$('#replay_video').bind('click', function(e){
			e.preventDefault();
			videoHandler.replay();
		});
		if(dev){
			$('body').addClass('loaded');
			$('#page-2').addClass('show');
			//loaded();
			//drawslider();
		}
		//$('#load_container').load('./partial.html', function(){
		//	//console.log('ajax');
		//	$('#load_container .responsive-img').responsImg({
		//	  breakpoints: {
		//	    desktop: 767
		//	  }
		//	});
		//});
		$('body').scrollTo(0, 800);
		if(!dev)$('.pageload-link').trigger('click');
		$(window).load(function(){
			$('body').scrollTo(0, 800);
			//console.log('loaded');
			//loaded();
			//drawslider();
			$(window).trigger('resize');
			setTimeout(function(){
				$(window).trigger('resize');
				loaded();
			}, 2000);
			videoHandler.init2();
		}).scroll(function() {
	        if( $(window).scrollTop() >= $('#page-2 > .video').innerHeight() ) {
	           if(!videoHandler.stopped()) $('#skip_video').trigger('click');
	        }
	    }).resize(function(){
	    	var w = $(window).width();
	    	if(w >=1600){
	    		mode = 'highres';
	    	}
	    	else if(w >=768){
	    		mode = 'normal';
	    	}
	    	else{
	    		mode = 'low';
	    	}
	    }).trigger('resize');
	    $('.responsive-img').responsImg({
			  breakpoints: {
			    desktop: 767
			  }
		});
	    videoHandler.init();
	}
	function loaded(){
		$('#article-2-0b article').masonry({
		  // options
		  itemSelector: '.part',
		  columnWidth: '.part',
		  percentPosition: true
		});
	}
	init();

})();