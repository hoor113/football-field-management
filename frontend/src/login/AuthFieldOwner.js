import React, { useEffect, useState } from "react";

export const AuthFieldOwner = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fullname, setFullname] = useState(null);

    // Check if user is logged in on initial load
    useEffect(() => {
        fetch("http://localhost:5000/api/field_owner/", {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Not logged in");
            })
            .then((data) => {
                setFullname(data.fullname);
                setIsLoggedIn(true);
            })
            .catch(() => {
                setIsLoggedIn(false);
                setFullname(null);
            });
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        fetch("http://localhost:5000/api/field_owner/logout", {
            method: "POST",
            credentials: "include",
        }).then(() => {
            setIsLoggedIn(false);
            setFullname(null);
        });
    };

    return { isLoggedIn, fullname, handleLogout }
}