newAndEdit.detailsAttrSet();

$(".container .grid").on("click", "details summary .editBtn", function(){
    var parent = $(this).parent(),
        column = parent.parent().parent();
        oldHtml = parent.html(),
        uniqueId = newAndEdit.randomId(),
        saveBtnId = newAndEdit.randomId(),
        willAddDel = true;
    if(parent[0]===$("details summary")[0]){
        willAddDel = false;
    }
    parent.children("button").remove();
    parent.html('<input type="text" id='+ uniqueId +' value="'+ parent.text() + '">'+newAndEdit.saveBtn(saveBtnId));
    newAndEdit.toggleForward(column);
    newAndEdit.save($("#"+uniqueId), parent, $("#"+saveBtnId), oldHtml, willAddDel, column);
});

$(".container .grid").on("click", "details summary .delBtn", function(){
    var objectToDel = $(this).parent().parent().parent();
    objectToDel.removeClass("twelve sixteen wide column");
    $("."+objectToDel[0].classList.value).remove();
});

$(".container .grid").on("click", ".content .delBtn", function(){
    $(this).parent().parent().remove();
});

$(".container .grid").on("click", "details p .editBtn", function(){
    var parent = $(this).parent(),
        column = parent.parent().parent(),
        oldHtml = parent.html(),
        height = parent.css("height"),
        uniqueId = newAndEdit.randomId(),
        saveBtnId = newAndEdit.randomId();
    parent.html('<textarea id='+uniqueId +'>'+ parent.text().replace($(this).text(), "") + '</textarea>'+newAndEdit.saveBtn(saveBtnId));
    $("#"+uniqueId).css("height", height);
    newAndEdit.toggleForward(column);
    newAndEdit.save($("#"+uniqueId), parent, $("#"+saveBtnId), oldHtml, false, column);
});

$(".container .grid").on("click", ".image-div img, .image-div p", function(){
    var parent = $(this).parent(),
        uniqueIdImg = newAndEdit.randomId(),
        uniqueIdDesc = newAndEdit.randomId(),
        oldSrc = parent.children("img")[0].srcset,
        oldDesc = parent.children("p").text(),
        column;
    if(parent.parent().hasClass("card")){
        column = parent.parent().parent();
    } else {
        column = parent.parent();
    }
    parent.html('<label>Resim Linki: <input type="text" id="'+uniqueIdImg+'" value="'+parent.children("img")[0].srcset+'"></label><label>Açıklama: <input type="text" id="'+uniqueIdDesc+'" value="'+parent.children("p").text()+'"></label>');
    newAndEdit.toggleForward(column);
    newAndEdit.listen.enterImg($("#"+uniqueIdImg), $("#"+uniqueIdDesc), parent, oldSrc, oldDesc)
});

$(".container .grid").on("click", ".content .header p", function(){
    var parent = $(this).parent(),
        uniqueId = newAndEdit.randomId(),
        oldText = parent.html();
    parent.html('<label>Kart Başlığı: <input type="text" id="'+uniqueId+'" value="'+$(this).text()+'"></label>');
    newAndEdit.toggleForward(parent.parent().parent().parent());
    newAndEdit.listen.enterCardHeader($("#"+uniqueId), parent, oldText);
});

$(".container .grid").on("click", ".addRowBtn", function(){
    var parent = $(this).parent();
    parent.html(parent.html().replace('<button class="addRowBtn">Satır Ekle</button>', "") + '<div class="description"><p class="content-sub-header"><span>Değer</span><span class="content-sub-text">Değer Karşılığı</span>'+newAndEdit.delBtn()+'</div><button class="addRowBtn">Satır Ekle</button>')
});

