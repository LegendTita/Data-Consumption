//Rendering Current Date 
var sessionsDateFormatted=queryStringParams.date??currentDateFormatted;

var dateSessionsStorageKey="S_"+sessionsDateFormatted.replaceAll("-","");



var currentDateSwitcher= document.getElementById("currentDateSwitcher");
var currentDateSwitcherDisplay=document.getElementById("currentDateSwitcherDisplay");


currentDateSwitcher.value=sessionsDateFormatted;
currentDateSwitcher.max=currentDateFormatted;

currentDateSwitcherDisplay.innerText=sessionsDateFormatted;
currentDateSwitcherDisplay.classList.remove("placeholder");


function showDatePicker()
{
  currentDateSwitcher.showPicker();
}

function goToDateByDifference(startingDate,daysDifference)
{
  var result = new Date(startingDate);
  result.setDate(result.getDate() + daysDifference);
   let newUrl = window.location.origin + window.location.pathname + "?date=" + result.toISOString().slice(0,10);
    window.location.href = newUrl;
}

if (currentDateFormatted===sessionsDateFormatted)
{
  document.getElementById("nextDateBtn").classList.add('disabled');
}
else
{
 document.getElementById("nextDateBtn").setAttribute('onclick','goToDateByDifference("'+sessionsDateFormatted+'",1)');
}
document.getElementById("previousDateBtn").setAttribute('onclick','goToDateByDifference("'+sessionsDateFormatted+'",-1)');

//Fetching Current Date Sessions Stats
if(!localStorage.getItem(dateSessionsStorageKey)){
  let usersUsageTotals={};
  for(i=0;i<usersList.length;i++)
  {
    usersUsageTotals[usersList[i]]=0;
  }
var dateSessions={"sessions":[],"usersUsageTotals":usersUsageTotals,unclosedSessions:false};
}else{
var dateSessions=JSON.parse(localStorage.getItem(dateSessionsStorageKey));
}

// Populating users selection section in add session modal
var addSessionUserSelector=document.getElementById("addSessionUserSelector");
for(i=0;i<usersList.length;i++)
{
  let option=document.createElement("option");
  option.value=usersList[i];
  option.innerText=usersList[i];
  addSessionUserSelector.appendChild(option);
}

//display total Consumbtiom  of the date
var totalConsumbtion=Object.values(dateSessions.usersUsageTotals).reduce((accumulator, currentValue) => {
  return accumulator + currentValue
},0);


document.getElementById("totalConsumbtion").innerText=totalConsumbtion;


// Render Sessions Table and Usage Totals
var sessionsTblBody=document.getElementById("sessionsTblBody");
var totalsUserRow=document.getElementById("totalsUserRow");
var totalsUsageRow=document.getElementById("totalsUsageRow");

var usersUsageTotalsUsers=Object.keys(dateSessions.usersUsageTotals);
var usersUsageTotalsUsages=Object.values(dateSessions.usersUsageTotals);
  //remove no data placeholders
  if (dateSessions.sessions.length!==0)
  {
    
    let sessionsTblNoDataRow=document.getElementById("sessionsTblNoDataRow");
    sessionsTblBody.removeChild(sessionsTblNoDataRow);
    if(usersUsageTotalsUsages[0]>0)
    {
    let totalsUsageNoDataCell=document.getElementById("totalsUsageNoDataCell");
    totalsUserRow.removeChild(totalsUsageNoDataCell);
    }
for(i=0;i<usersUsageTotalsUsers.length;i++)
{
  if (usersUsageTotalsUsages[i]>0)
  {
 let userTd=document.createElement("td");
 userTd.innerText=usersUsageTotalsUsers[i];
 let usageTd=document.createElement("td");
 usageTd.innerText=usersUsageTotalsUsages[i];
 totalsUserRow.appendChild(userTd);
 totalsUsageRow.appendChild(usageTd);
  }
}
  }
 


for(i=0;i<dateSessions.sessions.length;i++)
{
  //build the new row
  let row=document.createElement("tr");
    //validate row integrity
  if (currentDate.toISOString().slice(0,10) == sessionsDateFormatted && dateSessions.sessions[i].sessionEnd == 0 )
  {
    row.classList.add('table-warning');
  }else if(currentDate.toISOString().slice(0,10) != sessionsDateFormatted && dateSessions.sessions[i].sessionEnd == 0)  
  {
    row.classList.add('table-danger');
  }
  
  row.classList.add('table-secondary');
  
  let usersTD=document.createElement("td");
  usersTD.style.fontWeight="bolder";
  usersTD.innerText=dateSessions.sessions[i].user;
  row.appendChild(usersTD);
 
  let sessionStartTD=document.createElement("td");
  
  sessionStartTD.innerText=dateSessions.sessions[i].sessionStart;
  row.appendChild(sessionStartTD);  
  
  let sessionEndTD=document.createElement("td");
  sessionEndTD.innerText=dateSessions.sessions[i].sessionEnd;
  row.appendChild(sessionEndTD);
  
  let sessionUsageTD=document.createElement("td");
  sessionUsageTD.innerText=dateSessions.sessions[i].usage;
  sessionUsageTD.style.fontWeight="bolder";
  row.appendChild(sessionUsageTD);
  row.setAttribute("onclick","showNonEditableMsg();")
 sessionsTblBody.appendChild(row);
}

