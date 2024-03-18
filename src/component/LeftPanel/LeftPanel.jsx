import React from 'react'
import logo from "./../../assets/images/logo.png";
import { RiLinksLine, RiLogoutCircleRLine  } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { clearUsers } from '../../store/slices/UserSlice';

const LeftPanel = () => {

    const dispatch = useDispatch();

    const logOut = () => {
        dispatch (clearUsers());
    }



  return (
    <>
        <div className='leftPan'>
            <div className='leftLogoPan'>
                <img src={logo} alt=""  />
            </div>
            <div className='leftMenuPan'>
                <ul>
                    <li> 
                        <Link to="/connector-management"><RiLinksLine /> Connector management</Link>
                    </li>
                    <li className='logOut'> 
                        <Link onClick={logOut}><RiLogoutCircleRLine  /> Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    </>
  )
}

export default LeftPanel