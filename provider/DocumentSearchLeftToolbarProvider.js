'use client'

import React, {createContext, useContext, useState} from 'react'
import {usePathname} from "next/navigation";
// Create the context
const DocumentSearchLeftToolbarProviderContext = createContext()

// Create a custom hook to use the context
export const useDocumentSearchLeftToolbarProvider = () => {
    const context = useContext(DocumentSearchLeftToolbarProviderContext)
    if (context === undefined) {
        throw new Error('useDocumentSearchLeftToolbarProvider must be used within a DocumentSearchLeftToolbarProvider')
    }
    return context
}

// Create the provider component
export const DocumentSearchLeftToolbarProvider = ({children}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState([]);
    const [openSubMenus, setOpenSubMenus] = useState([]);

    const toggleMenu = (menuName) => {
        setOpenMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        );
    };

    const toggleSubMenu = (subMenuName) => {
        setOpenSubMenus(prev =>
            prev.includes(subMenuName)
                ? prev.filter(name => name !== subMenuName)
                : [...prev, subMenuName]
        );
    };

    const value = {
        // Shared data
        isExpanded,
        openMenus,
        openSubMenus,

        // Shared functions
        setIsExpanded,
        setOpenMenus,
        setOpenSubMenus,
        toggleMenu,
        toggleSubMenu
    }

    return <DocumentSearchLeftToolbarProviderContext.Provider value={value}>{children}</DocumentSearchLeftToolbarProviderContext.Provider>
}