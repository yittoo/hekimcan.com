String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

checkTopResult();
checkTopSymptoms();

function checkTopSymptoms(){
    var symptomArray = [{}],
    resultSymptom = $(".result-symptom");

    for(var i = 0; i<resultSymptom.length; i++){
        for(var j = 1; j<resultSymptom[i].children.length; j++){
            for(var k = 0; k<symptomArray.length; k++){
                if(symptomArray[k].name===resultSymptom[i].children[j].children[0].textContent){
                    symptomArray[k].likelihood += Number(resultSymptom[i].children[j].children[2].textContent);
                    break;
                } else if(k===symptomArray.length-1){
                    symptomArray.push({
                        name: resultSymptom[i].children[j].children[0].textContent,
                        likelihood: Number(resultSymptom[i].children[j].children[2].textContent),
                        link: resultSymptom[i].children[j].children[0].pathname,
                    });
                    break;
                }
            }
            if(j === resultSymptom[i].children.length-1 && i === resultSymptom.length-1 && symptomArray.length>1){
                var max,
                    indexOrder = [];
                for(var y = 1; y < symptomArray.length; y++){
                    max = {index: 0, value: 0};
                    for(var x = 1; x < symptomArray.length; x++){
                        if(symptomArray[x].likelihood >= max.value){
                            max.value = symptomArray[x].likelihood;
                            max.index = x;
                        }
                        if(x === symptomArray.length-1){
                            indexOrder.push(max.index);
                            symptomArray[max.index].newlikelihood = symptomArray[max.index].likelihood;
                            symptomArray[max.index].likelihood = -1;
                            break;
                        }
                    }
                    if(y === symptomArray.length-1){
                        $(".top-result").css("display", "block");
                        for(var z = 0; z < 3 && z < symptomArray.length; z++){
                            if(symptomArray[indexOrder[z]]){
                                var htmlToAdd = '<div class="pl-10px"><h3 class="symptom-header"><a href="'+ symptomArray[indexOrder[z]].link +'">'+symptomArray[indexOrder[z]].name+'</a> <a target="_blank" href="'+ symptomArray[indexOrder[z]].link +'"><i class="fas fa-external-link-alt external-link"></i></a></h3><p></p></div>';
                                $(".top-result")[0].innerHTML += htmlToAdd;
                            }
                        }
                    }
                }
            }
        }
    }
}








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