$(".container .grid").on("click", ".content .content-sub-header span", function(){
    var parent = $(this).parent(),
        oldHtml = parent.html()
        uniqueHeaderId = newAndEdit.randomId(),
        uniqueDescId = newAndEdit.randomId(),
        header = parent.children(":first-child"),
        desc = parent.children("span.content-sub-text");
    parent.html('<input type="text" class="w-50p" id="' + uniqueHeaderId + '" value="' + header.text() + '"><input type="text" class="w-50p" id="' + uniqueDescId + '" value="' + desc.text() + '">')
    newAndEdit.toggleForward(parent.parent().parent().parent().parent());
    newAndEdit.listen.enterCardDesc($("#"+uniqueHeaderId), $("#"+uniqueDescId), parent, oldHtml);
});

$("#addDiv").on("click", {data: $(".select-form")}, 
    function(event){
        var newEleId = newAndEdit.randomId(),
            grid = $(".ui.grid.stackable"),
            uniqueClass = newAndEdit.randomId();
        switch(event.data.data[0].value){
            case "text":
                grid.html(grid.html()+'<div class="sixteen wide column '+ uniqueClass +'" id="'+ newEleId +'"><details open class="details-animated"> <summary class="secondary-header">Başlık:'+newAndEdit.editBtn()+newAndEdit.delBtn()+'</summary><p class="details-child">Datayı buraya giriniz'+newAndEdit.editBtn()+'</p></details>')
                break;
            case "imgText":
                grid.html(grid.html()+addImg(uniqueClass)+addText12(uniqueClass));
                break;
            case "textImg":
                grid.html(grid.html()+addText12(uniqueClass)+addImg(uniqueClass));
                break;
            case "cardText":
                grid.html(grid.html()+addCard(uniqueClass)+addText12(uniqueClass));
                break;
            case "textCard":
                grid.html(grid.html()+addText12(uniqueClass)+addCard(uniqueClass));
                break;
        }
        checkFooter();
        function addText12(uniqueClass){
            return '<div class="twelve wide column '+ uniqueClass +'"><details open class="details-animated"> <summary class="secondary-header">Başlık:'+newAndEdit.editBtn()+newAndEdit.delBtn()+'</summary><p class="details-child">Datayı buraya giriniz'+newAndEdit.editBtn()+'</p></details></div>';
        }
        function addImg(uniqueClass){
            return '<div class="four wide column '+ uniqueClass +'"><div class="image-div"><img srcset="/img/germ.jpg" alt="hastaliklar" class="ui huge bordered image details-child"><p>Açıklama</p></div></div>';
        }
        function addCard(uniqueClass){
            return '<div class="four wide column '+uniqueClass+'"><div class="card info-card"><div class="image-div"><img class="ui huge bordered image" alt="kart resim" srcset="/img/germ.jpg"><p>Açıklama</p></div><div class="content"><div class="header"><p>Başlık</p></div><div class="description"><p class="content-sub-header"><span>Değer</span><span class="content-sub-text">Değer Karşılığı</span>'+newAndEdit.delBtn()+'</p></div><button class="addRowBtn">Satır Ekle</button></div></div></div>';
        }
});

$("#submit-btn").on("click", function(){
    newAndEdit.refactorForDB();
    if(window.location.href.split("/")[3]==="hastaliklar"){
        var path = "/hastaliklar";
    } else if(window.location.href.split("/")[3]==="ilaclar"){
        var path = "/ilaclar";
    } else if(window.location.href.split("/")[3]==="haberler"){
        var path = "/haberler";
    }
    console.log(path);
    var params = {
            name: $("#data-name").text().replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
            image: $(".image")[0].srcset,
            description: $("details p")[0].textContent,
            htmlCode: $(".grid.stackable").html(),
            htmlAsText: $(".grid.stackable").text().replace("\\r", " ").replace("\\n", " ")
        }
    post(path, params, "POST");
});

String.prototype.remXss = function(){
    return this.replace("<script>", "").replace("</script>", "");
};

function post(path, params, method) {
    method = method || "post"; 
    var form = document.createElement("form");
    form.setAttribute("method", method);
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