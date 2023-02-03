import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { useNavigate } from "react-router-dom";

import '../styles/room.scss';
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import { useParams } from "react-router-dom";

import { useRoom } from "../hooks/useRoom";
import { Button } from "../components/Button";
import { database } from "../services/firebase";
import { ref, remove, update } from "firebase/database";

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const params = useParams<RoomParams>();
    const roomId = params.id as string;
    const navigate = useNavigate();

    const { title, questions } = useRoom(roomId);

    async function handleDeleteQuestion(questionId: string) {
        if (confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
            await remove(questionRef);
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
            isAnswered: true,
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
            isHighlighted: true,
        });
    }

    function handleEndRoom() {
        update(ref(database, `rooms/${roomId}`), {
            endedAt: new Date(),
        }).then(() => {
            alert('Sala encerrada com sucesso!');
            navigate('/');
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.length === 0 && (
                        <div className="empty-questions">
                            <p>Nenhuma pergunta por aqui...</p>
                            <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
                        </div>
                    )}
                    {questions.map(question => {
                        return (
                            <Question
                                author={question.author}
                                content={question.content}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                                key={question.id}>
                                {!question.isAnswered && (
                                    <>
                                    <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>
                                    <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                                        <img src={answerImg} alt="Dar destaque à pergunta" />
                                    </button>
                                    </>
                                )}
                                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}