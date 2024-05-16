// Selecting elements by their IDs
let messHeader = document.getElementById("usermess");
let userNameDiv = document.getElementById("userName");
let userResultDiv = document.getElementById("userResult");
let userGradeDiv = document.getElementById("userGrade");
let backGroundImg = document.getElementById("backgroundimg");
let logOutBtn = document.getElementById("logOut");

// get student data
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
let studentsData = JSON.parse(localStorage.students);
let currentstudent = studentsData.find((obj) => obj["email"] === email);

if (currentstudent.result > 5) {
  messHeader.textContent = "Congratulations";
  messHeader.style.color = "green";
  userNameDiv.textContent = `${currentstudent.firstName}  ${currentstudent.lastName}`;
  userResultDiv.textContent = `Result : ${currentstudent.result}/10`;
  userResultDiv.style.color = "green";
  userGradeDiv.textContent = `Grade : ${(currentstudent.result / 10) * 100}%`;
  userGradeDiv.style.color = "green";
} else if (currentstudent.result <= 5) {
  messHeader.textContent = "Sorry!!";
  messHeader.style.color = "red";
  userNameDiv.textContent = `${currentstudent.firstName}  ${currentstudent.lastName}`;
  userResultDiv.textContent = `Result : ${currentstudent.result}/10`;
  userResultDiv.style.color = "red";
  userGradeDiv.textContent = `Grade : ${(currentstudent.result / 10) * 100}%`;
  userGradeDiv.style.color = "red";
  backGroundImg.src = "./result/result2.png";
}
/*---------------------------------------------------------------------------*/
logOutBtn.addEventListener("click", function () {
  navigatToHome();
});
/*---------------------------------------------------------------------------*/
// Redirect the user to the Home page
function navigatToHome() {
  window.location.replace(`index.html`);
}
/*---------------------------------------------------------------------------*/
