

checkFooter();
checkNavWidth();

function checkNavWidth(){
    if($(window).width()<1000){
        $("#rightSideOfMenu").removeClass("right");
    } else {
        $("#rightSideOfMenu").addClass("right");
    }
}

$(window).resize(function(){
    checkNavWidth();
});

window.onload = function(){
    $(".loading-screen").fadeOut(1000);
    setTimeout(function(){
        $(".social-media-buttons").fadeIn(700);
    }, 200)
};

$(document).on("scroll", function(){
    checkFooter();
});

$(".nav-submit").on("click", function(){
    $(".right.menu form")[0].action = "/"+$(".right.menu select").val()+"/ara/"+$(".right.menu form .search-input").val();
    if($(".right.menu form .search-input").val()!==""){
        $(".right.menu form").submit();
    }
});

function checkFooter(){
    const footer = $(".footer");
    if($("body").height()<window.innerHeight){
        footer.css("position", "fixed");
        footer.css("bottom", 0);
    } else {
        footer.css("position", "");
    }
}

$(".ui.simple.dropdown.item").on("click", function(){
    if($(this).children("div.menu").hasClass("active-menu-item")){
        $(this).attr('id', '');
        $(this).children("div.menu").removeClass("active-menu-item");
    } else {
        $(".ui.simple.dropdown.item").children().removeClass("active-menu-item");
        $(".ui.simple.dropdown.item").attr('id', '');
        $(this).attr("id", "bg-008");
        $(this).children("div.menu").addClass("active-menu-item");
    }
});

// $(".primary-header").hover(function(){
//     var counter = 0;
//     myInterval = setInterval(function () {
//         ++counter;
//     }, 1000);
// })

var counter = 0;
var myInterval =null;

$(".link-activator").hover(function(e){
    counter = 0;
    myInterval = setInterval(function () {
        ++counter;
    }, 1000);
},function(e){
    if(counter>=3){
        $(this).children(".inactive-link").removeClass("inactive-link");
        $(this).removeClass("link-activator-guide");
    };
    clearInterval(myInterval);
});

if($(".link-activator").has(".inactive-link").length>0){
    $(".link-activator").addClass("link-activator-guide");
}

