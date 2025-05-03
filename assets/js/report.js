//Handling input form
const inputForm=document.getElementById('reportForm');
const reportContainer=document.getElementById("reportContainer");
inputForm.addEventListener('submit', (form) => {
  
  form.preventDefault();
  form.stopPropagation();
  
  //Validation and report rendering
  if(inputForm.checkValidity())
  {
    //removing previous errors and validation messages
    if(inputForm.classList.contains("was-validated"))
    {
      inputForm.classList.remove("was-validated");
    }
    
    //Generate and Render the report
   let reportData= generateReport(inputForm["startDate"].value,inputForm["endDate"].value);
   
   if(reportContainer.classList.contains("visually-hidden"))
   {
     
     reportContainer.classList.remove("visually-hidden");
   }
reportContainer.children[1].classList.add("visually-hidden");
reportContainer.children[0].classList.remove("visually-hidden");
   renderReport(reportData,inputForm["costPerGigabyte"].value);
   reportContainer.children[0].classList.add("visually-hidden");
reportContainer.children[1].classList.remove("visually-hidden");
   
  }
  else
  {
    if(!inputForm.classList.contains("was-validated"))
    {
      inputForm.classList.add("was-validated");
    }
  }
  
});



function validateReportDates(form=inputForm)
{
 
  let chkDatesIntegrity=compareDates(form["startDate"].value,form["endDate"].value);
  if(chkDatesIntegrity !== -1)
  {
    if(chkDatesIntegrity===1){
    inputForm.elements["endDate"].setCustomValidity("invalid");
    }
  }
  else{
    inputForm.elements["endDate"].setCustomValidity("");
  }
  
}

function generateReport(fromDate,toDate)
{
  //Collecting Usage Data
  let usersUsageTotalsAccumulated={};
let daysSummary=[];
var from = new Date(fromDate);
var to = new Date(toDate);

// loop for every day
for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
let dateSessionsStorageKey="S_"+(day.toISOString().slice(0,10)
).replaceAll("-","");
 if(!localStorage.getItem(dateSessionsStorageKey)){
  continue;
}else{
let dateSessions=JSON.parse(localStorage.getItem(dateSessionsStorageKey));

daysSummary.push({"date":day.toISOString().slice(0,10),"usage":dateSessions.usersUsageTotals,"unclosedSessions":dateSessions.unclosedSessions});
let dateUsers=Object.keys(dateSessions.usersUsageTotals);
for (i=0;i<dateUsers.length;i++)
{
    usersUsageTotalsAccumulated[dateUsers[i]]=usersUsageTotalsAccumulated.hasOwnProperty(dateUsers[i])?usersUsageTotalsAccumulated[dateUsers[i]]+dateSessions.usersUsageTotals[dateUsers[i]]:dateSessions.usersUsageTotals[dateUsers[i]];
}
}
    }
    
    //render the report
  return {"daysSummary":daysSummary,"usersUsageTotalsAccumulated":usersUsageTotalsAccumulated};
}


