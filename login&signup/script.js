const formOpenBtn = document.querySelector("#formOpen");
const formCloseBtn = document.querySelector("#formClose");
const signUpLink = document.querySelector("#signUpLink");
const logInLink = document.querySelector("#logInLink");
const passwordToggle = document.querySelectorAll(".pw_hide");

const home = document.querySelector(".home");
const formContainer = document.querySelector(".form_container");
/*-----------------------------------------------------------------------------------*/
formOpenBtn.addEventListener("click", function () {
  home.classList.add("show");
  formContainer.classList.add("active");
  formContainer.classList.remove("active");
});
/*-----------------------------------------------------------------------------------*/
formCloseBtn.addEventListener("click", function () {
  home.classList.remove("show");
  clearRegistrationInput();
  clearLoginInput();
});
/*-----------------------------------------------------------------------------------*/
signUpLink.addEventListener("click", function (e) {
  e.preventDefault();
  formContainer.classList.add("active");
  clearLoginInput();
});
/*-----------------------------------------------------------------------------------*/
logInLink.addEventListener("click", function (e) {
  e.preventDefault();
  formContainer.classList.remove("active");
  clearRegistrationInput();
});
/*-----------------------------------------------------------------------------------*/
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
/*-----------------------------------------------------------------------------------*/
// Sign Up Form Validation
let inputFName = document.getElementById("inputFName");
let inputLName = document.getElementById("inputLName");
let inputEmail = document.getElementById("inputEmail");
let inputPass = document.getElementById("inputPass");
let inputConfirmPass = document.getElementById("inputConfirmPass");

let RegistrationFNameError = document.getElementById("RegistrationFNameError");
let RegistrationLNameError = document.getElementById("RegistrationLNameError");
let RegistrationEmailError = document.getElementById("RegistrationEmailError");
let RegistPasswordError = document.getElementById("RegistPasswordError");
let RegistConfimPassError = document.getElementById("RegistConfimPassError");

let signUpNowBtn = document.getElementById("signUpNowBtn");
let resetBtn = document.getElementById("reset");

let regxName = /^[A-Za-z]+$/;
let regxEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let outPutFName;
let outPutLName;
let outPutEmail;
let outPutPassword;
let outPutConfirmPassword;
/*-----------------------------------------------------------------------------------*/
//local storage
function studentData(firstNameOut, lastNameOut, emailOut, passwordOut) {
  let StudentsData;
  if (localStorage.students !== null && localStorage.students !== undefined) {
    StudentsData = JSON.parse(localStorage.students);
  } else {
    StudentsData = [];
  }
  let newStudent = {
    firstName: firstNameOut,
    lastName: lastNameOut,
    email: emailOut,
    password: passwordOut,
    tookExam: false,
    result: 0,
  };
  StudentsData.push(newStudent);
  localStorage.setItem("students", JSON.stringify(StudentsData));
}
/*-----------------------------------------------------------------------------------*/
// Sign Up Btn
signUpNowBtn.addEventListener("click", function (event) {
  signUpValidation(event);
});
/*-----------------------------------------------------------------------------------*/
// Reset Btn
resetBtn.addEventListener("click", function () {
  clearRegistrationInput();
});
/*-----------------------------------------------------------------------------------*/
// Sign Up Validation of Input Data
function signUpValidation(e) {
  //Check Validation of Input First Name
  if (inputFName.value == "") {
    e.preventDefault();
    RegistrationFNameError.textContent = "This Field is Required";
    RegistrationFNameError.style.visibility = "visible";
  } else if (regxName.test(inputFName.value) === false) {
    e.preventDefault();
    RegistrationFNameError.textContent = "Please Enter a Valid Name!!";
    RegistrationFNameError.style.visibility = "visible";
  } else {
    RegistrationFNameError.style.visibility = " hidden";
    outPutFName = inputFName.value;
  }
  /*===========================================================================*/
  //Check Validation of Input Last Name
  if (inputLName.value == "") {
    e.preventDefault();
    RegistrationLNameError.textContent = "This Field is Required";
    RegistrationLNameError.style.visibility = "visible";
  } else if (regxName.test(inputLName.value) === false) {
    e.preventDefault();
    RegistrationLNameError.textContent = "Please Enter a Valid Name!!";
    RegistrationLNameError.style.visibility = "visible";
  } else {
    RegistrationLNameError.style.visibility = " hidden";
    outPutLName = inputLName.value;
  }
  /*===========================================================================*/
  //Check Validation of Input E-Mail
  if (inputEmail.value == "") {
    e.preventDefault();
    RegistrationEmailError.textContent = "This Field is Required";
    RegistrationEmailError.style.visibility = "visible";
  } else if (regxEmail.test(inputEmail.value) === false) {
    e.preventDefault();
    RegistrationEmailError.textContent = "Please Enter a Valid E-mail!!";
    RegistrationEmailError.style.visibility = "visible";
  } else if (checkEmailExists(inputEmail.value)) {
    e.preventDefault();
    RegistrationEmailError.textContent =
      "Email already exists. Please use a different email.";
    RegistrationEmailError.style.visibility = "visible";
  } else {
    RegistrationEmailError.style.visibility = " hidden";
    outPutEmail = inputEmail.value;
  }
  /*===========================================================================*/
  //Check Validation of Input Password
  if (inputPass.value == "") {
    e.preventDefault();
    RegistPasswordError.textContent = "This Field is Required";
    RegistPasswordError.style.visibility = "visible";
  } else if (inputPass.value.length < 8) {
    e.preventDefault();
    RegistPasswordError.textContent = "Length should be more than or equal 8";
    RegistPasswordError.style.visibility = "visible";
  } else {
    RegistPasswordError.style.visibility = " hidden";
    outPutPassword = inputPass.value;
  }
  /*===========================================================================*/
  //Check Validation of Confirmation Password
  if (inputConfirmPass.value == "") {
    e.preventDefault();
    RegistConfimPassError.textContent = "This Field is Required";
    RegistConfimPassError.style.visibility = "visible";
  } else if (inputConfirmPass.value !== outPutPassword) {
    e.preventDefault();
    RegistConfimPassError.textContent = "Not Match Password";
    RegistConfimPassError.style.visibility = "visible";
    inputConfirmPass.value = "";
  } else {
    RegistConfimPassError.style.visibility = " hidden";
    outPutConfirmPassword = inputConfirmPass.value;
  }
  /*===========================================================================*/
  if (
    outPutFName &&
    outPutLName &&
    outPutEmail &&
    outPutPassword &&
    outPutConfirmPassword
  ) {
    alert("Registration Was Successfully");
    // Save user data to localStorage
    studentData(outPutFName, outPutLName, outPutEmail, outPutPassword);
    // Redirect the user to the Log in page
    navigateToLogin();
    clearRegistrationInput();
  }
}

