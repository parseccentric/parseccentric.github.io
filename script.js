function changeHeader(a){document.getElementById("nav-positionIndicator").value=a/(Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight)-window.innerHeight)*100,document.getElementById("main-header").style.height=.8-a/window.innerHeight>.4?100*(.8-a/window.innerHeight)+"vh":"64px",a/window.innerHeight<.4?(document.getElementById("main-header").classList.toggle("cover",!0),document.getElementById("main-header").classList.toggle("collapsed",!1)):(document.getElementById("main-header").classList.toggle("collapsed",!0),document.getElementById("main-header").classList.toggle("cover",!1))}var lastScrollY=0,isTicking=!1;$(document).ready(function(){$('a[href^="#"]').on("click",function(a){a.preventDefault();var b=$(this.hash);$("html, body").animate({scrollTop:b.offset().top},500,"swing",function(){window.location.hash=this.hash})}),window.addEventListener("scroll",function(a){lastScrollY=window.scrollY,isTicking||window.requestAnimationFrame(function(){changeHeader(lastScrollY),isTicking=!1}),isTicking=!0}),$("#modalApp-link").on("click",function(a){$("#section-modalApp").toggleClass("shown"),$("#section-modalApp").toggleClass("hidden")}),$("#modalApp-underlay").on("click",function(a){$("#section-modalApp").toggleClass("hidden"),$("#section-modalApp").toggleClass("shown")}),$("#modalBranding-link").on("click",function(a){$("#section-modalBranding").toggleClass("shown"),$("#section-modalBranding").toggleClass("hidden")}),$("#modalBranding-underlay").on("click",function(a){$("#section-modalBranding").toggleClass("hidden"),$("#section-modalBranding").toggleClass("shown")}),$("#modalWebsite-link").on("click",function(a){$("#section-modalWebsite").toggleClass("shown"),$("#section-modalWebsite").toggleClass("hidden")}),$("#modalWebsite-underlay").on("click",function(a){$("#section-modalWebsite").toggleClass("hidden"),$("#section-modalWebsite").toggleClass("shown")})});