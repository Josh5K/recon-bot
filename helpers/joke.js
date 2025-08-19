import axios from 'axios';

let getJoke = async () => {
    try {
        const response = await axios.get('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (response.status === 200) {
            return response.data.joke;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        throw error;
    }
};

export { getJoke }