// Function to check if the email already exists in local storage
function checkEmailExists(email) {
  let studentsData = localStorage.getItem("students");

  if (studentsData) {
    studentsData = JSON.parse(studentsData);
    return studentsData.some((student) => student.email === email);
  }
  return false;
}
/*-----------------------------------------------------------------------------------*/
// Log In Form Validation
let logInInputEmail = document.getElementById("logInInputEmail");
let logInInputPassword = document.getElementById("logInInputPassword");
let loginEmailError = document.getElementById("loginEmailError");
let loginPasswordError = document.getElementById("loginPasswordError");
let logInNowBtn = document.getElementById("logInNowBtn");
let loginOutPutEmail;
let loginOutPutPassword;

/*-----------------------------------------------------------------------------------*/
// Log In Button
logInNowBtn.addEventListener("click", function (event) {
  loginValidation(event);
});
/*-----------------------------------------------------------------------------------*/
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
  // window.history.replaceState(null, "", `exam.html?email=${userEmail}`);
}
/*-----------------------------------------------------------------------------------*/
// Redirect the user to the Result page
function navigateToResult(email) {
  window.location.replace(`result.html?email=${email}`);
  // window.history.replaceState(null, "", `exam.html?email=${userEmail}`);
}
/*-----------------------------------------------------------------------------------*/
// Redirect the user to the Log in page
function navigateToLogin() {
  window.location.replace(`login.html`);
  // window.history.replaceState(null, "", `exam.html?email=${userEmail}`);
}

/*-----------------------------------------------------------------------------------*/
//Function to clear Registration input
function clearRegistrationInput() {
  inputFName.value = "";
  inputLName.value = "";
  inputEmail.value = "";
  inputPass.value = "";
  inputConfirmPass.value = "";
  outPutFName = "";
  outPutLName = "";
  outPutEmail = "";
  outPutPassword = "";
  outPutConfirmPassword = "";
  RegistrationFNameError.style.visibility = " hidden";
  RegistrationLNameError.style.visibility = " hidden";
  RegistrationEmailError.style.visibility = " hidden";
  RegistPasswordError.style.visibility = " hidden";
  RegistConfimPassError.style.visibility = " hidden";
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
