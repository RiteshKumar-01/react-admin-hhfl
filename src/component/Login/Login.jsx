import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react';
import { Button } from 'reactstrap';
import logo from "./../../assets/images/logo.png";
import { FiUser } from "react-icons/fi";
import { IoKeyOutline } from "react-icons/io5";
//import AuthContext from "./../../context/AuthProvider";
import axios from '../../shared/eaxios';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateToken, updateUserDetails } from '../../store/slices/UserSlice';


const Login = () => {

    //const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [loader, setLoader] = useState(false);
    const [userDetails, setUserDetails] = useState('');
    const [login, setLogin] = useState(false)


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [userName, password])




    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log('user', userName, password );
        setLoader(true);

        const payload = {
            username: userName,
            password: password
        }

        axios
        .post(`/admin/login`, payload, {
            headers: {
                'x-api-key': `${import.meta.env.VITE_API_KEY}`
            }
        })
        .then(({ data }) => {
            console.log('data', data);
            setLoader(false);
            // if (data.response?.status === 200) {
            //     console.log('success');
            // }
            setSuccess(true);
            setUserDetails(data);
            setLogin(true);
            dispatch (updateToken(data.jwt));
            dispatch (updateUserDetails(data.user));
            navigate(`/connector-management`);

        })
        .catch(err => {
            console.log('error', err);
            setLoader(false);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            setTimeout(() => {
                setErrMsg(null);
                setUserName("");
                setPassword("");
                userRef.current.focus();
            }, 2500);

        });

    }



  return (
    <>
        <div className='loginWrap'>
            <div className="loginColumn left"></div>
            <div className="loginColumn right">
                <div className="row loginRow">
                    <div className='col-8 loginCol'>
                        <div className='loginLogo'><img src={logo} alt=""  /></div>
                        <h1>Welcome to <br />
                        Hero Housing Finance Connector Admin Panel</h1>

                        {loader && (
                            <span className="loaderStyle">
                                <LoadingSpinner />
                            </span>
                        )}


                        {success ? (
                            <section>
                                <h1>You are logged in!</h1>
                            </section>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                
                                <p className={errMsg ? "errmsg alert alert-danger" : "offscreen"}>{errMsg}</p>

                                <div className='inputWrap'>
                                    <FiUser />
                                    <input 
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUserName(e.target.value)}
                                        value={userName}
                                        className='form-control'
                                        placeholder='User name'
                                        required
                                    />
                                </div>
                                <div className='inputWrap'>
                                    <IoKeyOutline />
                                    <input 
                                        className='form-control' 
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        placeholder='Password'
                                        required
                                    />
                                </div>
                                <Button className='gradientBtn' color="primary">
                                Login
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login