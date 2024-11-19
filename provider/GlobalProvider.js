'use client'

import React, {createContext, useContext, useState} from 'react'
// Create the context
const GlobalContext = createContext()

// Create a custom hook to use the context
export const useGlobal = () => {
    const context = useContext(GlobalContext)
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider')
    }
    return context
}

// Create the provider component
export const GlobalProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [theme, setTheme] = useState('light') //  'light' | 'dark'

    // Shared functions
    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const calculateDiscount = (price, discountPercentage) => {
        return price - (price * discountPercentage / 100)
    }

    const value = {
        // Shared data
        user,
        theme,

        // Shared functions
        setUser,
        setTheme,
        formatDate,
        calculateDiscount
    }

    return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}