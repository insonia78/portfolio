<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
    <title>SpiderSmart - Login</title>
    <link rel="shortcut icon" href="/assets/img/favicon.ico" />
    <link rel="stylesheet" href="https://www.spidersmart.com/css/global.css" type="text/css">
    <style type="text/css">
        html, body{
            font-size: 100% !important;
        }

        #login_form_wrapper{
            display: block;
            width: 90%;
            position: static;
            margin: 1rem auto;
        }

        #login_form_wrapper > .error,
        #login_form_wrapper > .success {
            opacity: 0;
            cursor: pointer;
            position: absolute;
            margin: 0 auto;
            left: 0;
            right: 0;
            top: 10px;
            z-index: 100;
            border: 2px #966 solid;
            border-radius: 5px;
            background: #c66;
            width: 80%;
            padding: 2rem 5px;
            font: normal 1.6rem/1.4 montserratsemibold, "Trebuchet MS", Helvetica, sans-serif;
            color: #f7f7f7;
            text-align: center;
            transition: opacity 0.2s linear;
        }
        #login_form_wrapper > .success {
            background: #6c6;
            border: 2px #696 solid;
        }
        #login_form_wrapper > .error.active,
        #login_form_wrapper > .success.active {
            opacity: 1;
        }

        #login_form_wrapper > .body-form > .form-row > .floating-label > input,
        #login_form_wrapper > .body-form > .form-row > .floating-label > select{
            width: 92%;
        }
        #login_form_wrapper > .body-form > .form-row > .floating-label > input:disabled {
            border: 0 none;
            background: none;
        }
        #login_form_wrapper > .body-form > .form-row > .floating-label > label{
            left: 2rem;
        }

        #login_form_wrapper .reset-form {
            display: none;
        }

        @media (min-width: 1025px) {
            html, body{
                font-size: 62.5% !important;
            }

            #login_form_wrapper{
                width: 500px;
                position: relative;
            }

            #login_form_wrapper > .error,
            #login_form_wrapper > .success {
                width: 100%;
                top: -80px;
             }

            #login_form_wrapper > .body-form > .form-row > .floating-label > input {
                width: 100%;
            }
            #login_form_wrapper > .body-form > .form-row > .floating-label > label{
                left: 0.5rem;
            }
        }
    </style>
</head>
<body>
<main>
    <a href="<?=env('MAIN_SITE_URL')?>" id="logo"><img src="https://www.spidersmart.com/img/logo.png" alt="SpiderSmart" style="width:165px; height: 90px; display: block; margin: 1rem auto 0"></a>
    <h1>Login</h1>
    <div id="login_form_wrapper">
        <div class="error" id="responseError">
            The username or password provided were incorrect.
        </div>
        <div class="error" id="passwordChangeNotice">
            You must reset your password before continuing.  Please reset it using the form below.
        </div>
        <div class="error" id="passwordChangeDuplicateError">
            The passwords entered did not match, please check and re-enter them.
        </div>
        <div class="success" id="passwordChangeSuccess">
            Your new password was set successfully!  Please try to login again using your new password.
        </div>
        <div class="success" id="loginSuccessNoRedirect">
            You are now logged in!  Please continue to the
            <a href="http<?=(env('APP_SSL') == true) ? 's' : '';?>://admin.<?=env('APP_DOMAIN');?>">Administration Panel</a>
            or
            <a href="http<?=(env('APP_SSL') == true) ? 's' : '';?>://student.<?=env('APP_DOMAIN');?>">Student Panel</a>
        </div>

        <form id="loginForm" method="post" action="#" class="body-form">
            <div class="form-row">
                <div class="floating-label">
                    <input type="text" placeholder="" id="username" name="username" value="" />
                    <label for="username">Username</label>
                </div>
            </div>
            <div class="form-row login-form">
                <div class="floating-label">
                    <input type="password" placeholder="" id="password" name="password" value="" />
                    <label for="password">Password</label>
                </div>
            </div>
            <div class="form-row reset-form">
                <div class="floating-label">
                    <input type="password" placeholder="" id="newPassword" name="newPassword" value="" />
                    <label for="newPassword">New Password</label>
                </div>
            </div>
            <div class="form-row">
                <div class="floating-label reset-form">
                    <input type="password" placeholder="" id="confirmNewPassword" name="confirmNewPassword" value="" />
                    <label for="confirmNewPassword">Confirm New Password</label>
                </div>
            </div>
            <div class="form-buttons" style="text-align: center">
                <a href="<?=env('MAIN_SITE_URL')?>" class="btn tertiary">Return to Site</a>
                <button class="btn primary" type="submit" id="submitButton">Login</button>
            </div>
        </form>
    </div>
