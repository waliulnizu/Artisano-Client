import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfile = () => {
    // ১. স্টেট ডিফাইন করা (ইউজারের ইনপুট ধরে রাখার জন্য)
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // ২. ফাইল হ্যান্ডলার ফাংশন
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    // ৩. সাবমিট হ্যান্ডলার ফাংশন
    const handleSubmit = async (e) => {
        e.preventDefault(); // ব্রাউজারের ডিফল্ট পেজ রিফ্রেশ বন্ধ করা
        setLoading(true);

        try {
            // ৪. FormData তৈরি এবং ডাটা অ্যাপেন্ড করা
            const formData = new FormData();
            
            if (name) formData.append('name', name);
            if (profileImage) formData.append('profileImage', profileImage);

            // ৫. Axios এর মাধ্যমে API কল করা
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
            setLoading(false); // লোডিং বন্ধ করা
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