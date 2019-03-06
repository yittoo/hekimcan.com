

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

