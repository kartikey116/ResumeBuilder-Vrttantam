import React, { createContext, useState, useEffect } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosinstance';

export const UserContext = createContext({
    user: null,
    loading: true,
    updateUser: () => {},
    clearUser: () => {}
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            const accessToken = localStorage.getItem("token");
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
                setUser(response.data);
            } catch (error) {
                console.log("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    const updateUser = (userData) => {
        console.log("updateUser called with:", userData);
        if (userData && userData.token) {
            setUser(userData);
            localStorage.setItem("token", userData.token);
            setLoading(false);
        } else {
            console.error("Invalid user data passed to updateUser");
            clearUser(); 
        }
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
    };

    const value = {
        user,
        loading,
        updateUser,
        clearUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;