import React, { useRef, useState, useEffect, useContext } from 'react';
import LeftPanel from '../LeftPanel/LeftPanel';
import Profile from '../Profile/Profile';
import {instance2} from '../../shared/eaxios';
import axios from '../../shared/eaxios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { IoSearchSharp  } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import {
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Modal, ModalHeader, ModalBody, ModalFooter
  } from 'reactstrap';
  import ReactPaginate from "react-paginate";

const Lead = () => {

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
    const [leadList, setLeadList] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [searchTxt, setSearchTxt] = useState('');

    useEffect(() => {
        getLeadList();
    }, [])

    const getLeadList = (
        search = ""
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
                    `lead/getLeadAdmin?userId=${params.id}&filterSearch=${search}`, config
                )
                .then(res => {
                    //const totalCount = res.data.total;
                    setLoader(false);
                    console.log("getLeadList", res);
                    setLeadList(res.data.data.data);
                })
                .catch(err => {
                    setErrMsg(err.response.statusText);
                    setLoader(false);
                    console.log(err.response.statusText);
                });
        };

        const getSearch = () => {
            getLeadList(searchTxt);
            console.log('search', searchTxt)
        };
    
        const resetSearch = () => {
            document.getElementById('searchField').value = "";
            //setFilterSearch("");
            setSearchTxt('');
            getLeadList('');
        }

    // useEffect(() => {
    //     console.log('searchTxt', searchTxt);
    // }, [searchTxt])


    // const handlePageClick = async (data) => {
    //     console.log(data.selected);
    
    //     // let currentPage = data.selected + 1;
    
    //     // const commentsFormServer = await fetchComments(currentPage);
    
    //     // setItems(commentsFormServer);
    //     // scroll to the top
    //     //window.scrollTo(0, 0)
    //   };

  return (
    <>
        <div className='container-fluid mainWrapper'>
            <LeftPanel />
            <div className='rightPan'>
                <div className='header'>
                    <h1>Lead  submitted by {userFirstName}{" "}{userLastName}</h1>
                    <Profile />
                </div>

                <div className='filterPanel'>
                    <div className='searchWrap'>
                    <form>
                        <input 
                            type='text'
                            id="searchField"
                            placeholder='Search by lead name......'
                            onChange={e=>setSearchTxt(e.target.value)}
                            value={searchTxt}
                        />
                        { searchTxt && <Button className='clearSearch' onClick={resetSearch}><MdOutlineRefresh /></Button> }
                        <Button color="primary"
                        disabled={searchTxt ? false : true}
                        onClick={getSearch}
                        >
                            <IoSearchSharp  />
                        </Button>
                    </form>
                    </div>
                </div>

                <div className='tablePan'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Lead ID</th>
                                <th>Lead name</th>
                                <th>Loan amount</th>
                                <th>Lead created date</th>
                                <th>Mobile no.</th>
                                <th>Status</th>
                                <th>State</th>
                                <th>PIN</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errMsg ? (
                                <tr>
                                <td colSpan={9} className="text-center">
                                    {errMsg}
                                </td>
                                </tr>
                            ) : loader ? (
                                <tr>
                                <td colSpan={9} className="text-center">
                                    <LoadingSpinner />
                                </td>
                                </tr>
                            ) : leadList.length > 0 ? (
                                leadList.map((lead, i) => (
                                <tr key={i}>
                                    <td>
                                        {lead.id && lead.id}
                                    </td>
                                    <td>
                                        {lead.attributes && lead.attributes.firstName && lead.attributes.firstName}{" "}
                                        {lead.attributes && lead.attributes.lastName && lead.attributes.lastName}
                                    </td>
                                    <td>{lead.attributes && lead.attributes.loanAmount && lead.attributes.loanAmount}</td>
                                    <td>
                                        {lead.attributes && lead.attributes.createdAt && lead.attributes.createdAt.split("T", 1)}
                                    </td>
                                    <td>{lead.attributes && lead.attributes.mobilePhone && lead.attributes.mobilePhone}</td>
                                    <td>{lead.attributes && lead.attributes.status && lead.attributes.status}</td>
                                    <td>{lead?.attributes?.state?.data?.attributes?.name}</td>
                                    <td>{lead?.attributes?.pincode?.data?.attributes?.pincode}</td>
                                    <td>
                                        {lead?.attributes?.address1}<br />
                                        {lead?.attributes?.address2}
                                    </td>
                                </tr>
                                ))
                            ) : errMsg ? null : (
                                <tr>
                                <td colSpan={9}>
                                    <p className="text-center">No records found</p>
                                </td>
                                </tr>
                            )}
                            </tbody>
                    </table>
                </div>

                {/* <div>
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        pageCount={25}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div> */}
            </div>
        </div>
    </>
  )
}

export default Lead