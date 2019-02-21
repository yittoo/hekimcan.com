
$(".container .grid").on("click", "details summary .editBtn" ,function(){
    var parent = $(this).parent(),
        column = parent.parent().parent();
        oldHtml = parent.html(),
        uniqueId = randomId(),
        saveBtnId = randomId(),
        willAddDel = true;
    if(parent[0]===$("details summary")[0]){
        willAddDel = false;
    }
    parent.children("button").remove();
    parent.html('<input type="text" id='+ uniqueId +' value="'+ parent.text() + '">'+saveBtn(saveBtnId));
    toggleForward(column);
    save($("#"+uniqueId), parent, $("#"+saveBtnId), oldHtml, willAddDel, column);
});

$(".container .grid").on("click", "details summary .delBtn" ,function(){
    var objectToDel = $(this).parent().parent().parent();
    objectToDel.removeClass("twelve sixteen wide column");
    $("."+objectToDel[0].classList.value).remove();
})

$(".container .grid").on("click", "details p .editBtn" ,function(){
    var parent = $(this).parent(),
        column = parent.parent().parent(),
        oldHtml = parent.html(),
        height = parent.css("height"),
        uniqueId = randomId(),
        saveBtnId = randomId();
    parent.html('<textarea id='+uniqueId +'>'+ parent.text().replace($(this).text(), "") + '</textarea>'+saveBtn(saveBtnId));
    $("#"+uniqueId).css("height", height);
    toggleForward(column);
    save($("#"+uniqueId), parent, $("#"+saveBtnId), oldHtml, false, column);
});

$(".container .grid").on("click", ".image-div img, .image-div p", function(){
    var parent = $(this).parent(),
        column = parent.parent().parent(),
        uniqueIdImg = randomId(),
        uniqueIdDesc = randomId(),
        oldSrc = parent.children("img")[0].srcset,
        oldDesc = parent.children("p").text();
    parent.html('<label>Image Link: <input type="text" id="'+uniqueIdImg+'" value="'+parent.children("img")[0].srcset+'"></label><label>Description: <input type="text" id="'+uniqueIdDesc+'" value="'+parent.children("p").text()+'"></label>');
    toggleForward(column);
    listenEnter($("#"+uniqueIdImg), $("#"+uniqueIdDesc), parent, oldSrc, oldDesc)
});

$("#addDiv").on("click", {data: $(".select-form")}, 
    function(event){
        var newEleId = randomId(),
            grid = $(".ui.grid.stackable"),
            uniqueClass = randomId();
        switch(event.data.data[0].value){
            case "text":
                grid.html(grid.html()+'<div class="sixteen wide column '+ uniqueClass +'" id="'+ newEleId +'"><details open class="details-animated"> <summary class="secondary-header">Başlık:'+editBtn()+delBtn()+'</summary><p class="details-child">Datayı buraya giriniz'+editBtn()+'</p></details>')
                break;
            case "imgText":
                grid.html(grid.html()+addImg(uniqueClass)+addText12(uniqueClass));
                break;
            case "textImg":
                grid.html(grid.html()+addText12(uniqueClass)+addImg(uniqueClass));
                break;
        }
        function addText12(uniqueClass){
            return '<div class="twelve wide column '+ uniqueClass +'"><details open class="details-animated"> <summary class="secondary-header">Başlık:'+editBtn()+delBtn()+'</summary><p class="details-child">Datayı buraya giriniz'+editBtn()+'</p></details></div>';
        }
        function addImg(uniqueClass){
            return '<div class="four wide column '+ uniqueClass +'"><div class="image-div"><img srcset="/img/germ.jpg" alt="hastaliklar" class="ui huge bordered image details-child"><p>Image Info</p></div></div>';
        }
});

function randomId(){
    return Math.floor(Math.random()*999999999999999);
}

function save(ele, parent, activator, oldHtml, isDelAfter, column){
    var delBtnFunc = (isDelAfter) ? delBtn() : "";
    activator.on("click", function(){
        parent.html(ele.val());
        parent.html(parent.text()+editBtn()+delBtnFunc);
        toggleForward(column);
    });
    ele.keydown(function(){
        if(event.which===27){
            parent.html(oldHtml);
            toggleForward(column);
        }
    })
}

function listenEnter(imgEle, descEle, parent, oldSrc, oldDesc){
    var f = function(){
        if(event.which===13){
            parent.html('<img class="ui medium bordered image" alt="kart resim" srcset="'+imgEle.val()+'"><p>'+descEle.val()+'</p>');
            toggleForward(imgEle.parent().parent().parent());
        }
        if(event.which===27){
            parent.html('<img class="ui medium bordered image" alt="kart resim" srcset="'+oldSrc+'"><p>'+oldDesc+'</p>');
            toggleForward(imgEle.parent().parent().parent());
        }
    }
    imgEle.keydown(f);
    descEle.keydown(f);
}

function delBtn(){
    return '<button class="delBtn">Satırı Sil</button>';
}

function editBtn(){
    return '<button class="editBtn">Değiştir</button>';
}

function saveBtn(id){
    return '<button class="saveBtn" id="'+ id +'">Kaydet(ESC İptal)</button>';
}

function toggleForward(ele){
    ele.addClass("frontOfPageCover");
    $(".siteOverlay").addClass("pageCover");
    if($(".saveBtn").length===0 && $("label").length===0){
        $(".siteOverlay").removeClass("pageCover");
        $(".wide.column").removeClass("frontOfPageCover");
    }
}