
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

function validateEmail(email){
    return EMAIL_REGEX.test(email);
}
function validatePassword(password){
    return PASSWORD_REGEX.test(password);
}

const validateFormData = async (formData) => {
    if(formData.get('user_email')){
        const email = formData.get('user_email');
        if(!validateEmail(email)){
            alert('Must be a proper email.');
            return false;
        }
    }
    if(formData.get('user_password')){
        const password = formData.get('user_password');
        if(!validatePassword(password)){
            alert('The password must be between 8 and 20 characters, and contain lowercase and uppercase letters, numbers, and special characters.');
            return false;
        }
        if(formData.get('user_password_confirm')){
            const confirmPassword = formData.get('user_password_confirm');
            if(password !== confirmPassword){
                alert('The password must match with confirm password.');
                return false;
            }
        }
    }
    return true;
}; 


export const signUp = async (formData) => {
    if(!await validateFormData(formData)){
        return;
    }
    const userEmail = formData.get('user_email');
    const userPassword = formData.get('user_password');
    const user = {
        email: userEmail,
        password: userPassword,
        'favourites_id' : [
        ]
    };
    try{
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}; 

export const logIn = async (formData) => {
    if(!await validateFormData(formData)){
        return;
    }
    const userEmail = formData.get('user_email');
    const userPassword = formData.get('user_password');
    try {
        const response = await fetch(`http://localhost:3000/users?email=${userEmail}&password=${userPassword}`);
        const data = await response.json();
        if (data){
            sessionStorage.setItem('userEmail', data[0].email);
        } 
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const logout = async () => {
    sessionStorage.clear();
};