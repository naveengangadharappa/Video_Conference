import React, { useEffect, useState, useRef, Suspense } from 'react';
import '../assets/scss/style.scss';
import { Register_User, Offlinestorage, Login } from "../network/Apicall";
import { useHistory } from 'react-router-dom';

const Register = (props) => {
    const history = useHistory();
    const [user_name, setusername] = useState();
    const [user_mobileno, setmobileno] = useState();
    const [login_flg, setloginflg] = useState(true);
    const [validation_msg, setvalidation_msg] = useState();
    const [validation_username, setvalidation_username] = useState();
    const [validation_usermobileno, setvalidation_usermobileno] = useState();

    useEffect(async () => {
        let offline_result = await Offlinestorage({ choice: 'getdata', key: 'userdata' });
        console.log("use effect offline db result = ", offline_result);
        if (offline_result.status && offline_result.data) {
            if (offline_result.data.login_status) {
                history.push({ pathname: '/Initatecall', state: { "user_name": offline_result.data.User_Name, "user_mobileno": offline_result.data.User_Mobile_No } });
            }
        }
    }, []);

    const login = async () => {
        try {
            if (user_mobileno) {
                if (String(user_mobileno).length < 10) {
                    setvalidation_msg("Invalid Mobile Number");
                } else {
                    let params = {
                        User_Mobile_No: user_mobileno
                    }
                    let result = await Login(params);
                    if (result.status) {
                        //let storageresult = await Offlinestorage({ choice: 'adddata', key: 'userdata', value: { login_status: true, User_Name: user_name, User_Mobile_No: user_mobileno } });
                        let storageresult = await Offlinestorage({ choice: 'adddata', key: 'userdata', value: { login_status: true, User_Name: result.data[0].User_Name, User_Mobile_No: user_mobileno } });
                        console.log("offline result =", (storageresult));
                        if (storageresult.status) {
                            history.push({ pathname: '/Initatecall', state: { user_name: result.data[0].User_Name, user_mobileno } });
                        } else {
                            history.push({ pathname: '/Initatecall', state: { user_name: result.data[0].User_Name, user_mobileno } });
                        }
                    } else {
                        //history.push({ pathname: '/Initatecall', state: { user_name, user_mobileno } });
                        // let message = result.message
                        setvalidation_msg(result.message);
                    }
                }
            } else {
                setvalidation_msg("Mobile Number Required");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const submit = async () => {
        try {
            if (user_name && user_mobileno) {
                if (String(user_mobileno).length < 10) {
                    setvalidation_msg("Invalid Mobile Number");
                } else {
                    let params = {
                        User_Name: user_name,
                        User_Mobile_No: user_mobileno
                    }
                    let result = await Register_User(params);
                    if (result.status) {
                        //let storageresult = await Offlinestorage({ choice: 'adddata', key: 'userdata', value: { login_status: true, User_Name: user_name, User_Mobile_No: user_mobileno } });
                        let storageresult = await Offlinestorage({ choice: 'adddata', key: 'userdata', value: { login_status: true, User_Name: user_name, User_Mobile_No: user_mobileno } });
                        console.log("offline result =", (storageresult));
                        if (storageresult.status) {
                            history.push({ pathname: '/Initatecall', state: { user_name, user_mobileno } });
                        } else {
                            history.push({ pathname: '/Initatecall', state: { user_name, user_mobileno } });
                        }
                    } else {
                        // history.push({ pathname: '/Initatecall', state: { user_name, user_mobileno } });
                        // let message = result.message
                        setvalidation_msg(result.message);
                    }
                }
            } else {
                setvalidation_msg("UserName and Mobile nUmber Required");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const validation = async (e) => {
        if (e.target.value.includes("+") || e.target.value.includes("*") || e.target.value.includes("/") || e.target.value.includes("-")) {
            setvalidation_username("Special chracter not allowed");
        } else {
            setusername(e.target.value)
            setvalidation_username('');
        }
    }

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
                    {login_flg ?
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-unlock auth-icon" /><h5 className="mb-2">Login</h5>
                                </div>
                                {validation_msg ? <p style={{ color: "darkred" }}>{validation_msg}</p> : null}

                                <div className="input-group mb-4">
                                    <input type="number" className="form-control" placeholder="Enter Mobile Number" max={10} value={user_mobileno} onChange={(e) => { setmobileno(e.target.value) }} required />
                                </div>
                                <button className="btn btn-primary shadow-2 mb-4" onClick={login}>Login</button>
                            </div>
                            <a href='#' style={{ color: '#48C9B0', fontWeight: 'bold', padding: 10 }} onClick={() => { setloginflg(false) }}>New User? Register</a>
                        </div> :
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-unlock auth-icon" /><h5 className="mb-2">Register</h5>
                                </div>
                                {/* <h3 className="mb-4">Register   </h3> */}
                                {validation_msg ? <p style={{ color: "darkred" }}>{validation_msg}</p> : null}

                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Enter UserName" value={user_name} onChange={(e) => { validation(e) }} required />
                                </div>
                                {validation_username ? <p style={{ color: "darkred" }}>{validation_username}</p> : null}

                                <div className="input-group mb-4">
                                    <input type="number" className="form-control" placeholder="Enter Mobile Number" max={10} value={user_mobileno} onChange={(e) => { setmobileno(e.target.value) }} required />
                                </div>
                                <button className="btn btn-primary shadow-2 mb-4" onClick={submit}>Register</button>
                            </div>
                            <a href='#' style={{ color: '#48C9B0', fontWeight: 'bold', padding: 10 }} onClick={() => { setloginflg(true) }}>Alredy registered ? Login</a>
                        </div>}
                </div>
            </div>
        </>
    );
}

export default Register






























