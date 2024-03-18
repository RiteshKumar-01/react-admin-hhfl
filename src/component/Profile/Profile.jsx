import { useRef, useState, useEffect, useContext } from 'react';
import blankProfile from "./../../assets/images/blank-profile.png";
import { useSelector } from 'react-redux';

const Profile = () => {

  const profilePic = useSelector((state) => {
    return state.loggedin?.userDetails?.profilePhoto[0].url
})


useEffect(() => {
  console.log('profilePic', profilePic);
}, [])


  return (
    <>
        <div className='userPan'>
          {
            profilePic !== null ? (
              <img src={`${import.meta.env.VITE_IMG_URL}${profilePic}`} alt='Profile' />
            ):(
              <img src={blankProfile} alt='Profile' />
            )
          }
            


        </div>
    </>
  )
}

export default Profile