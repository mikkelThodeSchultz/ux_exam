const url = 'http://localhost:3000/users';

export const getUserByEmail = async (userEmail) => {
    try {
        const response = await fetch(`${url}?email=${userEmail}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        if (userData.length === 0) {
            throw new Error('User not found');
        }
        const user = userData[0]; 
        return user;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const addMealToUser = async (userEmail, mealId) => {
    try {
        const response = await fetch(`${url}?email=${userEmail}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        if (userData.length === 0) {
            throw new Error('User not found');
        }
        const user = userData[0]; 
        const mealIdInt = parseInt(mealId);

        if (user.favourites_id.includes(mealIdInt)) {
            // If mealId is already in the array, return without pushing
            return;
        } else {
            user.favourites_id.push(mealIdInt);
        }

        const updateUserResponse = await fetch(`${url}/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!updateUserResponse.ok) {
            throw new Error('Failed to update user data');
        }
        return updateUserResponse;
    } catch (error) {
        console.error('Error:', error);
    }

};

export const removeMealFromUser = async (userEmail, mealId) => {
    try {
        const response = await fetch(`${url}?email=${userEmail}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        if (userData.length === 0) {
            throw new Error('User not found');
        }
        const user = userData[0]; 
        const mealIdInt = parseInt(mealId);

        if (!user.favourites_id.includes(mealIdInt)) {
            return;
        } else {
            user.favourites_id = user.favourites_id.filter(id => id !== mealIdInt);
        }

        const updateUserResponse = await fetch(`${url}/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!updateUserResponse.ok) {
            throw new Error('Failed to update user data');
        }
        return updateUserResponse;
    } catch (error) {
        console.error('Error:', error);
    }
};