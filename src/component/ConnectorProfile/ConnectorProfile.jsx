import React, { useRef, useState, useEffect, useContext } from 'react';
import LeftPanel from '../LeftPanel/LeftPanel';
import Profile from '../Profile/Profile';
import { useParams } from 'react-router-dom';
import {instance2} from '../../shared/eaxios';
import axios from '../../shared/eaxios';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import blankProfile from "./../../assets/images/blank-profile.png";

const ConnectorProfile = () => {
    const params = useParams();
    console.log('params', params.id)

    const [loader, setLoader] = useState(false);
    const [profileDetils, setProfileDetils] =useState({});
    const [userDetils, setUserDetils] =useState('');
    const [kycDetails, setKycDetils] =useState('');
    const [errMsg, setErrMsg] = useState('');


    const userData = useSelector((state) => {
        return state.loggedin.jwtToken
    })


    useEffect(() => {
        getUserDetails();
    }, [])

    // const getList = () => {
    //     setLoader(true);
    //     instance2
    //         .get(
    //             `kycs?populate[0]=bankId&populate[1]=userId&populate[2]=aadharCardId&populate[3]=panCardId&populate[4]=userId.city&populate[5]=userId.state&populate[6]=userId.pincode&populate[7]=userId.fiReport&filters[userId]=${params.id}`
    //         )
    //         .then(res => {
    //             //const totalCount = res.data.total;
    //             setLoader(false);
    //             const data = res.data.data;
    //             console.log("getList", data);
    //             setProfileDetils(data);
    //         })
    //         .catch(err => {
    //             setErrMsg(err);
    //             setLoader(false);
    //         });
    //     };


    const getUserDetails = (
        ) => {
            setLoader(true);
            const config = {
                headers: { 
                    "Authorization": `Bearer ${userData}`,
                    'x-api-key': `${import.meta.env.VITE_API_KEY}`
                }
            };
            axios
                .get(
                    `/admin/users?connectorId=${params.id}`, config
                )
                .then(res => {
                    //const totalCount = res.data.total;
                    setLoader(false);
                    console.log("getUserDetails", res.data.data);
                    setUserDetils(res.data.data);
                })
                .catch(err => {
                    setErrMsg(err.response.statusText);
                    console.log('err', err.response.statusText);
                    setLoader(false);
                });
        };




  return (
    <>
        <div className='container-fluid mainWrapper'>
            <LeftPanel />
            <div className='rightPan'>
                <div className='header'>
                    <h1>View connector profile</h1>
                    <Profile />
                </div>

                
                <div className='profilePan'>


                        {errMsg ? (
                            <div className="alert alert-danger text-center mb-4">
                                {errMsg}
                            </div>
                        ) : loader ? (
                            <div className='text-center' style={{width:`100%`}}>
                            <LoadingSpinner />
                            </div>
                        ) : userDetils.length > 0 ?(
                            userDetils.map((details, index) => (
                                <div className='profileWrap' key={index}>

                                    <div>
                                        <div className='profilePic'>
                                            { details.profilePhoto !== null ? (
                                                details.profilePhoto.map((item, i) => (
                                                    <div className='picWrap' key={i}>
                                                        <img src={`${import.meta.env.VITE_IMG_URL}${item?.url}`} alt='Profile' />
                                                    </div>
                                                ))
                                                ):(
                                                    <div className='picWrap'>
                                                        <img src={blankProfile} alt='Profile' />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className='profileName'>
                                            {details?.firstName}{" "}
                                            {details?.lastName}
                                        </div>
                                    </div>

                                    <div className='profileDetails'>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <label>First name</label>
                                                <span className='value'>
                                                    {details?.firstName}
                                                </span>

                                                <label>Last name</label>
                                                <span className='value'>
                                                    {details?.lastName}
                                                </span>

                                                <label>Mobile no</label>
                                                <span className='value'>
                                                    {details?.mobileNumber}
                                                </span>

                                                <label>Email</label>
                                                <span className='value'>
                                                    {details?.email}
                                                </span>
                                            </div>
                                            <div className='col-3'>
                                                <label>Leads generated</label>
                                                <span className='value'>
                                                    {details?.leadCount}
                                                </span>
                                                <label>PAN</label>
                                                <span className='value'>
                                                    {details?.kycId?.panCardId?.panNumber}
                                                </span>
                                                 <label>Aadhaar</label>
                                                <span className='value'>
                                                    {details?.kycId?.aadharCardId?.aadharNumber}
                                                </span>
                                                <label>City</label>
                                                <span className='value'>
                                                    {details?.city?.name}
                                                </span> 
                                            </div>
                                            <div className='col-3'>
                                                <label>State</label>
                                                <span className='value'>
                                                    {details?.state?.name}
                                                </span>
                                                <label>Pincode</label>
                                                <span className='value'>
                                                    {details?.pincode?.pincode}
                                                </span>
                                                <label>Status</label>
                                                <span className='value'>
                                                    
                                                </span>
                                                <label>Agreement</label>
                                                <span className='value'>
                                                    
                                                </span>
                                            </div>
                                            <div className='col-2'>
                                                <label>Bank Account</label>
                                                <span className='value'>
                                                    {details?.kycId?.bankId?.accountNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))
                        ) : errMsg ? null : (
                            <div>
                                <p className="text-center" style={{width:`100%`}}>No records found</p>
                            </div>
                        )}

                </div>

            </div>
        </div>
    
    </>
  )
}

export default ConnectorProfile