if (dateSessions.sessions.length!==0)
{
  //attach edit handler for last session
  sessionsTblBody.lastChild.setAttribute('onClick','showEditSessionModal();');
  if(sessionsTblBody.lastChild.classList.contains("table-secondary"))
  {
  sessionsTblBody.lastChild.classList.remove("table-secondary");
  sessionsTblBody.lastChild.classList.add("table-primary");
  }
}

function deleteSession()
{
  //Verify there're already some sessions to delete
  if (dateSessions.sessions.length === 0)
  {
    // prompt an error and exit 
      let toast=VanillaToasts.create({
  title: 'خطأ',
  text: 'حدث خطأ غير متوفع !',
  positionClass: 'topRight',
  timeout: 3000,
  type: 'error'
     });
     //exit 
      return;
  }
  //Proceed with delete process
  dateSessions.sessions.pop();
  //Refresh then sync
  refreshUsersUsageTotals();
  localStorage.setItem(dateSessionsStorageKey,JSON.stringify(dateSessions));
  localStorage.setItem('showSuccessMsg','show');
  //refresh UI
  location.reload();
}
// Show Add Session Modal
function showAddSessionModal()
{
  //check for opened session
  //last session
  let lastSession=dateSessions.sessions.slice(-1);

  if(lastSession.length!==0) 
  {
    lastSession=lastSession[0];
  
  //Prevent adding new session before terminating opend session
  if(lastSession.sessionEnd==0)
  {
// Render Error : Create a toast
  let toast=VanillaToasts.create({
  title: 'خطأ',
  text: 'يجب انهاء الجلسة السابقة قبل اضافة جلسة جديده!',
  positionClass: 'topRight',
  timeout: 3000,
  type: 'error'
     });
     //exit 
    return;
  }

    // Modify the new session starting value to match the last one ending value
    document.getElementById("addSessionStart").value=lastSession.sessionEnd;
  
  }


   //show the modal
   new bootstrap.Modal(document.getElementById('addSessionModal')).show();
}

// Adding Session handler
function addSession()
{
  //handle visuals
  document.getElementById("addSessionBtn").style.display="none";
  document.getElementById("addSessionLoadingBtn").style.display="block";  
  //handle logic
  let selectedUser=addSessionUserSelector.value;
  let sessionStart=document.getElementById("addSessionStart").value;
  let sessionEnd=document.getElementById("addSessionEnd").value;
  
  sessionStart=parseInt(sessionStart);
  sessionEnd=parseInt(sessionEnd);
  let validation=validateSessionData(sessionStart,sessionEnd);
  
if (validation===0)
{
  //handle adding session data
  let sessionId=generateId();
 
  dateSessions.sessions.push({'id':sessionId,'user':selectedUser,'sessionStart':sessionStart,'sessionEnd':sessionEnd,'usage':(sessionEnd-sessionStart)});
  refreshUsersUsageTotals();
  //sync
  localStorage.setItem(dateSessionsStorageKey,JSON.stringify(dateSessions));
  localStorage.setItem('showSuccessMsg','show');
  //refresh UI
  location.reload();
}else{
  let errorMsg=''
if (validation===1) errorMsg='مسموح فقط بادخال ارقام موجبة';
if(validation===2) errorMsg='يجب ادخال قيمة نهائية اكبر من البدائية او تساويها';
// Render Error : Create a toast
  let toast=VanillaToasts.create({
  title: 'خطأ',
  text: errorMsg,
  positionClass: 'topRight',
  timeout: 3000,
  type: 'error'
     });

}
//handle visuals
  document.getElementById("addSessionBtn").style.display="block";
  document.getElementById("addSessionLoadingBtn").style.display="none";  
}

//show edit session modal
function showEditSessionModal()
{
  //Retrieve LastSession data
 let selectedSession=dateSessions.sessions.slice(-1);

 if(selectedSession)
 {
   selectedSession=selectedSession[0];
   //populate the modal with the corresponding session data
   document.getElementById('editSessionUser').value=selectedSession.user;
   document.getElementById('editSessionStart').value=selectedSession.sessionStart;
   document.getElementById('editSessionEnd').value=selectedSession.sessionEnd;
   //show the modal
   new bootstrap.Modal(document.getElementById('editSessionModal')).show();
 }else{
   // Render Error : Create a toast
  let toast=VanillaToasts.create({
  title: 'خطأ',
  text: 'حدث خطأ غير متوقع!',
  positionClass: 'topRight',
  timeout: 3000,
  type: 'error'
     });

 }
}

