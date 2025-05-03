//localStorage.clear();
// Initializing Basic App data on localStorage
if(localStorage.getItem("usersList")===null)
{
  let initUsersList=["DefaultUser"];
  localStorage.setItem("usersList",JSON.stringify(initUsersList));
}

// lock and default hash
if(localStorage.getItem("isLocked")===null)
{
  const hashedPasscode = "000000";//await crypto.subtle.digest('SHA-256', "000000");
   localStorage.setItem("passcode",false);
   localStorage.setItem("passcode",hashedPasscode);
}



//Retrieve app data

//Users List
const usersList=JSON.parse(localStorage.getItem("usersList"));
// App lock status
const isLocked=JSON.parse(localStorage.getItem("isLocked"))??false;

//Common functionalities

//handling app lock
if(isLocked)
{

let currentPageName = window.location.pathname.split('/').pop();
if (currentPageName!="lock.html")
{
  window.location.href = "lock.html";
}
}
//Getting Query String Parameters
const queryStringParams = new Proxy(new URLSearchParams(window.location.search),{
  get: (searchParams, prop) => searchParams.get(prop),
});

// compare dates helper 1 d1 > d2 / -1 d1 < d2 / 0 d1 = d2
const compareDates = (d1, d2) => {
  let date1 = new Date(d1).getTime();
  let date2 = new Date(d2).getTime();

  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
};

// Current Date essential for other included scripts
var currentDate= new Date();

var currentDateFormatted=currentDate.toISOString().slice(0,10);

// fireToast helper
function fireToast(msg='Watch out!',title='Info',type='info',position='topRight',timeout=3000)
{
let toast=VanillaToasts.create({
  title: title,
  text: msg,
  positionClass: position,
  timeout: timeout,
  type: type
     });
     //exit 
      return;
}

//isnumeric helper
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function generateRGBColors(numberOfColors=1){
  console.log(numberOfColors);
  if (numberOfColors >0)
  {
  generatedColors=[];
for (let colors=0;colors<numberOfColors;colors++)
{
  let color = "rgb(" ;
  for (i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 255);
   if (i!=2) color+=",";
  }
 generatedColors.push(color+")");
}
 return numberOfColors > 1 ? generatedColors : generatedColors[0];
}
return false;
}

function destroyChart(canvasId){
// JS - Destroy exiting Chart Instance to reuse <canvas> element
let chartStatus = Chart.getChart(canvasId); // <canvas> id
if (chartStatus != undefined) {
  chartStatus.destroy();
}
}

function renderChart(canvasId,chartType,chartData,chartOptions)
{
// JS - Destroy exiting Chart Instance to reuse <canvas> element
  destroyChart(canvasId);
 // render an new one
  return new Chart(document.getElementById(canvasId), {
         type: chartType,
         data: chartData,
         options: chartOptions,
      });
      
}

function gotoDate(targetDate)
{
   let newUrl = "index.html?date="+targetDate;
    window.location.href = newUrl;
}


