const handleError = (response) => {
    if (!response.ok) { 
        throw Error(response.statusText);
    } else {
        return response.json();
    }
}

export default handleError;