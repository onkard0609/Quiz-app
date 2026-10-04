# Quizy – Secure Online Quiz Platform with Proctoring

Quizy is a secure web-based online quiz platform designed to conduct online examinations with integrated proctoring features.

The system provides student and admin functionality along with monitoring features to help maintain a fair testing environment.

## Features

### Proctoring Features

- **Camera Monitoring** – Checks whether the camera is active during the examination.
- **Microphone Noise Detection** – Monitors surrounding noise and provides warnings when the noise level exceeds the limit.
- **Tab-Switch Detection** – Detects attempts to switch tabs during the examination.
- **Single Attempt** – Prevents students from attempting the same test multiple times.
- **Time Limit** – Provides a time limit for each question.

### Quiz Features

- Multiple questions with time restrictions.
- Ability to skip and navigate between questions.
- Final submission after completing the quiz.
- Student and examination data management.
- Result management.

##💻 How to Run the Project Prerequisites: A web browser (Google Chrome or Firefox recommended) Node.js (if using server-side features) or any basic web server for serving the HTML, CSS, and JS files

Steps to Run:

Download the zip file and extract the folder.
Open the folder in VSCode.
Open Company.html with live server.
📝 Features Proctoring Features:

Camera Monitoring: Detects if the camera is on or off(If camera is not on then the test will be submitted).

Mic Noise Detection: Monitors ambient noise levels. If noise exceeds a threshold, a warning is given, and after three warnings, the quiz is automatically submitted.

Tab-Switch Tracking: Prevents users from switching tabs during the exam and monitors if the test window is tampered with.

Single attempt: Keeps track on the attempts Prevents multiple attempts.

Time limit: There is time limit of 30 sec for each question which will be calculated automatically and set.

Quiz Functionality:

Multi-question support with time restrictions.

Ability to skip questions and navigate between them.

A final submission button once all answers are completed.

## Technologies Used

### Frontend

- HTML5
- CSS3
- Bootstrap
- JavaScript

### Backend

- Node.js

### Database

- Browser Local Database

## Project Structure

- `common/` – Common CSS and JavaScript resources
- `company/` – Company/admin-related pages
- `dashboard/` – Dashboard pages and functionality
- `homepage/` – Homepage and related resources
- `models/` – Face detection model files
- `quiz/` – Quiz pages and functionality
- `welcome/` – Welcome page and related resources

## Team Members

This project was developed as a group project by:

- Prathamesh Kolhe
- Soham Jathar
- Bhavika Kadam
- Onkar Deshmukh

## Project Purpose

The main purpose of Quizy is to provide an online examination platform with proctoring features that help maintain a fair and secure testing environment.

## License

This project is licensed under the MIT License.