// Adding Session handler
function editSession()
{
  //handle visuals
  document.getElementById("editSessionBtn").style.display="none";
  document.getElementById("editSessionLoadingBtn").style.display="block";
  //handle logic
  let sessionStart=document.getElementById("editSessionStart").value;
  let sessionEnd=document.getElementById("editSessionEnd").value;
  sessionStart=parseInt(sessionStart);
  sessionEnd=parseInt(sessionEnd);
  let validation=validateSessionData(sessionStart,sessionEnd);

if (validation===0)
{
  let editedSessionIndex=(dateSessions.sessions.length) - 1;
  //handle edit session data
 //Get the edited session index
 if(editedSessionIndex >=0)
 {
   dateSessions.sessions[editedSessionIndex].sessionEnd=sessionEnd;
   dateSessions.sessions[editedSessionIndex].usage=(sessionEnd-sessionStart);
   refreshUsersUsageTotals();
//sync
  localStorage.setItem(dateSessionsStorageKey,JSON.stringify(dateSessions));
  localStorage.setItem('showSuccessMsg','show');
  //refresh UI
  location.reload();
   
 }else{
   // Render Error : Create a toast
  let toast=VanillaToasts.create({
  title: 'خطأ',
  text: 'حدث خطأ غير متوقع!',
  positionClass: 'topRight',
  timeout: 3000,
  type: 'error'
     });

 }
  
}else{
  let errorMsg=''
if (validation===1) errorMsg='مسموح فقط بادخال ارقام موجبة';
if(validation===2) errorMsg='يجب ادخال قيمة نهائية اكبر من البدائية او تساويها';
// Render Error : Create a toast
  let toast=VanillaToasts.create({
  title: 'خطأ',
  text: errorMsg,
  positionClass: 'topRight',
  timeout: 3000,
  type: 'error'
     });

}
//handle visuals
  document.getElementById("editSessionBtn").style.display="block";
  document.getElementById("editSessionLoadingBtn").style.display="none";  
}

function refreshUsersUsageTotals()
{
  let unclosedSessionsFound=false;
  let usersUsage={};
  for(i=0;i<dateSessions.sessions.length;i++)
  {
    if (dateSessions.sessions[i].usage>=0)
    {
     if(usersUsage[dateSessions.sessions[i].user])
       {
      usersUsage[dateSessions.sessions[i].user]+=
      dateSessions.sessions[i].usage;
      continue;
    }
    usersUsage[dateSessions.sessions[i].user]=dateSessions.sessions[i].usage;
    }
    else{
      unclosedSessionsFound=true;
    }
  }
  
  //Sync
  dateSessions.usersUsageTotals=usersUsage;
  dateSessions.unclosedSessions=unclosedSessionsFound;
}

function generateId()
{
  let sessionId=new Date();
  sessionId=sessionId.toISOString();
  sessionId=sessionId.slice(0,10)+sessionId.slice(11,19);
  sessionId=sessionId.replaceAll('-','');
  sessionId=sessionId.replaceAll(':','');
  return sessionId;
}

function validateSessionData(sessionStart, sessionEnd)
{
    //Validate input
  if((!Number.isFinite(sessionStart)|| sessionStart < 0) || (!Number.isFinite(sessionEnd) || sessionEnd < 0 )) return 1;
  
   if(sessionEnd !=0 && sessionEnd<sessionStart) return 2;
   
  //Everything is just fine
  return 0;
}


//Show Success Msg
if (localStorage.getItem('showSuccessMsg')==='show')
{
window.addEventListener('DOMContentLoaded', function() {
      // Render Msg : Create a toast
   let toast = VanillaToasts.create({
  title: 'تم بنجاح',
  text: 'تمت العملية بنجاح',
  positionClass: 'topRight',
  timeout: 3000,
  type: 'success'
     });
});
localStorage.setItem('showSuccessMsg','hide');
}

function showNonEditableMsg()
{
let toast = VanillaToasts.create({
  title: 'تنبيه',
  text:'لا يمكن تعديل او حذف اي عنصر الا الاخير',
  positionClass: 'topRight',
  timeout: 2000,
  type: 'warning'
     });
 
}









//Rendering summary chart

//But first Check if all users usage totals aren't equal to zero
if (dateSessions.sessions.length>0 && usersUsageTotalsUsages[0] >0)
{
  
//Generating Random Colors for the chart
var chartColors=generateRGBColors(usersUsageTotalsUsages.length);
// hiding chart no data placeholde 
document.getElementById("chartNoData").style.display="none";
//display the canvas and render the chart
let chartCanvas = document.getElementById("chartCanvas");
chartCanvas.style.display="block"
let usageSummaryChart = new Chart(chartCanvas, {
         type: 'pie',
         data: {
            labels: usersUsageTotalsUsers,
            datasets: [{
               label: "ملخص الإستهلاك",
               data:usersUsageTotalsUsages,
               backgroundColor:chartColors,
               hoverOffset: 5,
               rtl: true,
            }],
         },
         options: {
            responsive: false,
            scaleBeginAtZero : true,
         },
      });
}
