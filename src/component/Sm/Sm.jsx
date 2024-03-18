import React, { useRef, useState, useEffect, useContext } from 'react';
import LeftPanel from '../LeftPanel/LeftPanel';
import Profile from '../Profile/Profile';
import axios from '../../shared/eaxios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Sm = () => {
    const params = useParams();
    console.log('params', params.id)

    const userData = useSelector((state) => {
        return state.loggedin.jwtToken
    })
    const userFirstName = useSelector((state) => {
        return state.loggedin?.userDetails?.firstName
    })
    const userLastName = useSelector((state) => {
        return state.loggedin?.userDetails?.lastName
    })

    const [loader, setLoader] = useState(false);
    const [smList, setSmList] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        getSmList();
    }, [])

    const getSmList = (
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
                    `/sm/?hhfl_id=${params.id}`, config
                )
                .then(res => {
                    //const totalCount = res.data.total;
                    setLoader(false);
                    console.log("getSmList", res.data.data);
                    setSmList(res.data.data);
                })
                .catch(err => {
                    setErrMsg(err.response.statusText);
                    setLoader(false);
                    console.log(err.response.statusText);
                });
        };


  return (
    <>
        <div className='container-fluid mainWrapper'>
            <LeftPanel />
            <div className='rightPan'>
                <div className='header'>
                    <h1>View SM tagged with {userFirstName}{" "}{userLastName}</h1>
                    <Profile />
                </div>

                <div className='tablePan'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>SM Name ID</th>
                                <th>Name</th>
                                <th>Mobile no.</th>
                                <th>SM email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errMsg ? (
                                <tr>
                                <td colSpan={4} className="text-center">
                                    {errMsg}
                                </td>
                                </tr>
                            ) : loader ? (
                                <tr>
                                <td colSpan={4} className="text-center">
                                    <LoadingSpinner />
                                </td>
                                </tr>
                            ) : smList.length > 0 ? (
                                smList.map((sm, i) => (
                                <tr key={i}>
                                    <td>{sm?.id}</td>
                                    <td>{sm?.name}</td>
                                    <td>{sm?.mobile}</td>
                                    <td>{sm?.email}</td>
                                </tr>
                                ))
                            ) : errMsg ? null : (
                                <tr>
                                <td colSpan={4}>
                                    <p className="text-center">No records found</p>
                                </td>
                                </tr>
                            )}
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
  )
}

export default Sm