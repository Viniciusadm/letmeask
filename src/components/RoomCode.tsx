import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'
import toast from "react-hot-toast";

type RoomCodeProps = {
    code: string | undefined
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        const url = window.location.origin + '/rooms/' + props.code;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('URL da sala copiada com sucesso!');
        });
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}