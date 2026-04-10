/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

// API_BASE_URL removed due to unused export and TS error

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    role: 'admin' | 'user';
    expiresAt: string;
}

export interface VerifyTokenResponse {
    valid: boolean;
    role?: 'admin' | 'user';
    message?: string;
}

/**
 * Generate a mock JWT-like token (for development without backend)
 */
const generateMockToken = (role: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    // Standard JWT exp is in seconds.
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
        role,
        exp: nowInSeconds + (24 * 60 * 60), // 24 hours
        iat: nowInSeconds
    }));
    const signature = btoa(`mock-signature-${role}-${Date.now()}`);
    return `${header}.${payload}.${signature}`;
};

/**
 * Decode JWT token to check expiration
 */
const decodeToken = (token: string): any => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // JWT exp is in seconds
    const expirationTime = decoded.exp * 1000;
    return Date.now() > expirationTime;
};

/**
 * Login user and get authentication token
 */
export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const savedUsersStr = localStorage.getItem('astravision_users');
        let users: any[] = [];

        if (savedUsersStr) {
            users = JSON.parse(savedUsersStr);
        } else {
            users = [
                { email: 'admin@astravision.ai', password: 'admin123', role: 'Admin', status: 'Active' },
                { email: 'user@astravision.ai', password: 'user123', role: 'Operator', status: 'Active' }
            ];
        }

        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (user.status !== 'Active') {
            throw new Error('Account inactive');
        }

        const role = user.role === 'Admin' ? 'admin' : 'user';
        const token = generateMockToken(role);

        // Store tokens using the keys the user requested
        localStorage.setItem('astravision_token', token);
        localStorage.setItem('astravision_role', role);

        return {
            token,
            role,
            expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString()
        };

    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

/**
 * Verify authentication token with backend
 */
export const verifyTokenApi = async (token: string): Promise<VerifyTokenResponse> => {
    try {
        if (!token) {
            return { valid: false, message: 'No token provided' };
        }

        // 1. Check local expiration first (if backend check is slow or unavailable)
        if (isTokenExpired(token)) {
            return { valid: false, message: 'Token expired' };
        }

        // 2. Verify with backend API
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const decoded = decodeToken(token);
                return {
                    valid: true,
                    role: decoded?.role as 'admin' | 'user'
                };
            } else {
                return { valid: false, message: 'Invalid token' };
            }
        } catch (fetchError) {
            // If backend is unreachable, we trust the local expiration for now
            // or we could fail if strict mode is required.
            // Requirement says: "If no backend exists -> check token expiration"
            console.warn('Backend verification unavailable, falling back to local check');
            const decoded = decodeToken(token);
            if (decoded && decoded.role) {
                return {
                    valid: true,
                    role: decoded.role as 'admin' | 'user'
                };
            }
            return { valid: false, message: 'Token decoding failed' };
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return { valid: false, message: 'Verification failed' };
    }
};

/**
 * Logout user and clear authentication data
 */
export const logoutApi = (): void => {
    localStorage.removeItem('astravision_token');
    localStorage.removeItem('astravision_role');
    localStorage.removeItem('astravision_users');
    localStorage.removeItem('astravision_system_mode');

    // Clear any other astravision-prefixed keys
    Object.keys(localStorage)
        .filter(key => key.startsWith('astravision_'))
        .forEach(key => localStorage.removeItem(key));
};

/**
 * Get stored authentication token
 */
export const getStoredToken = (): string | null => {
    return localStorage.getItem('astravision_token');
};

/**
 * Get stored role
 */
export const getStoredRole = (): 'admin' | 'user' | null => {
    const role = localStorage.getItem('astravision_role');
    if (role === 'admin' || role === 'user') return role;
    return null;
};