function renderReport(reportDataObject,costPerGigabyte)
{
// reset old report Data
resetReportData();
let usersUsageTotalsUsers=Object.keys(reportDataObject.usersUsageTotalsAccumulated);
if(usersUsageTotalsUsers.length>0)
{
let usersUsageTotalsUsages=Object.values(reportDataObject.usersUsageTotalsAccumulated);
 // Total Usage Summary
 let usageUsersRow=document.getElementById("usageUsersRow");
 
let usageRow=document.getElementById("usageRow");
let duesRow=document.getElementById("duesRow");
let noDataPlaceholders=document.querySelectorAll(".nodataPlaceholder");
let detailedTblHead=document.getElementById("detailedTblHead");
let detailedTblBody=document.getElementById("detailedTblBody");
let rangeTotal=0;
for(i=0;i<usersUsageTotalsUsages.length;i++)
{
  // Populating summary tables
let usageUserTd=document.createElement("td");
usageUserTd.classList.add("generated");
let usageTd=document.createElement("td");
usageTd.classList.add("generated");
let dueTd=document.createElement("td");
dueTd.classList.add("generated");
// ..........
rangeTotal+=usersUsageTotalsUsages[i];
 usageUserTd.innerText=usersUsageTotalsUsers[i];
usersUsageTotalsUsages[i]=(usersUsageTotalsUsages[i]/1000).toFixed(2);
 usageTd.innerText=usersUsageTotalsUsages[i];
 dueTd.innerText=(usersUsageTotalsUsages[i] * costPerGigabyte).toFixed(2);
 usageUsersRow.appendChild(usageUserTd);
 usageRow.appendChild(usageTd);
 duesRow.appendChild(dueTd);
}
rangeTotal=(rangeTotal/1000).toFixed(2);
let summaryTotalLabelTd=document.createElement("td");
summaryTotalLabelTd.classList.add("generated");
summaryTotalLabelTd.innerText="اجمالي";
let summaryTotalUsageTd=document.createElement("td");
summaryTotalUsageTd.classList.add("generated");
let summaryTotalDueTd=document.createElement("td");
summaryTotalDueTd.classList.add("generated");

summaryTotalUsageTd.innerText=rangeTotal;
summaryTotalDueTd.innerText=(rangeTotal * costPerGigabyte).toFixed(2);

summaryTotalDueTd.classList.add("bg-info-subtle");
summaryTotalUsageTd.classList.add("bg-info-subtle");
summaryTotalLabelTd.classList.add("bg-info-subtle");

usageUsersRow.appendChild(summaryTotalLabelTd);
usageRow.appendChild(summaryTotalUsageTd);
duesRow.appendChild(summaryTotalDueTd);

let commonChartOptions= {
            responsive: false,
            scaleBeginAtZero : true,
         };
 // Generating charts 
let userUsageSummaryChartData={
            labels: usersUsageTotalsUsers,
            datasets: [{
               label: "ملخص الإستهلاك",
               data:usersUsageTotalsUsages,
               backgroundColor:generateRGBColors(usersUsageTotalsUsers.length),
               hoverOffset: 5,
               rtl: true,
            }],
         };
         
  renderChart("usageChartCanvas","pie",userUsageSummaryChartData,commonChartOptions);
  //Render detailed tbl
    let usersThTr=document.createElement("tr");
    usersThTr.classList.add("generated");
    detailedTblHead.appendChild(usersThTr);
   let dayPlaceholderTd=document.createElement("td");
   
   usersThTr.appendChild(dayPlaceholderTd);
   //changing col span of main head td
   document.querySelector("#detailedTblHeadDetailsTd").setAttribute('colspan',usersUsageTotalsUsers.length+1);
    for(let i=0;i<usersUsageTotalsUsers.length;i++)
{
  let userTd=document.createElement("td");
  userTd.innerText=usersUsageTotalsUsers[i];
  usersThTr.appendChild(userTd);
}
var totalDayUsageTd=document.createElement("td");
totalDayUsageTd.innerText="الاجمالي (جيجابايت)";
usersThTr.appendChild(totalDayUsageTd);

for(let i=0;i<reportDataObject.daysSummary.length;i++)
{
  let dayDetailsTr=document.createElement("tr");
  dayDetailsTr.classList.add("generated");
  let dateTd=document.createElement("td");
  dateTd.innerText=reportDataObject.daysSummary[i].date;
  dayDetailsTr.appendChild(dateTd);
  
  for(let j=0;j<usersUsageTotalsUsers.length;j++)
  {
    let dayDetailsTd=document.createElement("td");
     dayDetailsTd.innerText=reportDataObject.daysSummary[i].usage[usersThTr.children[j+1].innerText]??"0";
     dayDetailsTr.appendChild(dayDetailsTd);
  }
  let dayTotalUsage=Object.values(reportDataObject.daysSummary[i].usage);
  dayTotalUsage=dayTotalUsage.reduce((accumulator, currentValue) => {
  return accumulator + currentValue
},0);

dayTotalUsage=(dayTotalUsage/1000).toFixed(2);

  let dayTotalTd=document.createElement("td");
  dayTotalTd.innerText=dayTotalUsage;
  dayDetailsTr.appendChild(dayTotalTd);
  if(reportDataObject.daysSummary[i].unclosedSessions){
    dayDetailsTr.classList.add("table-danger");
    dayDetailsTr.setAttribute("onClick","gotoDate(\""+reportDataObject.daysSummary[i].date+"\");");
    
  }
  detailedTblBody.appendChild(dayDetailsTr);
 
  }
let totalsTr=document.createElement("tr");
totalsTr.classList.add("generated");
totalsTr.classList.add("table-info");
let totalsLabelTd=document.createElement("td");
totalsLabelTd.innerText="اجماليات";
totalsTr.appendChild(totalsLabelTd);

for(let i=0;i<usersUsageTotalsUsers.length;i++)
{
  let usageTd=document.createElement("td");
  usageTd.innerText=usersUsageTotalsUsages[i];
  totalsTr.appendChild(usageTd);
}

let rangeTotalTd=document.createElement("td");
 rangeTotalTd.innerText=rangeTotal;
 totalsTr.appendChild(rangeTotalTd);
 detailedTblBody.appendChild(totalsTr);
 
noDataPlaceholders.forEach((element) => element.style.display="none");
}
}

function resetReportData()
{
  //ResetDetailedtablehead colspan
document.querySelector("#detailedTblHeadDetailsTd").setAttribute('colspan',1);

  //remove all generated Elements
let generatedElements=document.querySelectorAll(".generated");
generatedElements.forEach((element) => element.remove());

//Destroy chart
destroyChart("usageChartCanvas");
document.getElementById("usageChartCanvas").style.display="none";


//show Nodata Placeholders
let noDataPlaceholders=document.querySelectorAll(".nodataPlaceholder");
noDataPlaceholders.forEach((element) => element.style.display="table-cell");

}