</main>
<script type="text/javascript">
    document.getElementById('loginForm').onsubmit = function() {
        // define data from form
        const data = {
            "grant_type":"password",
            "client_id":"<?=env('AUTH_CLIENT_ID')?>",
            "client_secret":"<?=env('AUTH_CLIENT_SECRET')?>",
            "scope":"<?=env('AUTH_CLIENT_SCOPE')?>",
            "username": document.getElementById('username').value.trim(),
            "password": document.getElementById('password').value.trim(),
            "newPassword": document.getElementById('newPassword').value.trim(),
            "confirmNewPassword": document.getElementById('confirmNewPassword').value.trim(),
        };

        // convert data into param format for post request
        const params = Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

        // reference login form elements
        const loginFormFields = document.getElementsByClassName('login-form');
        const resetFormFields = document.getElementsByClassName('reset-form');

        const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', 'oauth/token');
        xhr.onreadystatechange = function() {
            // remove active state of response messages
            document.getElementById('responseError').classList.remove('active');
            document.getElementById('passwordChangeNotice').classList.remove('active');
            document.getElementById('passwordChangeDuplicateError').classList.remove('active');
            document.getElementById('passwordChangeSuccess').classList.remove('active');
            document.getElementById('loginSuccessNoRedirect').classList.remove('active');

            if (xhr.readyState>3 && xhr.status==200) {
                // login was successful, set the token to the cookie and redirect
                const response = JSON.parse(xhr.response);
                if (response.hasOwnProperty('access_token')) {
                    document.cookie = 'auth=' + response.access_token + ';domain=.<?=env('APP_DOMAIN')?>';

                    // redirect based on the landing page
                    try {
                        const landingPage = JSON.parse(atob(response.access_token.split('.')[1])).landingPage;
                        window.location = 'http<?=(env('APP_SSL') == true) ? 's' : '';?>://' + landingPage + '.<?=env('APP_DOMAIN');?>';
                    } catch (error) {
                        // logged in successfully, but couldn't determine where to route, hide all form fields
                        for (let i = 0; i < loginFormFields.length; i++) {
                            loginFormFields[i].style.display = 'none';
                        }
                        for (let i = 0; i < resetFormFields.length; i++) {
                            resetFormFields[i].style.display = 'none';
                        }
                        document.getElementById('loginSuccessNoRedirect').classList.add('active');
                    }
                }
            } else if (xhr.status == 409) {
                document.getElementById('passwordChangeNotice').classList.add('active');
                document.getElementById('username').disabled = true;
                document.getElementById('submitButton').innerText = "Update Password";

                // 409 requires change by user to continue, for now this is only for password reset
                for (let i = 0; i < loginFormFields.length; i++) {
                    loginFormFields[i].style.display = 'none';
                }
                for (let i = 0; i < resetFormFields.length; i++) {
                    resetFormFields[i].style.display = 'block';
                }
            } else if (xhr.status == 205) {
                // 205 indicates that the change was successful and the original action should be reattempted
                // in the case of a password reset, that means the login form should be resubmitted
                document.getElementById('passwordChangeSuccess').classList.add('active');
                document.getElementById('username').disabled = false;
                document.getElementById('submitButton').innerText = "Login";
                for (let i = 0; i < loginFormFields.length; i++) {
                    loginFormFields[i].style.display = 'block';
                }
                for (let i = 0; i < resetFormFields.length; i++) {
                    resetFormFields[i].style.display = 'none';
                }
            } else if (xhr.status==400) {
                if (document.getElementById('username').disabled === true) {
                    document.getElementById('passwordChangeDuplicateError').classList.add('active');
                    const timeout = setTimeout(function() {
                        document.getElementById('passwordChangeDuplicateError').classList.remove('active');
                    }, 3000);
                    document.getElementById('passwordChangeDuplicateError').addEventListener('click', function() {
                        clearTimeout(timeout);
                        document.getElementById('passwordChangeDuplicateError').classList.remove('active');
                    });
                } else {
                    document.getElementById('responseError').classList.add('active');
                    const timeout = setTimeout(function () {
                        document.getElementById('responseError').classList.remove('active');
                    }, 3000);
                    document.getElementById('responseError').addEventListener('click', function () {
                        clearTimeout(timeout);
                        document.getElementById('responseError').classList.remove('active');
                    });
                }
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
        return false;
    };
</script>
</body>
</html>
