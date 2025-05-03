// changing passcode logic
const oldPasscodeInput = document.getElementById('oldPasscode');
const newPasscodeInput = document.getElementById('newPasscode');
const confirmPasscodeInput = document.getElementById('confirmPasscode');
const changePasscodeButton = document.querySelector("#changePasscodeBtn");

changePasscodeButton.addEventListener('click', (e) => {
  e.preventDefault();
  const oldPasscode = oldPasscodeInput.value.trim();
  const newPasscode = newPasscodeInput.value.trim();
  const confirmPasscode = confirmPasscodeInput.value.trim();
  
  if (newPasscode.length === 6) {
 if(oldPasscode===localStorage.getItem("passcode")){
   if (newPasscode === confirmPasscode) {
      // Change password logic here
      localStorage.setItem("passcode",confirmPasscode);
      fireToast("تم تغيير رمز المرور بنجاح!","تم  بنجاح¡","success");
      //reset inputs 
      oldPasscodeInput.value="";
      newPasscodeInput.value="";
      confirmPasscodeInput.value="";
    } else {
      fireToast('تأكد من تكرار رمز المرور بشكل صحيح!',"خطأ","error");
    }
 }else{
fireToast('تأكد من ادخال رمز الدخول القديم بشكل صحيح!',"خط'أ","error");
 }
    }else{
    fireToast('تأكد من ادخال البيانات بشكل صحيح!',"خطأ","error");
  }
});

// Listing Users and handling Deletion 
function renderUsersList()
{
  
  //
  let usersListTblBody=document.getElementById("usersListTblBody");
  // Remove previously generated rows
  usersListTblBody.querySelectorAll(".generatedUserRow").forEach((row)=>row.remove());
  if(usersList.length>0)
  {
    for(let i=0;i<usersList.length;i++)
    {
      let userTr=document.createElement("tr");
      let usernameTd=document.createElement("td");
      let userActionsTd=document.createElement("td");
      usernameTd.innerText=usersList[i];
      userActionsTd.innerHTML="<button class='btn btn-danger btn-sm' onClick='confirmDeleteUser(\""+usersList[i]+"\");'><i class='bi bi-trash-fill'></i></button>";
      
      userTr.appendChild(usernameTd);
      userTr.appendChild(userActionsTd);
      userTr.classList.add("generatedUserRow");
      usersListTblBody.appendChild(userTr);

      
    }
    usersListTblBody.querySelector("#usersListPlaceholder").style.display="none";
  }
  
}

//delete user logic
function confirmDeleteUser(user)
{
  
  if (usersList.length >1)
  {
    document.getElementById("confirmDelBtn").setAttribute('data-user',user);
     new bootstrap.Modal(document.getElementById('confirmDeleteUserModal')).show();
  }
  else
  {
      fireToast('لا يمكن حذف المستخدم الافتراضي!',"خطأ","error");
  }
 
}

function deleteUser()
{
  let user=document.getElementById("confirmDelBtn").getAttribute('data-user');
  
  if (usersList.length >1)
  {

  if(usersList.indexOf(user)!==-1)
  {
    
    let newUsersList=usersList;
    newUsersList.splice(newUsersList.indexOf(user),1);
    localStorage.setItem("usersList",JSON.stringify(newUsersList));
    renderUsersList();
  } 
     fireToast("تم تعديل قائمة المستخدمين بنجاح!","تم","success");
  }
  else
  {
      fireToast('لا يمكن حذف المستخدم الافتراضي!',"خطأ","error");
  }
}

function addUser(){
  const usernameInput = document.getElementById("usernameInput");
  let username = usernameInput.value.trim();
  if(usersList.indexOf(username)===-1)
  {
    let newUsersList=usersList;
    newUsersList.push(username);
    
    localStorage.setItem("usersList",JSON.stringify(newUsersList));

  }
  
  usernameInput.value="";
  renderUsersList();
  fireToast("تم تعديل قائمة المستخدمين بنجاح!","تم","success");

}

renderUsersList();
