
$(".container .grid").on("click", "details summary .editBtn" ,function(){
    var parent = $(this).parent(),
        oldHtml = parent.html(),
        uniqueId = randomId(),
        saveBtnId = randomId(),
        willAddDel = true;
    if(parent[0]===$("details summary")[0]){
        willAddDel = false;
    }
    parent.children("button").remove();
    parent.html('<input type="text" id='+ uniqueId +' value="'+ parent.text() + '"> <button class="saveBtn" id="'+ saveBtnId +'">Kaydet(ESC İptal)</button');
    save($("#"+uniqueId), parent, $("#"+saveBtnId), oldHtml, willAddDel);
});

$(".container .grid").on("click", "details summary .delBtn" ,function(){
    var objectToDel = $(this).parent().parent().parent();
    objectToDel.removeClass("twelve sixteen wide column");
    $("."+objectToDel[0].classList.value).remove();
})

$(".container .grid").on("click", "details p .editBtn" ,function(){
    var parent = $(this).parent(),
        oldHtml = parent.html(),
        height = parent.css("height"),
        uniqueId = randomId(),
        saveBtnId = randomId();
    parent.html('<textarea id='+uniqueId +'>'+ parent.text().replace($(this).text(), "") + '</textarea> <button class="saveBtn" id="'+ saveBtnId +'">Kaydet(ESC İptal)</button');
    $("#"+uniqueId).css("height", height);
    save($("#"+uniqueId), parent, $("#"+saveBtnId), oldHtml, false);
});

$(".container .grid").on("click", ".info-card .image-div img", function(){
    var parent = $(this).parent(),
        uniqueId = randomId(),
        oldSrc = $(this)[0].srcset;
    parent.html('<label>Image Link: '+'<input type="text" id="'+uniqueId+'" value="'+$(this)[0].srcset+'"></label>');
    listenEnter($("#"+uniqueId), parent, oldSrc)
});

$("#addDiv").on("click", {data: $(".select-form")}, 
    function(event){
        var newEleId = randomId(),
            grid = $(".ui.grid.stackable"),
            uniqueClass = randomId();
        switch(event.data.data[0].value){
            case "text":
                grid.html(grid.html()+'<div class="sixteen wide column '+ uniqueClass +'" id="'+ newEleId +'"><details class="details-animated"> <summary class="secondary-header">Başlık:'+editBtn()+delBtn()+'</summary><p class="details-child">Datayı buraya giriniz'+editBtn()+'</p></details>')
                break;
            case "imgText":
                grid.html(grid.html()+addImg(uniqueClass)+addText12(uniqueClass));
                break;
            case "textImg":
                grid.html(grid.html()+addText12(uniqueClass)+addImg(uniqueClass));
                break;
        }
        function addText12(uniqueClass){
            return '<div class="twelve wide column '+ uniqueClass +'"><details class="details-animated"> <summary class="secondary-header">Başlık:'+editBtn()+delBtn()+'</summary><p class="details-child">Datayı buraya giriniz'+editBtn()+'</p></details></div>';
        }
        function addImg(uniqueClass){
            return '<div class="four wide column '+ uniqueClass +'"><div class="image-div"><img src="/img/germ.jpg" alt="hastaliklar" class="ui huge bordered image details-child"><p>Image Info</p></div></div>';
        }
});

function randomId(){
    return Math.floor(Math.random()*999999999999999);
}

function save(ele, parent, activator, oldHtml, addDelAfter){
    var delBtnFunc = (addDelAfter) ? delBtn() : "";
    activator.on("click", function(){
        parent.html(ele.val());
        parent.html(parent.text()+editBtn()+delBtnFunc);
    });
    ele.keydown(function(){
        if(event.which===27){
            parent.html(oldHtml);
        }
    })
}

function listenEnter(ele, parent, oldSrc){
    ele.keydown(function(){
        if(event.which===13){
            parent.html(ele.val());
            parent.html('<img class="ui medium bordered image" alt="kart resim" srcset="'+parent.text()+'">');
        }
        if(event.which===27){
            parent.html('<img class="ui medium bordered image" alt="kart resim" srcset="'+oldSrc+'">');
        }
    });
}

function delBtn(){
    return '<button class="delBtn">Satırı Sil</button>';
}

function editBtn(){
    return '<button class="editBtn">Değiştir</button>';
}