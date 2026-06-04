
import React, { createContext, useState, useEffect } from 'react';
import axios from '../config/axios'; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/api/users/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data.user);
                } catch (error) {
                    localStorage.removeItem('token'); 
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-sans antialiased">
                    <div className="flex flex-col items-center gap-3">
                        <i className="ri-loader-4-line text-4xl animate-spin text-blue-500"></i>
                        <p className="text-gray-400 font-medium tracking-wide">Loading workspace...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </UserContext.Provider>
    );
};