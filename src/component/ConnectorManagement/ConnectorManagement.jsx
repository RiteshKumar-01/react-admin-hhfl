import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react';
import { IoSearchSharp, IoCloudUploadOutline, IoCloudDownloadOutline, IoSettingsOutline   } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import {
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Modal, ModalHeader, ModalBody, ModalFooter
  } from 'reactstrap';
import LeftPanel from '../LeftPanel/LeftPanel';
import Profile from '../Profile/Profile';
import axios from '../../shared/eaxios';
import {instance2} from '../../shared/eaxios';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import moment from 'moment';


// import ReactPaginate from "react-paginate";

const ConnectorManagement = () => {

    const userData = useSelector((state) => {
        return state.loggedin.jwtToken
    })
    const userFirstName = useSelector((state) => {
        return state.loggedin?.userDetails?.firstName
    })
    const userLastName = useSelector((state) => {
        return state.loggedin?.userDetails?.lastName
    })

    

    //const [dropdownOpen, setDropdownOpen] = useState(false);
    //const toggle = () => setDropdownOpen((prevState) => !prevState);

    const [uploadModal, setUploadModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [connectorList, setConnectorList] =useState({});
    const [errMsg, setErrMsg] = useState('');
    const [stateList, setStateList] = useState({});
    const [cityList, setCityList] = useState({});
    const [searchTxt, setSearchTxt] = useState('');
    const [pageCount, setpageCount] = useState(0);
    const [filterCity, setFilterCity] = useState(0);
    const [filterState, setFilterState] = useState(0);
    const [filterSearch, setFilterSearch] = useState('');
    const [dates, setDates] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    let limit = 25;


    const uploadModaltoggle = () => setUploadModal(!uploadModal);

    const { combine, allowedMaxDays, beforeToday, afterToday, allowedDays } = DateRangePicker;

    const handleChange = () =>{
        // do something with event data
    }

    useEffect(() => {
        getList();
        getStateList();
    }, [])

    const getList = (state, city, search, date1, date2) => {

        setLoader(true);
        const config = {
            headers: { 
                "Authorization": `Bearer ${userData}`,
                'x-api-key': `${import.meta.env.VITE_API_KEY}`
            }
        };

          let search_nospace = search && search.replace(/\s+/g, '');
          // Create a query string with non-empty filters
          let queryString = `/admin/users?pageStart=0&pageLimit=${limit}`;
          
          if (state) {
            queryString += `&filterState=${state}`;
          }

          if (city) {
            queryString += `&filterCity=${city}`;
          }
          
          if (search_nospace) {
            queryString += `&filterSearch=${search_nospace}`;
          }

          if (date1) {
            queryString += `&minDate=${date1}`;
          }

          if (date2) {
            queryString += `&maxDate=${date2}`;
          }
          
          axios.get(queryString, config)
            .then(res => {
                setLoader(false);
                console.log("getList", res);
                setConnectorList(res.data.data);
            })
            .catch(err => {
                setErrMsg(err.response.data);
                console.log('err', err.response.data);
                setLoader(false);
            });


    };

    const getSearch = () => {
        setFilterSearch(searchTxt)
        getList(filterState, filterCity, searchTxt, startDate, endDate);
        console.log('search', searchTxt)
    };

    const resetSearch = () => {
        document.getElementById('searchField').value = "";
        setFilterSearch("");
        setSearchTxt('');
        getList();
    }

    const getStateList = () => {
        instance2
            .get(
                `states`
            )
            .then(states => {
                console.log("states", states.data.data);
                setStateList(states.data.data);
            })
            .catch(err => {
                console.log('stateerr', err.response.statusText);
            });
    }

    const filterStateChange = (e) => {
        //console.log('stateFilter', e.target.value);
        setFilterState(e.target.value);
        getCityList(e.target.value);
        getList(e.target.value, filterCity, filterSearch, startDate, endDate );
    }

    const filterCityChange = (e) => {
        //console.log('CityFilter', e.target.value);
        setFilterCity(e.target.value);
        getList(filterState, e.target.value, filterSearch, startDate, endDate);
    }

    const getCityList = (stateId) => {
        instance2
            .get(
                `cities?filters[state]=${stateId}`
            )
            .then(city => {
                console.log("city", city.data.data);
                setCityList(city.data.data);
            })
            .catch(err => {
                console.log('cityerr', err.response.statusText);
            });
    }
    
    useEffect(() => {
        console.log('dates', dates);
    }, [dates])


    const resetFilter = () => {
        setFilterState('');
        setFilterCity('');
        getList();
        getCityList('');
        setDates([]);
        resetSearch();
    }

    const setDate = (e) => {
        setDates(e);
        console.log('eeee', e[0]);
        const startDate = moment(e[0]).format('YYYY-MM-DD');
        const endDate = moment(e[1]).format('YYYY-MM-DD')
        setStartDate(startDate);
        setEndDate(endDate);


        console.log('startDate', startDate);
        console.log('endDate', endDate);
        getList(filterState, filterCity, filterSearch, startDate, endDate);
    }
    

    const handlePageClick = async (data) => {
        console.log(data.selected);
    
        // let currentPage = data.selected + 1;
    
        // const commentsFormServer = await fetchComments(currentPage);
    
        // setItems(commentsFormServer);
        // scroll to the top
        //window.scrollTo(0, 0)
      };

    return (
        <>
        <div className='container-fluid mainWrapper'>
            <LeftPanel />

            <div className='rightPan'>
                <div className='header'>
                    <h1>Welcome to {userFirstName}{" "}{userLastName}</h1>
                    <Profile />
                </div>

                <div className='filterPanel'>
                    <div className='searchWrap'>
                    <form>
                        <input 
                            type='text'
                            id="searchField"
                            placeholder='Search by connector name, email, SM name......'
                            //onChange={(e) => getSearch(e.target.value)}
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

                    <div className='filterWrap'>
                        <DateRangePicker
                            placeholder="Select Date Range"
                            shouldDisableDate={afterToday(false)}
                            value={dates} 
                            onChange={e => setDate(e)} 
                        />
                        <select disabled={true} className='disabled'>
                            <option>SM type</option>
                        </select>
                        <select
                            onChange={filterStateChange}
                            value={filterState}
                        >
                            <option value=''>State</option>
                            {
                                stateList.length > 0 && 
                                    stateList.map((state, i) => (
                                        <option key={i} value={state.id}>{state.attributes.name}</option>
                                ))
                            }
                          
                        </select>
                        <select
                            id="StateDropdown"
                            onChange={filterCityChange}
                            value={filterCity}
                            disabled={
                                cityList.length ? false : true
                            }
                            className={
                                cityList.length ? '' : 'disabled'
                            }
                        >
                            <option value=''>City</option>
                            {
                                cityList.length > 0 && 
                                cityList.map((city, i) => (
                                        <option key={i} value={city.id}>{city.attributes.name}</option>
                                ))
                            }
                        </select>
                        <Button className='resetFilter' onClick={resetFilter} title='Clear Filter'>
                            <MdOutlineRefresh />
                        </Button>
                    </div>

                    <div className='btnWrap'>
                        <Button color="primary" className='gradientBtn disabled' onClick={uploadModaltoggle}>
                            Payout <IoCloudUploadOutline />
                        </Button>
                        <Button color="primary" className='gradientBtn disabled'>
                            Export <IoCloudDownloadOutline />
                        </Button>
                    </div>
                    
                </div>

                <div className='tablePan'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Connector ID</th>
                                <th>Connector name</th>
                                <th>SM name</th>
                                <th>SM email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {errMsg ? (
                                <tr>
                                <td colSpan={6} className="text-center">
                                    {errMsg}
                                </td>
                                </tr>
                            ) : loader ? (
                                <tr>
                                <td colSpan={6} className="text-center">
                                    <LoadingSpinner />
                                </td>
                                </tr>
                            ) : connectorList.length > 0 ? (
                                connectorList.map((connector, k) => (
                                <tr key={k}>
                                    <td>{connector?.connectorId}</td>
                                    <td>{connector?.firstName}{" "}{connector?.lastName}</td>
                                    <td>{connector?.smId?.name}</td>
                                    <td>{connector?.email}</td>
                                    <td>
                                        {/* {connector?.state.name} */}
                                        {/* {connector?.createdAt} */}
                                    </td>
                                    <td>
                                        <UncontrolledDropdown>
                                            <DropdownToggle><IoSettingsOutline  /></DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem 
                                                    tag={Link} 
                                                    to={{ pathname: `/connector-profile/${connector?.connectorId}`}}>
                                                        <RiArrowRightSLine />
                                                        View connector profile
                                                </DropdownItem>

                                                <DropdownItem 
                                                    tag={Link} 
                                                    to={{ pathname: `/sm/${connector?.smId?.hhfl_id}`}}>
                                                        <RiArrowRightSLine />
                                                        View SM tagged
                                                </DropdownItem>
                                                
                                                {connector?.fiReport?.id !== undefined && (
                                                <DropdownItem 
                                                    tag={Link} 
                                                    to={{ pathname: `/upload-fireport/${connector?.fiReport?.id}`}}>
                                                        <RiArrowRightSLine />
                                                        Upload FI report
                                                </DropdownItem>
                                                )}

                                                <DropdownItem 
                                                    tag={Link} 
                                                    to={{ pathname: `/lead/${connector?.id}`}}>
                                                        <RiArrowRightSLine />
                                                        Leads submitted
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </td>
                                </tr>
                                ))
                            ) : errMsg ? null : (
                                <tr>
                                <td colSpan={6}>
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
                        pageCount={pageCount}
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

        <Modal size='sm' isOpen={uploadModal} toggle={uploadModaltoggle}>
            <ModalBody className='uploadModal'>
                <div className='uploadIcon'><IoCloudUploadOutline /></div>
                <Button color="primary" className='gradientBtn uploadBtn' onClick={uploadModaltoggle}>
                Upload 
                </Button>
                <input onChange={handleChange} multiple={false}  type='file' />
                <p>File size maximum 5kb</p>
                <p className='linkTxt'>View sample payout file</p>
            </ModalBody>
        </Modal>

        </>
    )
}

export default ConnectorManagement