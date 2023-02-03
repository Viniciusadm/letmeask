import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
    code: string | undefined
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        const url = window.location.origin + '/rooms/' + props.code;
        navigator.clipboard.writeText(url).then(() => {
            alert('URL copiado com sucesso!');
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