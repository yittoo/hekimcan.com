$("#revert-old-btn").on("click", function(){
    var path = "/"+window.location.href.split("/")[3]+"/"+window.location.href.split("/")[4];
    var params = {
            name: $("#data-name")[0].textContent.replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
            image: $(".image")[0].srcset,
            description: $("details p")[0].textContent,
            beforeEdit: oldHtmlBeforeEdit, 
            htmlCode: $(".grid.stackable").html(),
            htmlAsText: $(".grid.stackable").text().replace("\\r", " ").replace("\\n", " ")
        }
    put(path + "?_method=PUT", params);
});


function put(path, params) { 
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

$("#current-main-content").html(createElementFromHTML($("#current-main-content").text()))

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

var oldHtmlBeforeEdit = $("#current-main-content .grid.ui.stackable")[0].innerHTML;