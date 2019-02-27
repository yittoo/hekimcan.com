
String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

checkTopResult();

function checkTopResult(){
    var searchedText = window.location.href.split("/")[5].replace("?", "").replaceAll("%20", " ").toLowerCase(),
        repeatCount = $(".search-header").length,
        currentResult;

    searchedText = convertTrToReadable(searchedText);

    for(var i = 0; i < repeatCount; i++){
        currentResult= $(".results > .result-item .search-header")[i].textContent.toLowerCase();
        if(searchedText === currentResult){
            $(".top-result").css("display", "block");
            $(".top-result")[0].innerHTML = '<h2>En iyi sonuç:</h2>'+$(".results > .result-item")[i].outerHTML;
            $(".results > .result-item").removeClass("d-none");
            $(".results > .result-item")[i].classList.add("d-none");
            break;
        } else if(currentResult.includes(searchedText)){
            $(".top-result").css("display", "block");
            $(".top-result")[0].innerHTML += $(".results > .result-item")[i].outerHTML;
            $(".results > .result-item")[i].classList.add("d-none");
        }
    }
}

function convertTrToReadable(str){
    return str.replaceAll("%c4%b1", "ı").replaceAll("%c4%b0", "İ").replaceAll("%c4%9f", "ğ").replaceAll("%c4%9e", "Ğ").replaceAll("%c3%b6", "ö").replaceAll("%c3%96", "Ö").replaceAll("%c3%bc", "ü").replaceAll("%c3%9c", "Ü").replaceAll("%c5%9f", "ş").replaceAll("%c5%9e", "Ş").replaceAll("%c3%a7", "ç").replaceAll("%c3%87", "Ç");
}
