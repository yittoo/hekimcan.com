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
    $(this).addClass("d-none");
})