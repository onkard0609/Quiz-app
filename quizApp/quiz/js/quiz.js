document.addEventListener("DOMContentLoaded", async () => {
    // Wait until Face API is loaded
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    

    console.log("✅ Face API is loaded!");
});

// Retrieving session storage data
var subject = sessionStorage.getItem("subject");
var brandCode = sessionStorage.getItem("brandCode");
var studentName = sessionStorage.getItem("name");
var address = sessionStorage.getItem("address");
var fatherName = sessionStorage.getItem("fatherName");
var enrollment = sessionStorage.getItem("enrollment");
var imgUrl = sessionStorage.getItem("imgUrl");
// Function to show a custom in-screen message instead of alert()
function showOnScreenMessage(message, duration = 3000) {
    let existingMessage = document.getElementById("onscreen-message");
    if (existingMessage) {
        existingMessage.innerText = message; // Update existing message
        return;
    }

    let msgBox = document.createElement("div");
    msgBox.id = "onscreen-message";
    msgBox.style.position = "fixed";
    msgBox.style.top = "15%";
    msgBox.style.left = "50%";
    msgBox.style.transform = "translateX(-50%)";
    msgBox.style.background = "rgba(0, 0, 0, 0.8)";
    msgBox.style.color = "white";
    msgBox.style.padding = "15px 25px";
    msgBox.style.borderRadius = "10px";
    msgBox.style.fontSize = "16px";
    msgBox.style.zIndex = "9999";
    msgBox.style.textAlign = "center";

    msgBox.innerText = message;
    document.body.appendChild(msgBox);

    // Auto-remove message after duration
    setTimeout(() => {
        if (msgBox) document.body.removeChild(msgBox);
    }, duration);
}


var allQuestion = [];
if (localStorage.getItem(brandCode + "_" + subject + "_question") != null) {
    allQuestion = JSON.parse(localStorage.getItem(brandCode + "_" + subject + "_question"));
    console.log(allQuestion);
}

var index = 0;
var total = allQuestion.length;
var right = 0;
var wrong = 0;
var allUserResult = [];
var particularUserResult = [];
var tabSwitchCount = 0;

let mainBox = document.querySelector(".main");
let navContainer = document.createElement("div");
navContainer.id = "question-nav";
navContainer.style.position = "fixed";
navContainer.style.bottom = "10px";
navContainer.style.left = "50%";
navContainer.style.transform = "translateX(-50%)";
navContainer.style.display = "flex";
navContainer.style.gap = "10px";
document.body.appendChild(navContainer);

var allOptionsEl = document.querySelectorAll(".option");
let questionEl = document.querySelector(".question-el");
var nextBtn = document.querySelector(".next-btn");

let examTimer, examTimeLeft;
let warningCount = 0;

// Function to get the current question
function getQuestionFunc() {
    updateNavigation();
    if (index >= total) {
        return endQuiz();
    }
    resetFunc();

    let data = allQuestion[index];
    questionEl.innerHTML = `Q-${index + 1} : ${data.question}`;
    allOptionsEl[0].nextElementSibling.innerText = data.optionOne;
    allOptionsEl[1].nextElementSibling.innerText = data.optionTwo;
    allOptionsEl[2].nextElementSibling.innerText = data.optionThree;
    allOptionsEl[3].nextElementSibling.innerText = data.optionFour;

    // Disable options if the question was already answered
    if (allQuestion[index].answered) {
        lockAnswers();
    }
}
getQuestionFunc();
createNavigation();
startExamTimer();

// Handling answer submission on "Next" button click

nextBtn.onclick = function () {
    let data = allQuestion[index];
    var ans = getAnswer();

    // Prevent moving forward without selecting an answer
    if (ans === undefined) {
        showOnScreenMessage("Please select an answer before proceeding.", 3000);
        return;
    }
    
    // Save the selected answer
    allQuestion[index].selectedAnswer = ans;

    // Prevent multiple submissions
    if (!allQuestion[index].answered) {
        // Check if the answer is correct
        if (ans.trim().toLowerCase() === String(data.correctAnswer).trim().toLowerCase()) {
            right++;
        } else {
            wrong++;
        }
    }

    // Mark question as answered
    allQuestion[index].answered = true;

    // Lock answers after submission
    lockAnswers();

    // Update navigation button color
    updateNavigation();

    // **Move to the next question only if it's not the last one**
    if (index < total - 1) {
        index++; // Move to the next question
        setTimeout(() => {
            getQuestionFunc(); // Load the next question after a small delay
        }, 300);
    } else {
        setTimeout(() => {
            endQuiz(); // If it's the last question, end the quiz
        }, 300);
    }
};



