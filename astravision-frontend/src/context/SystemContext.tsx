import React, { createContext, useContext, useState, useEffect } from 'react';

type SystemMode = 'ACTIVE' | 'INACTIVE';

interface SystemContextType {
    systemMode: SystemMode;
    setSystemMode: (mode: SystemMode) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
    const [systemMode, setSystemMode] = useState<SystemMode>(() => {
        return (localStorage.getItem('astravision_system_mode') as SystemMode) || 'ACTIVE';
    });

    useEffect(() => {
        localStorage.setItem('astravision_system_mode', systemMode);
    }, [systemMode]);

    return (
        <SystemContext.Provider value={{ systemMode, setSystemMode }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};
