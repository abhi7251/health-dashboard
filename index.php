<?php
require 'config.php';
?>
<!DOCTYPE html>
<html data-bs-theme="light" lang="en">


<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Health Dashboard</title>
    <link rel="icon" type="image/png" href="frontend/assets/img/logo.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="frontend/assets/css/utils.css">
    <link rel="stylesheet" href="frontend/assets/css/styles.css">
    <link rel="stylesheet" href="frontend/assets/css/dashboard.css">


</head>

<body style="height: fit-content;width: inherit;">
    <div class="text-center text-sm-center text-md-center text-lg-center text-xl-center text-xxl-center align-content-center mt-sm-0" id="main" style="text-align: center;">
        
    <nav class="navbar navbar-expand-md fixed-top bg-white bg-opacity-10 border rounded-0 py-2" 
    style="width: inherit; filter: blur(0px); backdrop-filter: opacity(1) blur(10px); -webkit-backdrop-filter: opacity(1) blur(10px);" id="navbar">
        <div class="container">
            
            <!-- Logo and Title -->
            <div class="d-flex align-items-center me-auto">
                <a class="navbar-brand d-flex align-items-center homeLink" href="#">
                    <img src="frontend/assets/img/logo.png" alt="Health Tracker Logo" style="height: 50px; margin-right: 10px;"> 
                    <h3 class="mb-0">Health Tracker</h3>
                

                </a>
            </div>

            <!-- Navbar Toggle Button for Mobile -->
            <button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1">
                <span class="visually-hidden">Toggle navigation</span>
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navbar Items -->
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link active homeLink" href="#" id="homeLink">Home</a></li>
                    <li class="nav-item"><a class="nav-link" id="activityLink" href="#">Activity</a></li>
                    <li class="nav-item"><a class="nav-link" id="aboutLink" href="#">About</a></li>
                </ul>

                <!-- Login and Link Buttons (Centered on Mobile, Right on Desktop) -->
                <div class="w-100 text-center text-md-end mt-2 mt-md-0">
                    <button class="btn btn-primary me-2" id="loginLink" type="button" 
                            style="color: white; display:none; background: var(--bs-dark); border-style: none; border-radius: 12px; padding: 6px 12px;">
                        Login / Register
                    </button>
                    <a id="linkLink" style="display:none;">
                    <button class="btn btn-warning m-2" type="button">
                        Link <i class="fa fa-arrow-right ps-0 ms-2" style="font-size: 20px;"></i>
                    </button>
                    </a>
                    <!-- Profile Icon with Dropdown -->
                    <div id="profileDropdownContainer" class="dropdown d-none">
                        <button class="btn btn-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" 
                                type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false" 
                                style="width: 40px; height: 40px; overflow: hidden; font-weight: bold; font-size: 1rem; background-color: #ffffff; border-style: none;">
                            <span id="profileInitial" class="text-white"></span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                            <li class="dropdown-item-text small" id="userUsername">username</li>
                            <li><hr class="dropdown-divider"></li>
                            <li class="dropdown-item-text fw-bold" id="userName">name</li>
                            <li class="dropdown-item-text text-muted small" id="userEmail">email</li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item text-dark" id="logoutButton">Logout</button></li>
                            <li><button class="dropdown-item text-danger" onclick="deleteUser()">Delete Account</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>

        

    <div  id="alertContainer">
        <div id="alertMessage" class="position-relative"></div>
    </div>
    
    <div id="content" style="text-align: center;height: fit-content;margin-top: 91px;">
        <div class="container mt-5 d-flex align-items-center justify-content-center">
            <div class="row w-100 d-flex align-items-center">
                <div class="col-md-6 d-flex justify-content-center">
                    <div id="watch" style="width: inherit; height: 300px;"></div>
                </div>
                <div class="col-md-6 text-center">
                    <h1 class="fs-2 fw-bold">Stay Fit, Stay Informed: Your Personal Health Monitor</h1>
                    <p>Track your health effortlessly with our smart health monitoring app. Keep an eye on vital signs, activity levels, and wellness trends—all in one place. Stay proactive about your well-being with real-time insights and personalized health recommendations.</p>
                </div>
            </div>
        </div>
        <div class="d-inline-flex align-items-center align-content-center">
            <div class="container text-white border rounded border-0 justify-content-center align-items-center align-content-center p-4 p-lg-5 py-4 py-xl-5 mt-sm-5 me-sm-4 ms-sm-4 ms-md-0 me-md-0" style="background: var(--bs-teal);">
                <div class="row mb-5">
                    <div class="col-md-8 col-xl-6 text-center mx-auto">
                        <h2 class="text-white">What you Can Track</h2>
                        <p class="w-lg-50">Our health monitoring app helps you stay on top of your wellness with real-time tracking of:<br><br></p>
                    </div>
                </div>
                <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-xl-3">
                    <div class="col align-self-center">
                        <div class="d-flex align-items-center">
                            <div class="bs-icon-sm bs-icon-rounded bs-icon-semi-white text-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon" style="background: var(--bs-success-bg-subtle);backdrop-filter: blur(0px);-webkit-backdrop-filter: blur(0px);border-radius: 12px;padding: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-person-walking" style="font-size: 40px;color: var(--bs-gray-700);">
                                    <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.75 1.75 0 0 1-.088.395l-.318.906.213.242a.75.75 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"></path>
                                    <path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.75.75 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843a1.93 1.93 0 0 0 .006-.067l1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"></path>
                                </svg></div>
                            <div class="px-3">
                                <h4 class="text-white">Steps Count</h4>
                                <p>Track your daily steps and movement goals. Stay motivated to achieve an active lifestyle.<br><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col align-self-center">
                        <div class="d-flex align-items-center">
                            <div class="bs-icon-sm bs-icon-rounded bs-icon-semi-white text-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon" style="background: var(--bs-success-bg-subtle);backdrop-filter: blur(0px);-webkit-backdrop-filter: blur(0px);border-radius: 12px;padding: 10px;"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor" style="width: 39px;height: 40px;color: var(--bs-gray-700);">
                                    <g>
                                        <rect fill="none" height="24" width="24"></rect>
                                    </g>
                                    <g>
                                        <g>
                                            <path d="M12,3c-4.8,0-9,3.86-9,9c0,2.12,0.74,4.07,1.97,5.61L3,19.59L4.41,21l1.97-1.97C7.93,20.26,9.88,21,12,21 c2.3,0,4.61-0.88,6.36-2.64C20.12,16.61,21,14.3,21,12l0-9L12,3z M15.83,12.26l-5.16,4.63c-0.16,0.15-0.41,0.14-0.56-0.01 c-0.14-0.14-0.16-0.36-0.04-0.52l2.44-3.33l-4.05-0.4c-0.44-0.04-0.63-0.59-0.3-0.89l5.16-4.63c0.16-0.15,0.41-0.14,0.56,0.01 c0.14,0.14,0.16,0.36,0.04,0.52l-2.44,3.33l4.05,0.4C15.98,11.41,16.16,11.96,15.83,12.26z"></path>
                                        </g>
                                    </g>
                                </svg></div>
                            <div class="px-3">
                                <h4 class="text-white">Calories Burned</h4>
                                <p>Monitor the energy you burn throughout the day. Helps with weight management and fitness planning.<br><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-flex align-items-center">
                            <div class="bs-icon-sm bs-icon-rounded bs-icon-semi-white text-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon" style="background: var(--bs-success-bg-subtle);backdrop-filter: blur(0px);-webkit-backdrop-filter: blur(0px);border-radius: 12px;padding: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-water" style="width: 39px;height: 40px;color: var(--bs-gray-700);">
                                    <path d="M.036 3.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 3.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 6.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 9.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65z"></path>
                                </svg></div>
                            <div class="px-3">
                                <h4 class="text-white">Water Intake</h4>
                                <p><br>Log your daily water consumption to stay hydrated. Get reminders to drink water and maintain optimal hydration.<br><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-flex align-items-center">
                            <div class="bs-icon-sm bs-icon-rounded bs-icon-semi-white text-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon" style="background: var(--bs-success-bg-subtle);backdrop-filter: blur(0px);-webkit-backdrop-filter: blur(0px);border-radius: 12px;padding: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-moon-stars" style="width: 39px;height: 40px;color: var(--bs-gray-700);">
                                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278M4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"></path>
                                    <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
                                </svg></div>
                            <div class="px-3">
                                <h4 class="text-white">Sleep Patterns</h4>
                                <p><br>Analyze your sleep duration and quality for better rest. Get insights on deep sleep, light sleep, and wake-up times.<br><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-flex align-items-center">
                            <div class="bs-icon-sm bs-icon-rounded bs-icon-semi-white text-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon" style="background: var(--bs-success-bg-subtle);backdrop-filter: blur(0px);-webkit-backdrop-filter: blur(0px);border-radius: 12px;padding: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-heart-fill" style="width: 39px;height: 40px;color: var(--bs-gray-700);">
                                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"></path>
                                </svg></div>
                            <div class="px-3">
                                <h4 class="text-white">Heart Rate</h4>
                                <p><br>Monitor your heart rate in real time to detect irregularities early. Keep track of your resting and active heart rate trends.<br><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-flex align-items-center">
                            <div class="bs-icon-sm bs-icon-rounded bs-icon-semi-white text-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon" style="background: var(--bs-success-bg-subtle);backdrop-filter: blur(0px);-webkit-backdrop-filter: blur(0px);border-radius: 12px;padding: 10px;"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor" style="width: 39px;height: 40px;color: var(--bs-gray-700);">
                                    <g>
                                        <rect fill="none" height="24" width="24"></rect>
                                    </g>
                                    <g>
                                        <g>
                                            <path d="M14,7h-4C8.9,7,8,7.9,8,9v6h2v7h4v-7h2V9C16,7.9,15.1,7,14,7z"></path>
                                            <circle cx="12" cy="4" r="2"></circle>
                                        </g>
                                    </g>
                                </svg></div>
                            <div class="px-3">
                                <h4 class="text-white">Weight Management</h4>
                                <p><br> Keep track of your weight and BMI trends. Set weight goals and monitor progress over time.<br><br></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <footer class="text-center bg-dark" id="footer">
        <div class="container text-white py-4 py-lg-5" style="height: 140px;">
            <ul class="list-inline">
                <li class="list-inline-item me-4"><a href="https://www.linkedin.com/in/raj-jaiswal-69a86b204/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-linkedin text-light" style="font-size: 26px;">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401m-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4"></path>
                        </svg></a></li>
                <li class="list-inline-item"><a href="https://github.com/rajjaiswal10" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-github text-light" style="font-size: 26px;">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8"></path>
                        </svg></a></li>
                <li class="list-inline-item"><a href="https://x.com/As98Ksj" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-twitter-x text-light" style="font-size: 26px;margin-left: 16px;">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"></path>
                        </svg></a></li>
            </ul>
            <p class="text-white mb-0">Created By Raj Jaiswal and Abhinav Saxena</p>
        </div>
    </footer>

    </div>
    <script>
    function fitbitLogout() {
        const logoutWindow = window.open("https://www.fitbit.com/logout", "_blank");
        setTimeout(() => {
            if (logoutWindow) {
                logoutWindow.close();
            }
        }, 1500);
    }
    document.addEventListener("DOMContentLoaded", function () {
        const linkError = <?php 
           $linkError = isset($_SESSION['linkError']) ? $_SESSION['linkError'] : null;
           unset($_SESSION['linkError']); // clear error once accessed
           echo json_encode($linkError); 
        ?>;
        if (linkError) {
        showAlert(linkError, "danger", 1000);
        setTimeout(() => {
            fitbitLogout();
        }, 1000); 
        
        }
    });
    </script>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" ></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js" ></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js" ></script>
    <script src="frontend/assets/js/animated.js" ></script>


    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    
    <script src="frontend/assets/js/dashboard.js?v=1.0.1"></script>
    <script src="frontend/assets/js/loader.js?v=1.0.1"></script>
    <script src="frontend/assets/js/nav.js?v=1.0.1"></script>
    <script src="frontend/assets/js/loginAndRegister.js?v=1.0.1"></script>
    <script src="frontend/assets/js/utils.js?v=1.0.1"></script>

</body>

</html>