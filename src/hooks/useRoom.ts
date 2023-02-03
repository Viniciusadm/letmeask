import {useEffect, useState} from "react";
import {onValue, ref, off} from "firebase/database";
import {database} from "../services/firebase";
import {useAuth} from "./useAuth";

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>;


export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const roomRef = ref(database, `rooms/${roomId}`);

        onValue(roomRef, snapshot => {
            const data = snapshot.val();
            const firebaseQuestions: FirebaseQuestions = data.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            });

            setTitle(data.title);
            setQuestions(parsedQuestions);
        });

        return () => {
            off(roomRef);
        }
    }, [roomId, user?.id]);

    return {questions, title};
}

