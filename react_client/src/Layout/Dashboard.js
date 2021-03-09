import React, { useEffect, useState, useRef, Suspense } from 'react';
import '../assets/scss/style.scss';
import { Register_User } from "../network/Apicall";

const Dashboard = () => {

    const [user_name, setusername] = useState();
    const [user_mobileno, setmobileno] = useState();
    const [loading, setloading] = useState();
    const [validation_msg, setvalidation_msg] = useState();
    const [validation_username, setvalidation_username] = useState();
    const [validation_usermobileno, setvalidation_usermobileno] = useState();

    const submit = async () => {
        if (user_name && user_mobileno) {
            if (String(user_mobileno).length < 10) {
                setvalidation_msg("Invalid Mobile Number");
            } else {
                let params = {
                    User_Name: user_name,
                    User_MobileNo: user_mobileno
                }
                let result = await Register_User(params);
                if (result.status) {
                    //this.props.history.push({ pathname: '/dashboard' })
                    //props.history.push({ pathname: '/Users' })

                } else {
                    let message = result.message
                    setvalidation_msg(message);
                }
            }
        } else {
            setvalidation_msg("UserName and Mobile nUmber Required");
        }
    }

    const validation = async (e) => {
        if (e.target.value.includes("+") || e.target.value.includes(" ") || e.target.value.includes("/") || e.target.value.includes("-")) {
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
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-8">
                                <i className="feather icon-unlock auth-icon" /><h5 className="mb-2">Dashbord</h5>
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
                            <button className="btn btn-primary shadow-2 mb-4" onClick={submit}>Call</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard
































