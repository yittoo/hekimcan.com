
$(".container .grid").on("click", "details summary .editBtn", function(){
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

$(".container .grid").on("click", "details summary .delBtn", function(){
    var objectToDel = $(this).parent().parent().parent();
    objectToDel.removeClass("twelve sixteen wide column");
    $("."+objectToDel[0].classList.value).remove();
});

$(".container .grid").on("click", ".content .delBtn", function(){
    $(this).parent().parent().remove();
})

$(".container .grid").on("click", "details p .editBtn", function(){
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
        uniqueIdImg = randomId(),
        uniqueIdDesc = randomId(),
        oldSrc = parent.children("img")[0].srcset,
        oldDesc = parent.children("p").text(),
        column;
    if(parent.parent().hasClass("card")){
        column = parent.parent().parent();
    } else {
        column = parent.parent();
    }
    parent.html('<label>Resim Linki: <input type="text" id="'+uniqueIdImg+'" value="'+parent.children("img")[0].srcset+'"></label><label>Açıklama: <input type="text" id="'+uniqueIdDesc+'" value="'+parent.children("p").text()+'"></label>');
    toggleForward(column);
    listen.enterImg($("#"+uniqueIdImg), $("#"+uniqueIdDesc), parent, oldSrc, oldDesc)
});

$(".container .grid").on("click", ".content .header p", function(){
    var parent = $(this).parent(),
        uniqueId = randomId(),
        oldText = parent.html();
    parent.html('<label>Kart Başlığı: <input type="text" id="'+uniqueId+'" value="'+$(this).text()+'"></label>');
    toggleForward(parent.parent().parent().parent());
    listen.enterCardHeader($("#"+uniqueId), parent, oldText);
});

$(".container .grid").on("click", ".addRowBtn", function(){
    var parent = $(this).parent();
    parent.html(parent.html().replace('<button class="addRowBtn">Satır Ekle</button>', "") + '<div class="description"><p class="content-sub-header"><span>Değer</span><span class="content-sub-text">Değer Karşılığı</span>'+delBtn()+'</div><button class="addRowBtn">Satır Ekle</button>')
});

$(".container .grid").on("click", ".content .content-sub-header span", function(){
    var parent = $(this).parent(),
        oldHtml = parent.html()
        uniqueHeaderId = randomId(),
        uniqueDescId = randomId(),
        header = parent.children(":first-child"),
        desc = parent.children("span.content-sub-text");
    parent.html('<input type="text" class="w-50p" id="' + uniqueHeaderId + '" value="' + header.text() + '"><input type="text" class="w-50p" id="' + uniqueDescId + '" value="' + desc.text() + '">')
    toggleForward(parent.parent().parent().parent().parent());
    listen.enterCardDesc($("#"+uniqueHeaderId), $("#"+uniqueDescId), parent, oldHtml);
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
            case "cardText":
                grid.html(grid.html()+addCard(uniqueClass)+addText12(uniqueClass));
                break;
            case "textCard":
                grid.html(grid.html()+addText12(uniqueClass)+addCard(uniqueClass));
                break;
        }
        function addText12(uniqueClass){
            return '<div class="twelve wide column '+ uniqueClass +'"><details open class="details-animated"> <summary class="secondary-header">Başlık:'+editBtn()+delBtn()+'</summary><p class="details-child">Datayı buraya giriniz'+editBtn()+'</p></details></div>';
        }
        function addImg(uniqueClass){
            return '<div class="four wide column '+ uniqueClass +'"><div class="image-div"><img srcset="/img/germ.jpg" alt="hastaliklar" class="ui huge bordered image details-child"><p>Açıklama</p></div></div>';
        }
        function addCard(uniqueClass){
            return '<div class="four wide column '+uniqueClass+'"><div class="card info-card"><div class="image-div"><img class="ui medium bordered image" alt="kart resim" srcset="/img/germ.jpg"><p>Açıklama</p></div><div class="content"><div class="header"><p>Başlık</p></div><div class="description"><p class="content-sub-header"><span>Değer</span><span class="content-sub-text">Değer Karşılığı</span>'+delBtn()+'</p></div><button class="addRowBtn">Satır Ekle</button></div></div></div>';
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

var listen = {
    enterCardHeader: function(ele, parent, oldDesc){
        ele.keydown(function(){
            if(event.which===13){
                if(ele.val()==="" || ele.val()===" "){
                    ele.val("**Boş Kalamaz**");
                }
                parent.html('<p>'+ele.val()+'</p>');
                toggleForward(parent.parent().parent().parent());
            }
            if(event.which===27){
                parent.html(oldDesc);
            }
        })
    },
    enterCardDesc: function(headEle, descEle, parent, oldHtml){
        var f = function(){
            if(event.which===13){
                parent.html('<span>'+headEle.val()+'</span><span class="content-sub-text">'+descEle.val()+'</span>'+delBtn());
                toggleForward(parent.parent().parent().parent().parent());
            }
            if(event.which===27){
                parent.html(oldHtml);
                toggleForward(parent.parent().parent().parent().parent());
            }
        }
        headEle.keydown(f);
        descEle.keydown(f);
    },
    enterImg: function(imgEle, descEle, parent, oldSrc, oldDesc){
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
}

function delBtn(){
    return '<button class="delBtn">Sil</button>';
}

function editBtn(){
    return '<button class="editBtn">Değiştir</button>';
}

function saveBtn(id){
    return '<button class="saveBtn" id="'+ id +'">Kaydet(ESC İptal)</button>';
}

function toggleForward(ele){
    ele.addClass("frontOfPageCover");
    $(".addRowBtn, .delBtn").addClass("d-none");
    $(".siteOverlay").addClass("pageCover");
    if($(".saveBtn").length===0 && $("input").length<2){
        $(".addRowBtn, .delBtn").removeClass("d-none");
        $(".siteOverlay").removeClass("pageCover");
        $(".wide.column").removeClass("frontOfPageCover");
    }
}

String.prototype.encodeSpecial = function(){
    return this.replace("<", "%3C").replace(">", "%3E");
};