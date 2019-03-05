var newAndEdit = {

    detailsAttrSet: function detailsAttrSet(){
        $("details").removeAttr("open");
        $("details")[0].setAttribute("open", "");
    },

    randomId: function randomId(){
        return Math.floor(Math.random()*999999999999999);
    },
    
    save: function save(ele, parent, activator, oldHtml, isDelAfter, column){
        var delBtnFunc = (isDelAfter) ? newAndEdit.delBtn() : "";
        activator.on("click", function(){
            if(ele.val()===""){
                ele.val("Boş olamaz");
            }
            parent.html(ele.val().remXss()+newAndEdit.editBtn()+delBtnFunc);
            newAndEdit.toggleForward(column);
        });
        ele.keydown(function(){
            if(event.which===27){
                parent.html(oldHtml);
                newAndEdit.toggleForward(column);
            }
        })
    },
    listen: {
        enterCardHeader: function enterCardHeader(ele, parent, oldDesc){
            ele.keydown(function(){
                if(event.which===13){
                    if(ele.val()==="" || ele.val()===" "){
                        ele.val("**Boş Kalamaz**");
                    }
                    parent.html('<p>'+ele.val().remXss()+' </p>');
                    newAndEdit.toggleForward(parent.parent().parent().parent());
                }
                if(event.which===27){
                    parent.html(oldDesc);
                    newAndEdit.toggleForward(parent.parent().parent().parent());
                }
            })
        },
        enterCardDesc: function enterCardDesc(headEle, descEle, parent, oldHtml){
            var f = function(){
                if(event.which===13){
                    parent.html('<span>'+headEle.val().remXss()+'</span><span class="content-sub-text">'+descEle.val().remXss()+'</span>'+newAndEdit.delBtn());
                    newAndEdit.toggleForward(parent.parent().parent().parent().parent());
                }
                if(event.which===27){
                    parent.html(oldHtml);
                    newAndEdit.toggleForward(parent.parent().parent().parent().parent());
                }
            }
            headEle.keydown(f);
            descEle.keydown(f);
        },
        enterImg: function enterImg(imgEle, descEle, parent, oldSrc, oldDesc){
            var f = function(){
                if(event.which===13){
                    parent.html('<img class="ui medium bordered image" alt="kart resim" srcset="'+imgEle.val().remXss()+'"><p>'+descEle.val().remXss()+' </p>');
                    newAndEdit.toggleForward(imgEle.parent().parent().parent());
                }
                if(event.which===27){
                    parent.html('<img class="ui medium bordered image" alt="kart resim" srcset="'+oldSrc+'"><p>'+oldDesc+'</p>');
                    newAndEdit.toggleForward(imgEle.parent().parent().parent());
                }
            }
            imgEle.keydown(f);
            descEle.keydown(f);
        }
    },

    delBtn: function delBtn(){
        return '<button class="delBtn">Sil</button>';
    },
    
    editBtn: function editBtn(){
        return '<button class="editBtn">Değiştir</button>';
    },
    
    saveBtn: function saveBtn(id){
        return '<button class="saveBtn" id="'+ id +'">Kaydet</button>';
    },
    
    toggleForward: function toggleForward(ele){
        ele.addClass("frontOfPageCover");
        $(".addRowBtn, .delBtn").addClass("d-none");
        $(".siteOverlay").addClass("pageCover");
        if($(".saveBtn").length===0 && $("input").length<2){
            $(".addRowBtn, .delBtn").removeClass("d-none");
            $(".siteOverlay").removeClass("pageCover");
            $(".wide.column").removeClass("frontOfPageCover");
            $(".toast-helper-gen").fadeOut(300);
        } else {
            $(".toast-helper-gen").fadeIn(300);
        }
    },
    
    refactorForDB: function refactorForDB(){
        $("").replaceAll(".editBtn, .delBtn, .addRowBtn");
    }
}