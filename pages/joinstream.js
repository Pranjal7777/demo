import React, { useEffect, useState, useRef } from 'react';
import Livekit from 'livekit-client';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const joinstream = () => {

    const [room, setRoom] = useState(null);
    const [participant, setParticipant] = useState(null);
    const [roomId, setRoomId] = useState('appscripLivekit');
    const [participantName, setParticipantName] = useState('');
    const localVideoRef = useRef();
    const remoteVideosRef = useRef([]);
    const profileData = useSelector(state => state.profileData);
    const [isTokenGenerated, setTokenGenerated] = useState("")
    const router = useRouter()
    let roomname = "Appscrip777";
    let user = "Pradeep Narval";
    let ws = "wss://video-streaming-2vegkyem.livekit.cloud";



    const handleJoinRoom = async () => {
        if (roomname) return router.push(`/stream/${roomname}`);

        const { data } = await Axios.get(`http://localhost:7070/getToken?roomname=${roomname}&username=${profileData.username}`)
        setTokenGenerated(data)
        try {
            // Connect to Livekit server
            const token = 'your-access-token';
            const connectOptions = {
                url,
                token: data,
            };

            // Connect to Livekit server
            const roomSession = await Livekit.connect(connectOptions);

            // Join the room
            const joinedParticipant = await roomSession.joinRoom({
                roomId,
                name: profileData.username,
            });

            console.log(`Joined the room as ${joinedParticipant.identity}`);
            setRoom(roomSession.room);
            setParticipant(joinedParticipant);

            // Attach local video track to the video element
            if (localVideoRef.current) {
                const localVideoTrack = joinedParticipant.tracks.find(
                    (track) => track.kind === 'video' && track.name === 'camera'
                );
                if (localVideoTrack) {
                    localVideoTrack.attach(localVideoRef.current);
                }
            }

            // Handle remote participant Events

            roomSession.on(RoomEvent.Disconnected, handleDisconnect)




            // roomSession.on('trackSubscribed', (track, participant) => {
            //     if (track.kind === 'video') {
            //         const remoteVideoRef = document.createElement('video');
            //         track.attach(remoteVideoRef);
            //         remoteVideosRef.current.push({ participant, track, videoRef: remoteVideoRef });
            //         // Append the remote video element to the DOM
            //         document.getElementById('remoteVideosContainer').appendChild(remoteVideoRef);
            //     }
            // });

            // roomSession.on('trackUnsubscribed', (track, participant) => {
            //     if (track.kind === 'video') {
            //         // Find and remove the remote video element from the DOM
            //         const index = remoteVideosRef.current.findIndex(
            //             (item) => item.participant.sid === participant.sid && item.track.sid === track.sid
            //         );
            //         if (index !== -1) {
            //             const { videoRef } = remoteVideosRef.current[index];
            //             videoRef.parentNode.removeChild(videoRef);
            //             remoteVideosRef.current.splice(index, 1);
            //         }
            //     }
            // });
        } catch (error) {
            console.error('Error joining the room:', error);
        }
    };

    const handleDisconnect = (e, b, a) => {
        console.log(e, b, a, "asdijsaijjiijij")
    }

    return <>
        <div>
            <button onClick={handleJoinRoom}>
                Join LiveKit Stream
            </button>

        </div>
    </>
}

export default joinstream