import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

export type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    function signInWithGoogle() {
        const provider = new GoogleAuthProvider();

        return signInWithPopup(auth, provider).then((result) => {
            if (result.user) {
                const { displayName, photoURL, uid } = result.user;

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
            }
        });
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}