var oldHtmlBeforeEdit = $(".grid").html();

document.querySelectorAll(".secondary-header").forEach(function(chosen){
    chosen.innerHTML += newAndEdit.editBtn() + newAndEdit.delBtn();
});

document.querySelector(".delBtn").outerHTML = "";

document.querySelectorAll(".details-child").forEach(function(chosen){
    chosen.innerHTML += newAndEdit.editBtn();
});

document.querySelectorAll(".content").forEach(function(chosen){
    chosen.innerHTML += '<button class="addRowBtn">Satır Ekle</button>';
});

document.querySelectorAll(".content-sub-header").forEach(function(chosen){
    chosen.innerHTML += newAndEdit.delBtn();
});


$("#submit-edit-btn").on("click", function(){
    newAndEdit.refactorForDB();
    var path = "/"+window.location.href.split("/")[3]+"/"+window.location.href.split("/")[4];
    var params = {
            name: $("#data-name").text().replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
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