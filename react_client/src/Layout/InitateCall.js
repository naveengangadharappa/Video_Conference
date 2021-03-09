import React, { useEffect, useState, useRef, Suspense } from 'react';
import '../assets/scss/style.scss';
import { Logout } from "../network/Apicall";
import { useHistory } from 'react-router-dom';

import io from "socket.io-client";
import Peer from "simple-peer";
import Rodal from 'rodal';
import { Howl } from 'howler';

import 'rodal/lib/rodal.css';
import './index.css'
import camera from '../Icons/camera.svg';
import camerastop from '../Icons/camera-stop.svg';
import microphone from '../Icons/microphone.svg';
import microphonestop from '../Icons/microphone-stop.svg';
//import share from '../Icons/share.svg'
import hangup from '../Icons/hang-up.svg';
import ringtone from '../Sounds/ringtone.mp3';

const ringtoneSound = new Howl({
    src: [ringtone],
    loop: true,
    preload: true
})


const InitateCall = (props) => {
    const history = useHistory();
    const [user_name, setusername] = useState();
    const [user_mobileno, setmobileno] = useState();
    const [peernumber, setpeermobile] = useState();
    const [validation_msg, setvalidation_msg] = useState();
    const [validation_username, setvalidation_username] = useState();
    const [validation_peermobileno, setvalidation_usermobileno] = useState();
    const [videoscreen_flg, setvideoscreen_flg] = useState(false);
    const [expirtime, setexpite_time] = useState(5 * 60);

    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});

    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callingFriend, setCallingFriend] = useState(false);
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callRejected, setCallRejected] = useState(false);
    const [receiverID, setReceiverID] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [audioMuted, setAudioMuted] = useState(false)
    const [videoMuted, setVideoMuted] = useState(false)
    const [isfullscreen, setFullscreen] = useState(false)
    const [copied, setCopied] = useState(false)
    //const [Timer, setTimer] = useState('00:00');
    const [Timer, setTimer] = useState(0);


    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();
    const myPeer = useRef();


    useEffect(async () => {
        if (props) {
            setusername(props.location.state.user_name);
            setmobileno(props.location.state.user_mobileno);
        }
        socket.current = io.connect("/");


        //  socket.current.on("yourID", (id) => {
        //   setYourID(id);
        // // })
        socket.current.emit("register_user", { User_Mobile_No: props.location.state.user_mobileno, User_Name: props.location.state.user_name })

        socket.current.on("allUsers", (users) => {
            console.log("Socket Users = ", (users));
            setUsers(users);
        })
        await initate_socket();
    }, []);

    const initate_socket = async () => {
        try {

            socket.current.on("hey", (data) => {
                console.log("hey socket received from server");
                setvideoscreen_flg(true);
                setReceivingCall(true);
                ringtoneSound.play();
                setCaller(data.from);
                setCallerSignal(data.signal);
            })
            socket.current.on("validation", (data) => {
                console.log("socket validation", (data));
                setvalidation_msg(data.message)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const Logout_user = async () => {
        try {
            let confirm = window.confirm("Are You shure to logout ?");
            if (confirm) {
                let result = await Logout();
                if (result.status) {
                    history.push({ pathname: '/Register' });
                } else {
                    window.alert("Logout Unsuccessfull please try again")
                }
            }
        } catch (err) {
            console.log(err)
        }

    }

    const callPeer = (id) => {
        // if (id !== '' && users[id] && id !== yourID) {
        //     //open camera
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            setCallingFriend(true)
            setCaller(id)
            if (userVideo.current) {
                setvideoscreen_flg(true);
                userVideo.current.srcObject = stream;
            }
            const peer = new Peer({
                initiator: true,
                trickle: false,
                config: {
                    iceServers: []
                },
                stream: stream,
            });

            myPeer.current = peer;

            peer.on("signal", data => {
                //socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
                //socket.current.emit("callUser", { userToCall: peernumber, signalData: data, from: user_mobileno })
                socket.current.emit("callUser", { userToCall: id, signalData: data, from: user_mobileno, callduration: expirtime })

                setvideoscreen_flg(true);
            })

            peer.on("stream", stream => {
                if (partnerVideo.current) {
                    partnerVideo.current.srcObject = stream;
                }
            });

            peer.on('error', (err) => {
                console.log(err)
                endCall()
            })

            socket.current.on("callAccepted", signal => {
                setCallAccepted(true);
                peer.signal(signal);
            })

            socket.current.on("validation", (data) => {
                console.log("socket validation", (data));
                setvalidation_msg(data.message)
            })

            socket.current.on('close', () => {
                console.log("entered socket close call peer")
                setvideoscreen_flg(false);
                history.push('/Register');
                //window.location.reload()
            })

            socket.current.on('rejected', () => {
                setvideoscreen_flg(false);
                endCall();
                // window.location.reload()
            })
        })
            .catch((err) => {
                console.log(err);
                setModalMessage(err);
                setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
                setModalVisible(true)
            })
        // } else {
        //     setModalMessage('We think the username entered is wrong. Please check again and retry!')
        //     setModalVisible(true)
        //     setvalidation_msg("Friend/peer Mobile Number Not Exists")
        //     return
        // }
    }

    const acceptCall = () => {
        console.log("Entered accept call")
        ringtoneSound.unload();
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            //console.log("Enterd Navigator.medDevices")
            setStream(stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
            setCallAccepted(true);
            setvideoscreen_flg(true)
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream,
            });

            myPeer.current = peer

            peer.on("signal", data => {
                socket.current.emit("acceptCall", { signal: data, to: caller })
            })

            peer.on("stream", stream => {
                partnerVideo.current.srcObject = stream;
            });

            peer.on('error', (err) => {
                console.log(err);
                endCall()
            })

            peer.signal(callerSignal);

            socket.current.on('close', () => {
                console.log("enterd socket  accept");
                setvideoscreen_flg(false);
                history.push('/Register');

                //window.location.reload()
            })
        })
            .catch((err) => {
                console.log(err);
                setModalMessage(err);
                setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
                setModalVisible(true)
            })
    }

    const rejectCall = async () => {
        ringtoneSound.unload();
        setCallRejected(true)
        socket.current.emit('rejected', { to: caller })
        initate_socket();
    }

    const endCall = async () => {
        console.log("Calling end call", { to: peernumber, from: user_mobileno });
        console.log("end call ", { to: caller, from: user_mobileno });
        socket.current.emit('close', { to: peernumber, from: user_mobileno });
        myPeer.current.destroy()
        history.push('/Register');
    }


    const toggleMuteAudio = () => {
        if (stream) {
            setAudioMuted(!audioMuted)
            stream.getAudioTracks()[0].enabled = audioMuted
        }
    }

    const toggleMuteVideo = () => {
        if (stream) {
            setVideoMuted(!videoMuted)
            stream.getVideoTracks()[0].enabled = videoMuted
        }
    }

    const renderLanding = () => {
        if (!callRejected && !callAccepted && !callingFriend)
            return 'block'
        return 'none'
    }

    const renderCall = async () => {
        if (!callRejected && !callAccepted && !callingFriend)
            return 'none'
        await count_Timer();
        return 'block'
        /*if (!callRejected && !callAccepted && !callingFriend)
          return 'block'
        await count_Timer();
        return 'none'*/
    }

    const count_Timer = () => {
        setTimeout(() => {
            setTimer(Timer + 1);
            if (Timer == expirtime - 20) {
                window.alert("your call is about to end in next 20 seconds");
            }
            if (Timer >= expirtime) {
                endCall();
            }
        }, 1000);
    }

    let UserVideo;
    if (stream) {
        UserVideo = (
            <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
            // <video className="userVideo" playsInline muted={true} ref={userVideo} autoPlay />
        );
    }

    let PartnerVideo;
    if (callAccepted && isfullscreen) {
        PartnerVideo = (
            <video className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay />
        );
    } else if (callAccepted && !isfullscreen) {
        PartnerVideo = (
            <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
        );
    }

    let incomingCall;
    if (receivingCall && !callAccepted && !callRejected) {
        incomingCall = (
            <div className="incomingCallContainer">
                <div className="incomingCall flex flex-column">
                    <div><span className="callerID">{caller}</span> is calling you!</div>
                    <div className="incomingCallButtons flex">
                        <button name="accept" className="alertButtonPrimary" onClick={() => acceptCall()}>Accept</button>
                        <button name="reject" className="alertButtonSecondary" onClick={() => rejectCall()}>Reject</button>
                    </div>
                </div>
            </div>
        )
    }

    let audioControl;
    if (audioMuted) {
        audioControl = <span className="iconContainer" onClick={() => toggleMuteAudio()}>
            <img src={microphonestop} alt="Unmute audio" />
            <p style={{ color: 'white' }}>Unmute Audio</p>
        </span>
    } else {
        audioControl = <span className="iconContainer" onClick={() => toggleMuteAudio()}>
            <img src={microphone} alt="Mute audio" />
            <p style={{ color: 'white' }}>Mute Audio</p>
        </span>
    }

    let videoControl;
    if (videoMuted) {
        videoControl = <span className="iconContainer" onClick={() => toggleMuteVideo()}>
            <img src={camerastop} alt="Resume video" />
            <p style={{ color: 'white' }}>Enble Audio</p>
        </span>
    } else {
        videoControl = <span className="iconContainer" onClick={() => toggleMuteVideo()}>
            <img src={camera} alt="Stop audio" />
            <p style={{ color: 'white' }}>Desable Audio</p>
        </span>
    }

    let hangUp = <span className="iconContainer" onClick={() => endCall()}>
        <img src={hangup} alt="End call" />
        <p style={{ color: 'white' }}>End Call</p>
    </span>

    if (videoscreen_flg) {
        return (
            <>
                <div style={{ display: renderLanding() }}>
                    <Rodal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        width={20}
                        height={5}
                        measure={'em'}
                        closeOnEsc={true}
                    >
                        <div>{modalMessage}</div>
                    </Rodal>
                    {incomingCall}
                </div>
                <div className="callContainer" style={{ display: renderCall() }}>
                    <div className="timerContainer">
                        <p>Call Duration :{Timer} sec</p>
                        {/* <p style={{ alignSelf: 'center', justifyContent: 'center', alignContent: 'center', backgroundColor: 'black', color: 'white', fontSize: 24, fontWeight: 'bold' }}>Clock :{Timer}</p> */}
                    </div>
                    <div className="partnerVideoContainer">
                        {PartnerVideo}
                    </div>
                    <div className="userVideoContainer">
                        {UserVideo}
                    </div>
                    <div className="controlsContainer flex">
                        {audioControl}
                        {videoControl}
                        {hangUp}
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r" />
                            <span className="r s" />
                            <span className="r s" />
                            <span className="r" />
                        </div>
                        <div className="card large">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-unlock auth-icon" /><h5 className="mb-2">Welcome {user_name} ( {user_mobileno} )</h5>
                                </div>
                                {validation_msg ? <p style={{ color: "darkred" }}>{validation_msg}</p> : null}
                                <h6 className="mb-4">Plese Enter you Friend number to initate Call   </h6>
                                <div className="input-group mb-4">
                                    <input type="number" className="form-control" placeholder="Enter Frient/peer Mobile Number" max={10} value={peernumber} onChange={(e) => { setpeermobile(e.target.value) }} required />
                                    <button className="btn btn-primary shadow-2 mb-6" onClick={() => callPeer(peernumber)}>Call</button>
                                    {/* <button className="btn btn-primary shadow-2 mb-6" onClick={() => callPeer(receiverID.toLowerCase())}>Call</button> */}
                                </div>
                                <div className="input-group mb-4">
                                    <p style={{ fontWeight: 'bold', padding: 10, justifyContent: 'center', alignContent: 'center' }}>Call Duration</p>
                                    <select name="expiretime" className="form-control" onChange={((e) => { setexpite_time(e.target.value * 60) })}>
                                        <option value="5">5 Minutes</option>
                                        <option value="10">10 Minutes</option>
                                        <option value="15">15 Minutes</option>
                                        <option value="20">20 Minutes</option>
                                    </select>
                                </div>

                            </div>
                            <a href='#' style={{ color: '#48C9B0', fontWeight: 'bold', padding: 10 }} onClick={Logout_user}>Logout as {user_name} ( {user_mobileno} ) ?</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default InitateCall

