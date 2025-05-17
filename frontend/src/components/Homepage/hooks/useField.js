import { useState, useEffect } from 'react';

export const useField = (isLoggedIn) => {
    const [fields, setFields] = useState([]);
    const [fieldOwner, setFieldOwner] = useState(null);

    useEffect(() => {
        if (isLoggedIn === 1) {
            // Fetch field owner and fields data
            const fetchData = async () => {
                try {
                    const [ownerResponse, fieldsResponse] = await Promise.all([
                        fetch("http://localhost:5000/api/field_owner", {
                            credentials: "include",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            }
                        }),
                        fetch("http://localhost:5000/api/field_owner/fields", {
                            credentials: "include",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            }
                        })
                    ]);

                    const ownerData = await ownerResponse.json();
                    const fieldsData = await fieldsResponse.json();

                    setFieldOwner(ownerData.id);
                    setFields(fieldsData.fields || []);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [isLoggedIn]);

    return { fields, setFields, fieldOwner };
}; 