const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  var password = document.getElementById("senha"); 
  var confirm_password = document.getElementById("novasenha"); 
  
  if (password.value !== confirm_password.value) {
    alert("Senhas digitadas são diferentes!");
  } else if (password.value.length < 6 || password.value.length > 8) {
    alert("A senha deve conter de 6 a 8 caracteres!");
  } else {
    form.submit();
  }
});
