

checkFooter();


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

