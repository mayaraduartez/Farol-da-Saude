document.addEventListener('DOMContentLoaded', function() {
    var bonecoElement = document.querySelector('.boneco');
    var imcScore = parseFloat(bonecoElement.getAttribute('data-imc-score'));

    function updateIMCColor(imcScore) {
        var cabeca = document.getElementById("cabeca");
        var corpo = document.getElementById("corpo");
        var pernas = document.getElementById("pernas");

        if (imcScore>0 && imcScore <= 18.5) {
            cabeca.style.backgroundColor = "yellow";
            corpo.style.backgroundColor = "yellow";
            pernas.style.backgroundColor = "yellow";
        } else if (imcScore > 25.1) {
            cabeca.style.backgroundColor = "green";
            corpo.style.backgroundColor = "green";
            pernas.style.backgroundColor = "green";
        } else if (imcScore >= 25.1){
            cabeca.style.backgroundColor = "red";
            corpo.style.backgroundColor = "red";
            pernas.style.backgroundColor = "red";
        }
    }

    updateIMCColor(imcScore);
});
