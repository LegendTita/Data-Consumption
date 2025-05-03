//Locking Toggle
if(!isLocked)
{
  localStorage.setItem("isLocked",true);
}
//Handling input form
const inputForm=document.getElementById('login');
inputForm.addEventListener('submit', (form) => {
  
  form.preventDefault();
  form.stopPropagation();
//removing previous errors and validation messages
    inputForm.elements["passcode"].setCustomValidity("");
    if(inputForm.classList.contains("was-validated"))
    {
      inputForm.classList.remove("was-validated");
    }

  //Validation and authenticate
  if(auth(inputForm["passcode"].value))
  {
    doLogin();
  }
  else
  {
    if(!inputForm.classList.contains("was-validated"))
    {
      inputForm.classList.add("was-validated");
    }
  }
  
});



function auth(passcode)
{

 
  if(passcode === localStorage.getItem("passcode"))
  {
     return true;
  }
  else
  {
    inputForm.elements["passcode"].setCustomValidity("invalid");
  }
  
  return false;
  
}

function doLogin()
{
  localStorage.setItem("isLocked",false);
  window.location.href = "index.html";
}