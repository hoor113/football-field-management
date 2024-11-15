import React from "react";

export const HomePage = ({isLoggedIn, fullname}) => {
    return (
        <div>
            <h1>Welcome {isLoggedIn ? fullname : 'Guest'}!</h1>
        </div>
    )
}


export default HomePage