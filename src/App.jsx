import { useState } from 'react'
import './App.css'
import Login from './component/Login/Login'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import ConnectorManagement from './component/ConnectorManagement/ConnectorManagement';
import ConnectorProfile from './component/ConnectorProfile/ConnectorProfile';
import Sm from './component/Sm/Sm';
import Lead from './component/Lead/Lead';
import UploadFiReport from './component/UploadFiReport/UploadFiReport';

function App() {

  const userData = useSelector((state) => {
      return state.loggedin
  })
  //console.log('datajwt', data.jwtToken);

  const PrivateRoute = ({ children }) => {
    return userData?.jwtToken ? children : <Navigate to="/login" />;
  };

  return (
    <>
    
      <BrowserRouter>
        <Routes>
          {userData.jwtToken === null ? (
            <>
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />}/>
            </>
          ):(
            <>
            <Route index element={<ConnectorManagement />} />
            <Route path="/login" element={<ConnectorManagement />}/>
            </>
          )}
          
          <Route 
            path="/connector-management" 
            element={
              <PrivateRoute>
                <ConnectorManagement />
              </PrivateRoute>
            }
          />

          <Route 
            path="/connector-profile/:id" 
            element={
              <PrivateRoute>
                <ConnectorProfile />
              </PrivateRoute>
            }
          />

          <Route 
            path="/sm/:id" 
            element={
              <PrivateRoute>
                <Sm />
              </PrivateRoute>
            }
          />

          <Route 
            path="/lead/:id" 
            element={
              <PrivateRoute>
                <Lead />
              </PrivateRoute>
            }
          />

          <Route 
            path="/upload-fireport/:id" 
            element={
              <PrivateRoute>
                <UploadFiReport />
              </PrivateRoute>
            }
          />

          {/* <Route path="/connector-management" element={<ConnectorManagement />}/> */}

        </Routes>



      </BrowserRouter>
    </>
  )
}

export default App
