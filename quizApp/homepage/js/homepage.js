// start get brand code from locallstorage

var i;
var allBrandKey = [];
for (i = 0; i < localStorage.length; i++) {
    var allKeys = localStorage.key(i);
    if (allKeys.match("_brand")) {
        allBrandKey.push(
            allKeys.replace("_brand", "")
        );
    }
}

// create option coding for brandcode
var brandCodeEl = document.querySelector("#brand-code-el");
allBrandKey.forEach((code, index) => {
    brandCodeEl.innerHTML += `
    <option value="${code}">${code}</option>
    `;
})

// all global variable
var loginForm = document.querySelector(".login-form");
var allLoginInput = loginForm.querySelectorAll("input");
var loginBtn = loginForm.querySelector("button");
var brandCode;
var allUserData = [];
// start login coding
brandCodeEl.addEventListener('change', () => {
    if (brandCodeEl.value != "choose space code") 
        {
        sessionStorage.setItem("brandCode", brandCodeEl.value);
        allLoginInput[0].disabled = false;
        allLoginInput[1].disabled = false;
        loginBtn.disabled = false;
        brandCode = sessionStorage.getItem("brandCode");
        loginUserFun();
    } 
    else {
        allLoginInput[0].disabled = true;
        allLoginInput[1].disabled = true;
        loginBtn.disabled = true;
        swal("Please select brand !", "Please select brand code first !", "warning");
    }
});

const loginUserFun = () => {
    if (localStorage.getItem(brandCode + "_registrationData") != null) {
        allUserData = JSON.parse(localStorage.getItem(brandCode + "_registrationData"));
    }
    console.log(allUserData);
    loginForm.onsubmit = function (e) 
    {
        e.preventDefault();
        let checkEnroll = allUserData.find((data) => {
            return data.enrollment == allLoginInput[0].value;
        });
        console.log(checkEnroll)
        if (checkEnroll != undefined) {
            if (checkEnroll.password == allLoginInput[1].value) {
                if (checkEnroll.userType == "guide") {
                    sessionStorage.setItem("brandCode", brandCode);
                    window.location = "../dashboard/dashboard.html";
                }
                else {
                    sessionStorage.setItem("enrollment", checkEnroll.enrollment);
                    sessionStorage.setItem("name", checkEnroll.name);
                    sessionStorage.setItem("address", checkEnroll.address);
                    sessionStorage.setItem("fatherName", checkEnroll.fatherName);
                    sessionStorage.setItem("brandCode", brandCode);
                    sessionStorage.setItem("imgUrl", checkEnroll.profilePic);
                    window.location = "../welcome/welcome.html";
                }
            }
            else {
                swal("Wrong Password !", "Please Contact Your Guide !", "warning");
            }
        }
        else {
            swal("Wrong Id Number !", "Please Contact Your Guide !", "warning");
        }
        /* return false
        for(i=0;i<allUserData.length;i++){
            if(allUserData[i].enrollment == allLoginInput[0].value){
                if(allUserData[i].password == allLoginInput[1].value){
                    if(allUserData[i].userType == "guide"){
                        
                        return;
                    }else{
                        
                        return;
                    }
                    return;
                }else{
                    swal("Wrong Password !", "Please Contact Your Teacher !", "warning");
                    return;
                }
                return;
            }else{
                swal("Wrong Enrollment !", "Please Contact Your Teacher !", "warning");
            }
        } */
    }
}
