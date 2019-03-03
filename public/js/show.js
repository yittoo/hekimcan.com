$("#page-content").html(createElementFromHTML($("#page-content").text()))

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    div.className += "grid ui stackable";
    return div; 
}

$("details").removeAttr("open");
$("details")[0].setAttribute("open", "");

$(".addSymptomBtn").on("click", function(){
    $("#new-symptom").fadeIn(400);
    $("#new-drug").fadeOut(1);
    $(".addDrugBtn").removeClass("d-none");
    $(this).addClass("d-none");
});

$(".addDrugBtn").on("click", function(){
    $("#new-drug").fadeIn(400);
    $("#new-symptom").fadeOut(1);
    $(".addSymptomBtn").removeClass("d-none");
    $(this).addClass("d-none");
});