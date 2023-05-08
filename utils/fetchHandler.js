import { signOut } from "next-auth/react";

const handleError = (response) => {
    if (!response.ok) { 
        if(response.status == 401) {
            signOut();
            throw Error("Unauthorized, please log in again.");
        }

        throw Error(response.statusText);
    } else {
        return response.json();
    }
}

export default handleError;