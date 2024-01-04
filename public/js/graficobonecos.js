//boneco depressao
document.addEventListener('DOMContentLoaded', function() {
    var depressaoScoreElement = document.querySelector('.resultado-bonecoA');
    var depressaoScore = parseInt(depressaoScoreElement.getAttribute('data-depressao-score'));

    function updateDepressaoColor(depressaoScore) {
        var cabecaDepressao = document.getElementById("idCabeçaDepressao");
        var corpoDepressao = document.getElementById("idCorpoDepressao");
        var pernasDepressao = document.getElementById("idPernasDepressao");

        if (depressaoScore >=0 &&  depressaoScore <= 9) {
            cabecaDepressao.style.backgroundColor = "green";
            corpoDepressao.style.backgroundColor = "green";
            pernasDepressao.style.backgroundColor = "green";
        } else if (depressaoScore >=10 && depressaoScore  < 20) {
            cabecaDepressao.style.backgroundColor = "yellow";
            corpoDepressao.style.backgroundColor = "yellow";
            pernasDepressao.style.backgroundColor = "yellow";
        } else if (depressaoScore >=20 && depressaoScore  <= 42) {
            cabecaDepressao.style.backgroundColor = "red";
            corpoDepressao.style.backgroundColor = "red";
            pernasDepressao.style.backgroundColor = "red";
        }
    }

    // Example usage:
    updateDepressaoColor(depressaoScore);
});

document.addEventListener('DOMContentLoaded', function() {
    var ansiedadeScoreElement = document.querySelector('.resultado-bonecoB');
    var ansiedadeScore = parseInt(ansiedadeScoreElement.getAttribute('data-ansiedade-score'));

    function updateAnsiedadeColor(ansiedadeScore) {
        var cabecaAnsiedade = document.getElementById("idCabeçaAnsiedade");
        var corpoAnsiedade = document.getElementById("idCorpoAnsiedade");
        var pernasAnsiedade = document.getElementById("idPernasAnsiedade");

        if (ansiedadeScore >= 0 && ansiedadeScore <= 6) {
            cabecaAnsiedade.style.backgroundColor = "green";
            corpoAnsiedade.style.backgroundColor = "green";
            pernasAnsiedade.style.backgroundColor = "green";
        } else if (ansiedadeScore >= 7 && ansiedadeScore < 14) {
            cabecaAnsiedade.style.backgroundColor = "yellow";
            corpoAnsiedade.style.backgroundColor = "yellow";
            pernasAnsiedade.style.backgroundColor = "yellow";
        } else if (ansiedadeScore >= 14 && ansiedadeScore <= 42) {
            cabecaAnsiedade.style.backgroundColor = "red";
            corpoAnsiedade.style.backgroundColor = "red";
            pernasAnsiedade.style.backgroundColor = "red";
        }
        
    }

    // Example usage:
    updateAnsiedadeColor(ansiedadeScore);
});

//boneco estresse
document.addEventListener('DOMContentLoaded', function() {
    var estresseScoreElement = document.querySelector('.resultado-bonecoC');
    var estresseScore = parseInt(estresseScoreElement.getAttribute('data-estresse-score'));

    function updateEstresseColor(estresseScore) {
        var cabecaEstresse = document.getElementById("idCabeçaEstresse");
        var corpoEstresse = document.getElementById("idCorpoEstresse");
        var pernasEstresse = document.getElementById("idPernasEstresse");

        if (estresseScore >=0 && estresseScore <= 10) {
            cabecaEstresse.style.backgroundColor = "green";
            corpoEstresse.style.backgroundColor = "green";
            pernasEstresse.style.backgroundColor = "green";
        } else if (estresseScore >=11 && estresseScore < 26) {
            cabecaEstresse.style.backgroundColor = "yellow";
            corpoEstresse.style.backgroundColor = "yellow";
            pernasEstresse.style.backgroundColor = "yellow";
        } else if (estresseScore >=26 && estresseScore <= 42) {
            cabecaEstresse.style.backgroundColor = "red";
            corpoEstresse.style.backgroundColor = "red";
            pernasEstresse.style.backgroundColor = "red";
        }
    }

    // Example usage:
    updateEstresseColor(estresseScore);
});