// Function to get the selected answer
const getAnswer = () => {
    var answer;
    allOptionsEl.forEach((input) => {
        if (input.checked) {
            answer = input.value;
        }
    });
    return answer;
};


// Reset function, but keeps answers locked if submitted
function resetFunc() {
    allOptionsEl.forEach((input) => {
        input.checked = false;  // Reset all options first
        input.disabled = allQuestion[index]?.answered || false;

        // Restore the previously selected answer
        if (allQuestion[index]?.selectedAnswer && input.value === allQuestion[index].selectedAnswer) {
            input.checked = true;
        }
    });
}

// Function to update the navigation buttons
function updateNavigation() {
    let buttons = navContainer.querySelectorAll("button");
    buttons.forEach((btn, i) => {
        btn.style.background = allQuestion[i]?.answered ? "lightblue" : "white";
    });
}

// Timer function
function startExamTimer() {
    examTimeLeft = total * 30; // 30 seconds per question
    let timerEl = document.getElementById("exam-timer");
    if (!timerEl) {
        timerEl = document.createElement("div");
        timerEl.id = "exam-timer";
        timerEl.style.position = "fixed";
        timerEl.style.top = "10px";
        timerEl.style.left = "50%";
        timerEl.style.transform = "translateX(-50%)";
        timerEl.style.padding = "10px";
        timerEl.style.background = "red";
        timerEl.style.color = "white";
        timerEl.style.fontSize = "18px";
        timerEl.style.fontWeight = "bold";
        document.body.appendChild(timerEl);
    }
    clearInterval(examTimer);
    timerEl.innerText = `Total Time Left: ${examTimeLeft}s`;
    examTimer = setInterval(() => {
        examTimeLeft--;
        timerEl.innerText = `Total Time Left: ${examTimeLeft}s`;
        if (examTimeLeft <= 0) {
            clearInterval(examTimer);
            showOnScreenMessage("Time's up! Submitting your exam.", 4000);
            setTimeout(endQuiz, 3000);
        }
    }, 1000);
    
}

// Create navigation buttons
function createNavigation() {
    for (let i = 0; i < total; i++) {
        let btn = document.createElement("button");
        btn.innerText = i + 1;
        btn.style.padding = "5px 10px";
        btn.style.cursor = "pointer";
        btn.onclick = function () {
            index = i;
            getQuestionFunc();
        };
        navContainer.appendChild(btn);
    }
}

// End quiz function
const endQuiz = () => {
    localStorage.setItem("testAttempted", "true"); // Save test attempt
    showOnScreenMessage("✅ Test submitted successfully!");
    mainBox.innerHTML = `
    <h2>Click On Submit button to complete your examination.<h2>
    <div align="center">
        <button class="btn btn-primary quiz-submit-btn">Submit</button>
    </div>
    `;
    submitFunc();
};

// Submit function
const submitFunc = () => {
    if (localStorage.getItem(brandCode + "_" + subject + "_result") != null) {
        allUserResult = JSON.parse(localStorage.getItem(brandCode + "_" + subject + "_result"));
    }
    if (localStorage.getItem(brandCode + "_" + enrollment + "_result") != null) {
        particularUserResult = JSON.parse(localStorage.getItem(brandCode + "_" + enrollment + "_result"));
    }
    var submitBtn = document.querySelector(".quiz-submit-btn");
    submitBtn.onclick = function () {
        allUserResultFunc();
        particularUserResultFunc();
        this.innerHTML = "Please Wait...";
        this.disabled = true;
    };
};

// Save results for all users
const allUserResultFunc = () => {
    allUserResult.push({
        name: studentName,
        enrollment: enrollment,
        rightAns: right,
        wrongAns: wrong,
        subject: subject,
        maxMark: total
    });
    localStorage.setItem(brandCode + "_" + subject + "_result", JSON.stringify(allUserResult));
    setTimeout(function () {
        sessionStorage.clear();
        window.location = "../homepage/homepage.html";
    }, 2000);
};

