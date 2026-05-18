import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('dtour-theme');
        return saved === 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('dtour-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
            localStorage.setItem('dtour-theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
