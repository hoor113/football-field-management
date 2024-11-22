import { validateOperatingHours, checkOverlap } from './validation';

export const handleAddOperatingHours = (currentHours, existingHours, setNewField, setCurrentHours) => {
    const { start_hour, end_hour } = currentHours;
    
    const error = validateOperatingHours(start_hour, end_hour);
    if (error) {
        alert(error);
        return;
    }

    if (checkOverlap(start_hour, end_hour, existingHours)) {
        alert("Operating hours cannot overlap with existing ranges");
        return;
    }

    setNewField(prev => ({
        ...prev,
        operating_hours: [...prev.operating_hours, { start_hour, end_hour }]
            .sort((a, b) => a.start_hour - b.start_hour)
    }));

    setCurrentHours({ start_hour: 7, end_hour: 23 });
};

export const handleAddField = async (fieldData, setShowForm, setNewField, setFields) => {
    console.log('Submitting field data:', fieldData); // Debug log

    try {
        const response = await fetch("http://localhost:5000/api/field", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                ...fieldData,
                operating_hours: fieldData.operating_hours.map(hours => ({
                    start_hour: Number(hours.start_hour),
                    end_hour: Number(hours.end_hour)
                }))
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add field');
        }

        alert('Field added successfully!');
        setShowForm(false);
        
        // Fetch updated fields
        const fieldsResponse = await fetch("http://localhost:5000/api/field_owner/fields", {
            method: "GET",
            credentials: "include",
        });
        
        const fieldsData = await fieldsResponse.json();
        if (fieldsData.fields) {
            setFields(fieldsData.fields);
        }
    } catch (error) {
        console.error('Error adding field:', error);
        alert(error.message);
    }
}; 