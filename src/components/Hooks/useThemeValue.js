import { useState, useEffect } from "react";

export default function useThemeValue() {
    const [themeValue, updateThemeValue] = useState(localStorage.getItem('theme'));

   useEffect(() => { 
        // Define a function to handle changes in localStorage
        const handleLocalStorageChange = (e) => {
        updateThemeValue(localStorage.getItem('theme')); // Update state when localStorage changes
        };

        // Listen for changes in localStorage
        document.addEventListener('themeChange', handleLocalStorageChange, false);

        return () => {
        // Remove the event listener when the component unmounts
        document.removeEventListener('themeChange', handleLocalStorageChange);
        };
    })

    return themeValue
}