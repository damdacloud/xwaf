let header = {
    init:function(){
        if($('header .member-inner').length == 0){
             $(window).scroll(function(){
                 var top = $(this).scrollTop();
                 if(top>=250){
                     $('#top').addClass('show');
                 }else{
                     $('#top').removeClass('show');
                 }
             });

            //$(window).scroll(function () {
            //   var top = $(this).scrollTop();
            //  if(top > 0){
            //      $('header').addClass('fixed');
            //    }else{
            //        $('header').removeClass('fixed');
            //    }
            //    if (top <= last_scrollTop) {
            //        $('header').addClass('nav-down');
            //    }else{
            //        $('header').removeClass('nav-down');
            //     }
            //     last_scrollTop = top;
            // });
    
            $(document).on("mouseenter", "header .has-depth", function(){
                $('header').addClass('hover');
                $('header .depth-bg, header .depth-menu').addClass('show');
                $(this).addClass('cur');
            })

            $(document).on("mouseleave", "header .has-depth", function(){
                $('header').removeClass('hover');
                $('header .depth-bg, header .depth-menu').removeClass('show');
                $(this).removeClass('cur');
            })
        }
    }
}
let aside = {
    init:function(){
        $(document).on('click','header .m-btn',function(){
            $('aside, .mask').addClass('show');
        });

        $(document).on('click','aside .btn-close',function(){
            $('aside, .mask').removeClass('show');
        });

        $(document).on('click','aside .has-depth',function(){
            $(this).toggleClass('cur');
            $(this).find('.depth-menu').slideToggle();
        })
    }
}
$(function(){
    
    header.init();
    aside.init();

    AOS.init({
        duration:700,
        easing: 'ease-in-out',
    });

    Fancybox.bind("[data-fancybox]");

    $(document).on('click','#top',function(){
        $('html, body').animate({scrollTop:0},400);
    })

    $(document).on('click','.lang button',function(){
        $(this).toggleClass('active').siblings('.depth').slideToggle();
    });
})

$(function(){
            var dashboard_slide = new Swiper('.dashboard-slide', {
                slidesPerView:1,
                speed:1000,
                loop:true,
                effect : 'fade', 
                autoplay: {
                    delay: 2500,
                  },
            });     
        })

$(function(){
            var img_slide = new Swiper('.img-slide', {
                slidesPerView:1,
                speed:1000,
                loop:true,
                effect : 'fade', 
                autoplay: {
                    delay: 1500,
                  },
            });     
        })

function priceSlideInit(){
            let width = $(window).width();

            var price_slide1 = new Swiper('.price-slide1', {
                slidesPerView: "4",
                speed:1000,
                spaceBetween:13,
                observer: true,
                observeParents: true,
                allowTouchMove:false,
                breakpoints: {
                    768: {
                        slidesPerView: "1.5",
                        allowTouchMove:true,
                    },
                }
            });     

            var price_slide2 = new Swiper('.price-slide2', {
                slidesPerView: "4",
                speed:1000,
                spaceBetween:13,
                observer: true,
                observeParents: true,
                allowTouchMove:false,
                breakpoints: {
                    768: {
                        slidesPerView: "1.5",
                        allowTouchMove:true,
                    },
                }
            });     

            var price_slide3 = new Swiper('.price-slide3', {
                slidesPerView: "4",
                speed:1000,
                spaceBetween:13,
                observer: true,
                observeParents: true,
                allowTouchMove:false,
                center:true,
                breakpoints: {
                    768: {
                        slidesPerView: "1.5",
                        allowTouchMove:true,
                    },
                }
            });     
        }
        $(function(){

            $('.pricing-tab button').click(function(){
                $('.pricing-tab button.cur').removeClass('cur');
                var index = $(this).parent('li').index()+1;
                $(this).addClass('cur');

                $('.tab-content.cur').removeClass('cur');
                $('.tab-content.tab-'+index).addClass('cur');
            })

            var tab_slide = new Swiper('.pricing-slide', {
                slidesPerView: "auto",
                speed:1000,
                spaceBetween:40,
                breakpoints: {
                    768: {
                        spaceBetween:30,
                    },
                }
            });     

            priceSlideInit();
        })
        $(function(){

            $('.fricing-tab button').click(function(){
                $('.fricing-tab button.cur').removeClass('cur');
                var index = $(this).parent('li').index()+1;
                $(this).addClass('cur');

                $('.ftab-content.cur').removeClass('cur');
                $('.ftab-content.tab-'+index).addClass('cur');
            })

            var tab_slide = new Swiper('.pricing-slide', {
                slidesPerView: "auto",
                speed:1000,
                spaceBetween:40,
                breakpoints: {
                    768: {
                        spaceBetween:30,
                    },
                }
            });     

            priceSlideInit();
        })
		$(function(){

            $('.fricing-tab01 button').click(function(){
                $('.fricing-tab01 button.cur').removeClass('cur');
                var index = $(this).parent('li').index()+1;
                $(this).addClass('cur');

                $('.ftab-content01.cur').removeClass('cur');
                $('.ftab-content01.tab-'+index).addClass('cur');
            })

            var tab_slide = new Swiper('.pricing-slide', {
                slidesPerView: "auto",
                speed:1000,
                spaceBetween:40,
                breakpoints: {
                    768: {
                        spaceBetween:30,
                    },
                }
            });     

            priceSlideInit();
        })
		
		$(function(){

            $('.fricing-tab02 button').click(function(){
                $('.fricing-tab02 button.cur').removeClass('cur');
                var index = $(this).parent('li').index()+1;
                $(this).addClass('cur');

                $('.ftab-content02.cur').removeClass('cur');
                $('.ftab-content02.tab-'+index).addClass('cur');
            })

            var tab_slide = new Swiper('.pricing-slide', {
                slidesPerView: "auto",
                speed:1000,
                spaceBetween:40,
                breakpoints: {
                    768: {
                        spaceBetween:30,
                    },
                }
            });     

            priceSlideInit();
        })
		
		$(function(){

            $('.fricing-tab03 button').click(function(){
                $('.fricing-tab03 button.cur').removeClass('cur');
                var index = $(this).parent('li').index()+1;
                $(this).addClass('cur');

                $('.ftab-content03.cur').removeClass('cur');
                $('.ftab-content03.tab-'+index).addClass('cur');
            })

            var tab_slide = new Swiper('.pricing-slide', {
                slidesPerView: "auto",
                speed:1000,
                spaceBetween:40,
                breakpoints: {
                    768: {
                        spaceBetween:30,
                    },
                }
            });     

            priceSlideInit();
        })
		
		$(function(){

            $('.fricing-tab button').click(function(){
                $('.fricing-tab button.cur').removeClass('cur');
                var index = $(this).parent('li').index()+1;
                $(this).addClass('cur');

                $('.ftab-content.cur').removeClass('cur');
                $('.ftab-content.tab-'+index).addClass('cur');
				
				$('.fricing-tab button.cur').removeClass('cur');
                $('.fricing-tab button.pricebut-'+index).addClass('cur');
            })

            var tab_slide = new Swiper('.pricing-slide', {
                slidesPerView: "auto",
                speed:1000,
                spaceBetween:40,
                breakpoints: {
                    768: {
                        spaceBetween:30,
                    },
                }
            });     

            priceSlideInit();
        })


        $(window).resize(function(){
            priceSlideInit();
        })
		
