const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  const password = document.getElementById("senha").value;

  if (password.length < 6 || password.length > 8) {
    event.preventDefault();
    alert("A senha deve conter de 6 a 8 dígitos!");
    return;
  }
  else{
    return true;
  }

});