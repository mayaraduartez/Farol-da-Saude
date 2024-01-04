const form = document.getElementById("form-nova-senha");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  var password = document.getElementById("nova_senha"); 
  var confirm_password = document.getElementById("renova_senha"); 
  
  if (password.value !== confirm_password.value) {
    alert("Senhas digitadas são diferentes!");
  } else if (password.value.length < 6 || password.value.length > 8) {
    alert("A senha deve conter de 6 a 8 caracteres!");
  } else {
    form.submit();
  }
});
