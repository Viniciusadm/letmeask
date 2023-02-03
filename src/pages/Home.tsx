import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {FormEvent, useState} from "react";
import { database } from "../services/firebase";
import { ref, onValue } from "firebase/database";
import toast from "react-hot-toast";
export function Home() {
    const history = useNavigate();
    const { user, signInWithGoogle } = useAuth();

    const [roomCode, setRoomCode] = useState('');

    function handleCreateRoom() {
        if (!user) {
            signInWithGoogle().then(() => history('/rooms/new'));
        } else {
            history('/rooms/new');
        }
    }

    function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = ref(database, `rooms/${roomCode}`);

        onValue(roomRef, (snapshot) => {
            if (!snapshot.exists()) {
                toast.success('A sala não existe.');
                return;
            }

            if (snapshot.val().endedAt) {
                toast.success('A sala já foi encerrada.');
                return;
            }

            history(`/rooms/${roomCode}`);
        });
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}