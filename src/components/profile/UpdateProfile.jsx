import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfile = () => {
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            
            if (name) formData.append('name', name);
            if (profileImage) formData.append('profileImage', profileImage);

            const response = await axios.patch(
                'http://localhost:5000/api/v1/users/update-profile', 
                formData, 
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <div>
                <label htmlFor="name-input">Full Name:</label>
                <input 
                    id="name-input"
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter new name"
                />
            </div>

            <div>
                <label htmlFor="file-input">Profile Image:</label>
                <input 
                    id="file-input"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    );
};

export default UpdateProfile;