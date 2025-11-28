import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { MOCK_USERS } from '../data/mockUsers';

type AuthContextType = {
    session?: string | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    isLoading: false,
    signIn: async () => { },
    signOut: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for persisted session
        AsyncStorage.getItem('user_session').then((token) => {
            setSession(token);
            setIsLoading(false);
        });
    }, []);

    const signIn = async (username: string, password: string) => {
        const user = MOCK_USERS.find(u => u.username === username && u.password === password);
        if (user) {
            setSession(user.username);
            await AsyncStorage.setItem('user_session', user.username);
        } else {
            throw new Error('Invalid credentials');
        }
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('user_session');
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
