const passwordToggle = document.querySelectorAll(".pw_hide");

// Function to (unHide & Hide) Password
passwordToggle.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});
/*---------------------------------------------------------------------------*/
// Log Ip Form Validation
let logInInputEmail = document.getElementById("logInInputEmail");
let logInInputPassword = document.getElementById("logInInputPassword");

let loginEmailError = document.getElementById("loginEmailError");
let loginPasswordError = document.getElementById("loginPasswordError");

let logInNowBtn = document.getElementById("logInNowBtn");
let regxEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let loginOutPutEmail;
let loginOutPutPassword;

// Log In Button Click Event
logInNowBtn.addEventListener("click", function (event) {
  loginValidation(event);
});

function loginValidation(e) {
  //Check Validation of Input E-Mail
  if (logInInputEmail.value == "") {
    e.preventDefault();
    loginEmailError.textContent = "This Field is Required";
    loginEmailError.style.visibility = "visible";
  } else if (regxEmail.test(logInInputEmail.value) === false) {
    e.preventDefault();
    loginEmailError.textContent = "Please Enter a Valid E-mail!!";
    loginEmailError.style.visibility = "visible";
  } else {
    loginEmailError.style.visibility = " hidden";
    loginOutPutEmail = logInInputEmail.value;
  }
  /*===========================================================================*/
  //Check Validation of Input Password
  if (logInInputPassword.value == "") {
    e.preventDefault();
    loginPasswordError.textContent = "This Field is Required";
    loginPasswordError.style.visibility = "visible";
  } else if (logInInputPassword.value.length < 8) {
    e.preventDefault();
    loginPasswordError.textContent = "Length should be more than or equal 8";
    loginPasswordError.style.visibility = "visible";
  } else {
    loginPasswordError.style.visibility = " hidden";
    loginOutPutPassword = logInInputPassword.value;
  }

  // If both email and password are valid
  if (loginOutPutEmail && loginOutPutPassword) {
    // Retrieve user data from localStorage
    let studentsData = localStorage.getItem("students");
    if (studentsData) {
      studentsData = JSON.parse(studentsData);

      // Check if the provided email and password match any user
      const user = studentsData.find(
        (student) =>
          student.email === loginOutPutEmail &&
          student.password === loginOutPutPassword
      );

      if (user) {
        if (user.tookExam) {
          // Redirect the user to the result page
          navigateToResult(loginOutPutEmail);
        } else {
          alert("Login Successfully");
          // Redirect the user to the exam page
          navigateToExam(loginOutPutEmail);
        }
        clearLoginInput();
      } else {
        loginPasswordError.textContent =
          "Invalid email or password. Please try again.";
        loginPasswordError.style.visibility = "visible";
      }
    }
  }
}
/*-----------------------------------------------------------------------------------*/
// Redirect the user to the Exam page
function navigateToExam(email) {
  window.location.replace(`exam.html?email=${email}`);
}
/*-----------------------------------------------------------------------------------*/
// Redirect the user to the Result page
function navigateToResult(email) {
  window.location.replace(`result.html?email=${email}`);
}
/*-----------------------------------------------------------------------------------*/
//Function to clear log in input
function clearLoginInput() {
  loginOutPutEmail = "";
  loginOutPutPassword = "";
  logInInputEmail.value = "";
  logInInputPassword.value = "";
  loginEmailError.style.visibility = " hidden";
  loginPasswordError.style.visibility = " hidden";
}
/*-----------------------------------------------------------------------------------*/
