







$("details summary").on("click", ".editBtn" ,function(){
    var parent = $(this).parent(),
        uniqueId = randomId(),
        saveBtnId = randomId();
    parent.html('<input type="text" id='+ uniqueId +' value="'+ parent.text().replace($(this).text(), "") + '"> <button class="saveBtn" id="'+ saveBtnId +'">Kaydet</button');
    save($("#"+uniqueId), parent, $("#"+saveBtnId));
});

$("details p").on("click", ".editBtn" ,function(){
    var parent = $(this).parent(),
        height = parent.css("height"),
        uniqueId = randomId(),
        saveBtnId = randomId();
    parent.html('<textarea id='+uniqueId +'>'+ parent.text().replace($(this).text(), "") + '</textarea> <button class="saveBtn" id="'+ saveBtnId +'">Kaydet</button');
    $("#"+uniqueId).css("height", height);
    save($("#"+uniqueId), parent, $("#"+saveBtnId));
});

$("#addDiv").on("click", {data: $(".select-form")}, 
    function(event){
        function sizeSelect(){
            switch(event.data.data[1].value){
                case "1quarter":
                    console.log("1çeyrek");
                    break;
                case "2quarter":
                    console.log("2çeyrek");
                    break;
                case "3quarter":
                    console.log("3çeyrek");
                    break;
                case "4quarter":
                    console.log("4çeyrek");
                    break;
            }
        }
        switch(event.data.data[0].value){
            case "text":
                console.log("text");
                sizeSelect();
                break;
            case "image":
                console.log("image");
                sizeSelect();
                break;
        }
});


function randomId(){
    return Math.floor(Math.random()*999999999999999);
}

function save(ele, parent, activator){
    activator.on("click", function(){
        parent.html(ele.val());
        parent.html(parent.text() +'<button class="editBtn">Değiştir</button>');
    })
}
