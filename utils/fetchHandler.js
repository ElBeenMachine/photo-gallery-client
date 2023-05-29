import { signOut } from "next-auth/react";

const handleError = async (response) => {
    if (!response.ok) { 
        if(response.status == 401) {
            signOut();
            throw Error("Unauthorized, please log in again.");
        }

        let message;
        try {
            const data = await response.json();
            message = data.message;
        } catch (error) {
            message = response.statusText;
        }
        if(message == "" || message == undefined || message == null) message = "An unexpected error has occurred.";
        throw new Error(message);
    } else {
        return response.json();
    }
}

export default handleError;