$(function(){
            var contents_slide = new Swiper('.contents-slide', {
                slidesPerView: 3,
                loop:true,
                autoplay: {
                    delay: 3000,
                },
                speed:1200,
                navigation: {
                    nextEl: '.contents-slide-next',
                    prevEl: '.contents-slide-prev',
                },
                breakpoints: {
                    768: {
                    slidesPerView: 'auto',
                      spaceBetween: 0
                    },
                    1024: {
                      slidesPerView: 'auto',
                      spaceBetween: 30
                    }
                }
            });

            var partner_slide = new Swiper('.partner-slide', {
                slidesPerView: 5,
                slidesPerColumn: 1,
                loop:true,
                autoplay: {
                    delay: 1500,
                },
                speed:1000,
                slidesPerColumnFill: 'column',
                navigation: {
                    nextEl: '.partner-slide-next',
                    prevEl: '.partner-slide-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 3,
                        slidesPerColumn: 1,
                    },
                    1024: {
                        slidesPerView: 4,
                        slidesPerColumn: 1,
                    }
                }
            });
			
			
			var banner_slide = new Swiper('.banner-slide', {
                slidesPerView: 1,
                loop:true,
                autoplay: {
                    delay: 5000,
					disableOnInteraction: false 
                },
                speed:700,
                navigation: {
                    nextEl: '.banner-slide-next',
                    prevEl: '.banner-slide-prev',
                }
            });
        })

$(function(){
            if($('.customer-slide .swiper-slide').length > 0){
                var customer_slide = new Swiper('.customer-slide', {
                    loop:true,
                    speed:1000,
                    navigation: {
                        nextEl: '.customer-slide-next',
                        prevEl: '.customer-slide-prev',
                    },
                });
            }

            var partner_slide = new Swiper('.partner-slide', {
                slidesPerView: 5,
                slidesPerColumn: 1,
                loop:true,
                autoplay: {
                    delay: 1500,
                },
                speed:1000,
                slidesPerColumnFill: 'column',
                navigation: {
                    nextEl: '.partner-slide-next',
                    prevEl: '.partner-slide-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 3,
                        slidesPerColumn: 1,
                    },
                    1024: {
                        slidesPerView: 4,
                        slidesPerColumn: 1,
                    }
                }
            });
        })

$(function(){
            $('.case-tab button').click(function(){
                $('.case-tab button.cur').removeClass('cur');
                var index = $(this).parent('li').index()+1;
                $(this).addClass('cur');

                $('.tab-content.cur').removeClass('cur');
                $('.tab-content.tab-'+index).addClass('cur');
                
            })
            var case_slide = new Swiper('.case-slide', {
                slidesPerView: "auto",
                speed:1000,
                spaceBetween:40,
                breakpoints: {
                    768: {
                        spaceBetween:30,
                    },
                }
            });     
            
            var video_slide = new Swiper('.video-slide', {
                slidesPerView: 3,
                speed:1000,
                spaceBetween:26,
                loop:true,
                navigation: {
                    nextEl: '.video-slide-next',
                    prevEl: '.video-slide-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 'auto',
                        spaceBetween:15,
                    },
                }
            });         
            
        })

document.addEventListener("DOMContentLoaded", function () {
  const langMap = {
    ko: "한국어",
    en: "English",
    ja: "日本語",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    lu: "Lux."
  };

  const currentLang = location.pathname.split("/")[1] || "ko";
  const displayLang = langMap[currentLang] || "Language";

  const langButton = document.getElementById("lang-button");
  if (langButton) langButton.textContent = displayLang;
});
