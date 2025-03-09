import { useEffect, useState } from "react";

export const AuthCustomer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fullname, setFullname] = useState(null);

    // Check if user is logged in on initial load
    useEffect(() => {
        fetch("http://localhost:5000/api/customer/", {
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
                setIsLoggedIn(2);
            })
            .catch(() => {
                setIsLoggedIn(0);
                setFullname(null);
            });
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        fetch("http://localhost:5000/api/customer/logout", {
            method: "POST",
            credentials: "include",
        }).then(() => {
            setIsLoggedIn(0);
            setFullname(null);
        });
    };

    return { isLoggedIn, fullname, handleLogout }
}