import React, { useRef, useState, useEffect, useContext, Fragment } from 'react';
import LeftPanel from '../LeftPanel/LeftPanel';
import Profile from '../Profile/Profile';
import { useParams } from 'react-router-dom';
import {instance2} from '../../shared/eaxios';
import axios from '../../shared/eaxios';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import Select from 'react-select';
import {useDropzone} from 'react-dropzone';
import Dropzone from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import {
    Button,
    Modal, ModalHeader, ModalBody, ModalFooter
  } from 'reactstrap';

const StatusOption = [
    { value: 'Completed', label: 'Completed' },
    { value: 'In-Progress', label: 'In-Progress' },
    { value: 'Rejected', label: 'Rejected' },
  ];


const UploadFiReport = () => {
    const params = useParams();
    console.log('params', params.id)

    const userData = useSelector((state) => {
        return state.loggedin.jwtToken
    })
    const selectInputRef = useRef();

    const [loader, setLoader] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('')
    const [selectedOption, setSelectedOption] = useState('');
    const [file, setFile] = useState('');
    const [successModal, setSuccessModal] = useState(false);
    const {
        acceptedFiles, 
        getRootProps, 
        getInputProps, 
        } = useDropzone(
        {
            acceptedFiles: ['image/*'].join(',')
        }
    );

    const onClear = () => {
        selectInputRef.current.clearValue();
      };

    const submitUpload = () => {
            setLoader(true);
            const config = {
                headers: { 
                    "Authorization": `Bearer ${userData}`,
                    'x-api-key': `${import.meta.env.VITE_API_KEY}`,
                    "Content-Type": "multipart/form-data"
                }
            };
            const formData = new FormData();
            formData.append("fiId", `${params.id}`);
            for (let i = 0; i < file.length; i++) {
                formData.append(`fiReport`, file[i]);
              }
            formData.append("status", `${selectedOption.value}`);
            axios
                .put(
                    `/admin/editFI`, formData, config
                )
                .then(res => {
                    setLoader(false);
                    console.log("res", res);
                    setSuccessMsg(res.data.message);
                    successModaltoggle();
                    setFile('');
                    onClear();
                })
                .catch(err => {
                    setLoader(false);
                    console.log('err', err.response.statusText);
                    setErrMsg(err.response.statusText);
                    setTimeout(() => {
                        setErrMsg(null);
                        onClear();
                        setFile('');
                    }, 2500);
                    
                });
        };

    const onDrop = (f) => {
        console.log();
        setFile(f);
    }
    const onDragEnter = () => {
        console.log('onDragEnter');
    };

    const onDragLeave = () => {
        console.log('onDragLeave');
    };

    useEffect(() => {
        console.log('selectedOption', selectedOption);
    }, [selectedOption])


    const successModaltoggle = () => setSuccessModal(!successModal);

  return (
    <>
        <div className='container-fluid mainWrapper'>
            <LeftPanel />
            <div className='rightPan'>
                <div className='header'>
                    <h1>Upload FI report</h1>
                    <Profile />
                </div>

                <form action="">
                <div className='uploadPan'>
                {errMsg &&
                <div className="alert alert-danger text-center mb-4">
                    {errMsg}
                </div>
                }
                {loader && <div className='text-center'><LoadingSpinner /></div>}
                
                    <div className='uploadInner'>
                        <div className='uploadLeft'>
                            <div className='selectWrap'>
                                <Select
                                    ref={selectInputRef}
                                    defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    options={StatusOption}
                                />
                            </div>
                        </div>
                        <div className='uploadRight'>
                            <label>Upload Image</label>

                            <Dropzone 
                                onDrop={onDrop}
                                onDragEnter={onDragEnter}
                                onDragLeave={onDragLeave}
                            >
                            {({getRootProps, getInputProps}) => (
                                <div className='dropzone' {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <FiUploadCloud />
                                    <h4>Upload</h4>
                                    <>
                                        {file.length > 0 && file.map((f, i) => (
                                        <div key={i}>
                                            {f.name} - {f.size} bytes
                                        </div>
                                        ))}
                                    </>
                                </div>
                            )}
                            </Dropzone>

                        </div>
                        <div className='uploadBtnPan'>
                            <Button 
                            disabled={
                                selectedOption ? false : true
                            }
                             className='gradientBtn uploadBtn' onClick={submitUpload}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
                </form>
    
            </div>
        </div>

        <Modal size='sm' isOpen={successModal} toggle={successModaltoggle}>
            <ModalBody className='successModal'>
                <IoIosCheckmarkCircleOutline />
                {successMsg && successMsg}
            </ModalBody>
        </Modal>

    </>
  )
}

export default UploadFiReport