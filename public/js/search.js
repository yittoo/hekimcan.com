for(var i = 0; i < $(".search-header").length; i++){
    if(window.location.href.split("/")[5].replace("?", "").replace("%20", " ") === $(".search-header")[i].textContent.replace(" - ", "")){
        $(".top-result").html("<h2>En iyi sonuç:</h2>"+$(".result-item")[i].outerHTML);
    }
}

