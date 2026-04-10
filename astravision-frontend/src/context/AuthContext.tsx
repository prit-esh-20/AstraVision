import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyTokenApi, getStoredToken, logoutApi } from '../services/authApi';

type Role = 'guest' | 'user' | 'admin';

interface AuthContextType {
    role: Role;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (role: Role, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>('guest');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const isAuthenticated = role !== 'guest';

    useEffect(() => {
        const handleInvalidSession = () => {
            console.warn("AuthContext: Session invalid, logging out.");
            logoutApi();
            setRole('guest');

            const isPublicPage = ['/login', '/', '/about', '/architecture'].includes(window.location.pathname);
            if (!isPublicPage) {
                navigate('/login');
            }
        };

        const verifySession = async () => {
            // If already authenticated by login action, don't re-verify immediately
            if (role !== 'guest') {
                setIsLoading(false);
                return;
            }

            const token = getStoredToken();
            console.log("AuthContext: Verifying session with token:", token ? "Token present" : "No token");

            if (!token) {
                setRole('guest');
                setIsLoading(false);
                return;
            }

            try {
                const result = await verifyTokenApi(token);
                console.log("AuthContext: Token verification result:", result);

                if (result.valid && result.role) {
                    setRole(result.role as Role);
                } else {
                    handleInvalidSession();
                }
            } catch (error) {
                console.error("AuthContext: Token verification failed:", error);
                handleInvalidSession();
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [navigate, role]); // Keep role to handle session restoration after refresh

    const login = (newRole: Role, token: string) => {
        setRole(newRole);
        localStorage.setItem('astravision_role', newRole);
        localStorage.setItem('astravision_token', token);
    };

    const logout = () => {
        logoutApi();
        setRole('guest');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ role, isAuthenticated, isLoading, login, logout }}>
            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center bg-dark-base text-neon-cyan">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-mono uppercase tracking-widest text-sm">Verifying Authentication Token...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
