

checkFooter();


$(document).on("scroll", function(){
    checkFooter();
})

function checkFooter(){
    const footer = $(".footer");
    if($("body").height()<window.innerHeight){
        footer.css("position", "fixed");
        footer.css("bottom", 0);
    } else {
        footer.css("position", "");
    }
}

