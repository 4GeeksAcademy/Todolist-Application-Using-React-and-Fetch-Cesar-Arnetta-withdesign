const baseUrl = "https://playground.4geeks.com"

export const todoService = {

    //get function

    getUsers: async () => {
        try {
            // const request = await fetch(`${baseUrl}/todo/users?offset=0&limit=20`
            const request = await fetch(`${baseUrl}/todo/users/cesar_arnetta`, {
                headers: {
                    accept: 'application/json'
                }
            })
            const response = await request.json()
            return response.todos
        } catch (error) {

        }
    },

    createUser: async (user) => {
        try {
            // const request = await fetch(`${baseUrl}/todo/${user}`
            const request = await fetch(`${baseUrl}/todo/todos/cesar_arnetta`, {
                method: "POST",
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify(user)
                body: JSON.stringify({
                    label: user.label,
                    is_done: user.is_done,
                }),
            });
            const response = await request.json();
            return response;
        } catch (error) {

        }
    },

    deleteUser: async (user) => {
        try {
            // const request = await fetch(`${baseUrl}/todo/users/${user}
            const request = await fetch(`${baseUrl}/todo/todos/${user}`, {
                method: "DELETE",
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const response = await request.json();
            return response;
        } catch (error) {

        }
    },

    deleteAllUsers: async (userID) => {
        try {
            const request = await fetch(`${baseUrl}/todo/todos/${userID}`, {
                method: "DELETE",
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const response = await request.json();
            return response.todos;
        } catch (error) {

        }
    }
}    