// Save results for the particular user
const particularUserResultFunc = () => {
    particularUserResult.push({
        name: studentName,
        fatherName: fatherName,
        enrollment: enrollment,
        subject: subject,
        rightAns: right,
        wrongAns: wrong,
        maxMarks: total,
        profilePic: imgUrl
    });
    localStorage.setItem(brandCode + "_" + enrollment + "_result", JSON.stringify(particularUserResult));
    setTimeout(function () {
        sessionStorage.clear();
        window.location = "../homepage/homepage.html";
    }, 2000);
};

// Proctoring Features
async function startCamera() {
    let cameraContainer = document.createElement('div');
    cameraContainer.style.position = 'fixed';
    cameraContainer.style.top = '10px';
    cameraContainer.style.right = '10px';
    cameraContainer.style.width = '150px';
    cameraContainer.style.height = '120px';
    cameraContainer.style.border = '2px solid black';
    cameraContainer.style.background = 'black';
    cameraContainer.style.zIndex = '9999';
    document.body.appendChild(cameraContainer);

    let videoEl = document.createElement('video');
    videoEl.style.width = '100%';
    videoEl.style.height = '100%';
    videoEl.autoplay = true;
    cameraContainer.appendChild(videoEl);

    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Camera access granted.");

                videoEl.srcObject = videoStream;
        // videoEl.style.display = "none"; // Now visible in the corner
        // document.body.appendChild(videoEl); // Already appended inside cameraContainer
        videoEl.play();

        videoStream.getVideoTracks()[0].addEventListener("ended", function () {
            showOnScreenMessage("Camera access lost! Your test is being submitted.", 4000);
            setTimeout(endQuiz, 3000);
        });
        
    } catch (error) {
        alert("Camera access is required to take the test.");
        console.error("Camera error:", error);
        endQuiz();
    }
}

function enableFullScreen() {
    let elem = document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    }
}

document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
        showOnScreenMessage("You cannot exit fullscreen during the test.", 4000);
        setTimeout(endQuiz, 3000);
    }
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        tabSwitchCount++;
        if (tabSwitchCount >= 2) {
            showOnScreenMessage("You switched tabs multiple times! Your test is being submitted.", 4000);
            setTimeout(endQuiz, 3000);
        }
    }
});

// Navigation Buttons
let navigationContainer = document.createElement("div");
navigationContainer.style.position = "fixed";
navigationContainer.style.bottom = "60px"; // Adjusted to move higher
navigationContainer.style.left = "50%";
navigationContainer.style.transform = "translateX(-50%)";
navigationContainer.style.display = "flex";
navigationContainer.style.gap = "20px";

// Previous Arrow Button (Renamed)
let prevArrowBtn = document.createElement("button");
prevArrowBtn.innerText = "← Prev";
prevArrowBtn.style.padding = "10px 20px";
prevArrowBtn.style.fontSize = "16px";
prevArrowBtn.style.cursor = "pointer";
prevArrowBtn.disabled = index === 0;
prevArrowBtn.onclick = function () {
    if (index > 0) {
        index--;
        getQuestionFunc();
        updateArrowButtons();
    }
};
navigationContainer.appendChild(prevArrowBtn);

// Next Arrow Button (Renamed)
let nextArrowBtn = document.createElement("button");
nextArrowBtn.innerText = "Next →";
nextArrowBtn.style.padding = "10px 20px";
nextArrowBtn.style.fontSize = "16px";
nextArrowBtn.style.cursor = "pointer";
nextArrowBtn.onclick = function () {
    if (index < total - 1) {
        index++;
        getQuestionFunc();
        updateArrowButtons();
    }
};
navigationContainer.appendChild(nextArrowBtn);

// Append Navigation to Body
document.body.appendChild(navigationContainer);

// Final Submission Button (Renamed)
let finalSubmitQuizBtn = document.createElement("button");
finalSubmitQuizBtn.innerText = "FINAL SUBMISSION";
finalSubmitQuizBtn.style.position = "fixed";
finalSubmitQuizBtn.style.bottom = "20px";
finalSubmitQuizBtn.style.right = "20px";
finalSubmitQuizBtn.style.padding = "12px 24px";
finalSubmitQuizBtn.style.fontSize = "18px";
finalSubmitQuizBtn.style.backgroundColor = "red";
finalSubmitQuizBtn.style.color = "white";
finalSubmitQuizBtn.style.border = "none";
finalSubmitQuizBtn.style.cursor = "pointer";
finalSubmitQuizBtn.onclick = showConfirmationPopup;
document.body.appendChild(finalSubmitQuizBtn);

