const url = 'http://localhost:3000/users';

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
        user.favourites_id.push(parseInt(mealId));
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