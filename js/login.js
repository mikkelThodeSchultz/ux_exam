import { logIn, logout, signUp, showAlert } from './auth.js';

export const handleLoginAndSignup = () => {



    const setupSignupForm = document.getElementById('signUpForm');
    if (setupSignupForm) {
        setupSignupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(setupSignupForm);
            try {
                const response = await signUp(formData);
                if (response.status === 201) {
                    window.location.href = '../views/login.html';
                    showAlert('User have been created succesfully');
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    const setupLoginForm = document.getElementById('logInForm');
    if (setupLoginForm) {
        setupLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(setupLoginForm);
            try {
                const response = await logIn(formData);
                if (!response) {
                    showAlert('Wrong email or password');
                } else if (response.status === 200) {
                    window.location.href = '../views/favorites.html';
                    showAlert('User logged in succesfully');
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    const setupLogOut = document.getElementById('logOutBtn');
    if (setupLogOut) {
        setupLogOut.addEventListener('click', async (e) => {
            e.preventDefault();
            await logout();
            window.location.href = '/';
        });
    }
};