function showConfirmationPopup() {
    // Prevent duplicate popups
    if (document.getElementById("confirmation-popup")) return;

    let popup = document.createElement("div");
    popup.id = "confirmation-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
    popup.style.textAlign = "center";
    popup.style.zIndex = "10000";

    popup.innerHTML = `
        <h3>Are you sure you want to submit?</h3>
        <p>Once submitted, you cannot change your answers.</p>
        <button id="confirm-submit" style="margin: 10px; padding: 10px 20px; background: green; color: white; border: none; cursor: pointer;">Yes, Submit</button>
        <button id="cancel-submit" style="margin: 10px; padding: 10px 20px; background: gray; color: white; border: none; cursor: pointer;">Cancel</button>
    `;

    document.body.appendChild(popup);

    // Confirm Submission
    document.getElementById("confirm-submit").onclick = function () {
        document.body.removeChild(popup);
        endQuiz();
    };

    // Cancel Submission
    document.getElementById("cancel-submit").onclick = function () {
        document.body.removeChild(popup);
    };
}

// Ensure Fullscreen Can't Be Exited Until Quiz Ends
document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
        alert("You cannot exit fullscreen during the test.");
        enableFullScreen();
    }
});
// Function to Update Button States
function updateArrowButtons() {
    prevArrowBtn.disabled = index === 0;
    nextArrowBtn.disabled = index === total - 1;
}

function issueWarning(message) {
    if (warningCount >= 3) return;

    warningCount++;
    showOnScreenMessage(`Warning ${warningCount}/3: ${message}`, 3000);

    if (warningCount >= 3) {
        showOnScreenMessage("Too many violations! Submitting quiz.", 3000);
        setTimeout(endQuiz(), 3000);
    }
}
let audioContext;
let analyser;
let microphone;
let javascriptNode;
let audiowarningCount = 0;
const maxWarnings = 3;
let lastAudioWarningTime = 0;
const audioCooldownTime = 3000; // 3 seconds cooldown between audio warnings
let audioWarningTriggered = false; // Flag to prevent multiple warnings per detection cycle

async function startAudioDetection() {
    //if (!checkTestAttempt()) return; // Prevent test if already attempted
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        microphone.connect(analyser);
        
        function detectNoise() {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
            const currentTime = Date.now();
            
            if (average > 40 && !audioWarningTriggered && currentTime - lastAudioWarningTime > audioCooldownTime) { // Adjust threshold as needed
                lastAudioWarningTime = currentTime; // Update last warning time
                audioWarningTriggered = true; // Set flag to prevent multiple warnings
                audiowarningCount++;
                showOnScreenMessage(`Warning ${audiowarningCount}: Background noise detected!`);
                
                if (audiowarningCount >= maxWarnings) {
                    showOnScreenMessage("Test submitted due to excessive noise!");
                    endQuiz();
                }
                
                setTimeout(() => {
                    audioWarningTriggered = false; // Reset flag after cooldown
                }, audioCooldownTime);
            }
            requestAnimationFrame(detectNoise);
        }
        detectNoise();
    } catch (error) {
        console.error("Error accessing microphone: ", error);
    }
}

function submitTest() {
    console.log("Submitting test...");
    // Add actual test submission logic here
}

function checkTestAttempt() {
    if (localStorage.getItem("testAttempted") === "true") {
        alert("⚠ You have already attempted the test. You cannot retake it.");
        setTimeout(() => {
            window.location.href = "../homepage/homepage.html"; // Redirect user
        }, 1000);
        return false;
    }
    return true;
}


// Load Face API & Start Detection
document.addEventListener("DOMContentLoaded", async () => {
    startEyeDetection();
});


document.addEventListener("DOMContentLoaded", function () {
    let overlay = document.createElement("div");
    overlay.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); color: white; display: flex; align-items: center; justify-content: center; z-index: 9999;";
    overlay.innerHTML = `
        <div style="text-align: center;">
            <h2>Please enter fullscreen mode and allow camera access to begin the test.</h2>
            <button id="start-test-btn" style="padding: 10px 20px; font-size: 16px;">Start Test</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("start-test-btn").addEventListener("click", function () {
        document.body.removeChild(overlay);
        enableFullScreen();
        startCamera();
        startAudioDetection();

    });
});
