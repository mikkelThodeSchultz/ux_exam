
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

function validateEmail(email){
    return EMAIL_REGEX.test(email);
}
function validatePassword(password){
    return PASSWORD_REGEX.test(password);
}

export const showAlert = (text) => {
    const modal = document.getElementById('alertModal');
    const message = document.getElementById('alertModalMessage');
    const closeBtn = document.querySelector('#alertModal span.close');

    closeBtn.addEventListener('click', () => {
        message.innerText = '';
        modal.style.display = 'none';
    });

    message.innerText = text;
    modal.style.display = 'block';

};
const validateFormData = async (formData) => {
    if(formData.get('userEmail')){
        const email = formData.get('userEmail');
        if(!validateEmail(email)){
            showAlert('Must be a proper email.');
            return false;
        }
    }
    if(formData.get('userPassword')){
        const password = formData.get('userPassword');
        if(!validatePassword(password)){
            showAlert('The password must be between 8 and 20 characters, and contain lowercase and uppercase letters, numbers, and special characters.');
            return false;
        }
        if(formData.get('userPasswordConfirm')){
            const confirmPassword = formData.get('userPasswordConfirm');
            if(password !== confirmPassword){
                showAlert('The password must match with confirm password.');
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
    const userEmail = formData.get('userEmail');
    const userPassword = formData.get('userPassword');
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
    const userEmail = formData.get('userEmail');
    const userPassword = formData.get('userPassword');
    try {
        const response = await fetch(`http://localhost:3000/users?email=${userEmail}&password=${userPassword}`);
        const data = await response.json();
        if (data){
            sessionStorage.setItem('userEmail', data[0].email);
            await saveListToLocalStorage(data[0].favourites_id);
        } 
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const logout = async () => {
    sessionStorage.clear();
    localStorage.clear();
};

export const saveListToLocalStorage = async (list) => {
    localStorage.setItem('favoritesIdList', JSON.stringify(list));
};

export const addItemToLocalStorage = async (item, key) => {
    const itemId = Number(item);
    const getList = JSON.parse(localStorage.getItem(key));
    getList.push(itemId);
    localStorage.setItem(key, JSON.stringify(getList));
};

export const removeItemFromLocalStorage = async (item,localStorageKey) => {
    const itemId = Number(item);
    let mealList = JSON.parse(localStorage.getItem(localStorageKey));
     
    const mealToRemove = mealList.indexOf(itemId);
    if (mealToRemove > -1) {
        mealList = mealList.toSpliced(mealToRemove, 1);
    }
  
    localStorage.setItem(localStorageKey, JSON.stringify(mealList));
};
    

