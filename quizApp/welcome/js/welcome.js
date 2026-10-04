// Global variables
var selectSubjectEl = document.querySelector("#select-subject-el");
var startQuizBtn = document.querySelector(".start-quiz-btn");
var brandCcode = sessionStorage.getItem("brandCode");
var allSubject = [];

// Reading subjects from localStorage
if (localStorage.getItem(brandCcode + "_allSubject") !== null) {
    allSubject = JSON.parse(localStorage.getItem(brandCcode + "_allSubject"));
    allSubject.forEach((subject) => {
        selectSubjectEl.innerHTML += `<option>${subject.subjectName}</option>`;
    });
}

// Start Quiz button click event
startQuizBtn.onclick = function () {
    if (selectSubjectEl.value !== "choose subject") {
        var subject = selectSubjectEl.value;
        sessionStorage.setItem("subject", subject);
        
        // Create an overlay to ensure fullscreen entry before navigation
        let overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0, 0, 0, 0.9)";
        overlay.style.color = "white";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";
        overlay.innerHTML = `
            <div style="text-align: center;">
                <h2>Click the button below to enter fullscreen mode and start your test.</h2>
                <button id="enter-fullscreen" style="padding: 10px 20px; font-size: 16px;">Start Test</button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById("enter-fullscreen").addEventListener("click", function () {
            document.body.removeChild(overlay);
            let elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    console.log("Error enabling fullscreen: ", err);
                });
            } else if (elem.mozRequestFullScreen) { // Firefox
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Edge
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { // IE/Edge
                elem.msRequestFullscreen();
            }
            
            // Redirect to the quiz page after fullscreen
            setTimeout(() => {
                window.location = "../quiz/quiz.html";
            }, 500);
        });
    } else {
        swal("Select Subject !", "Please select a subject first!", "warning");
    }
};
