import '../../pages/messenger/messenger.css';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import TutorContact from '../tutorContacts/TutorContact';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import LogoutIcon from '@mui/icons-material/Logout';
import Session from '../sessionTab/Session';
import PaymentData from '../paymentTab/PaymentData';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

const RightSec = ({newSessions, interestedTutors, clientPayment, tutorPayout}) => {
  const [tutorList, setTutorList] = useState([]);
  const [tutorTagUpdated, setTutorTagUpdated] = useState();
  const [tutorRatingUpdated, setTutorRatingUpdated] = useState();
  const [searchTutor, setSearchTutor] = useState();

  const [tutorCount, setTutorCount] = useState(0);
  const [tutorPage, setTutorPage] = useState(1);
  const [tutorListLoading, setTutorListLoading] = useState(true);

  const [tutorTab, setTutorTab] = useState(true);
  const [sessionTab, setSessionTab] = useState(false);
  const [paymentTab, setPaymentTab] = useState(false);
  const [clickedNoti, setClickedNoti] = useState(false);
  const [val, setval] = useState(1);
  const [updated, setUpdated] = useState(false);


  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setClickedNoti(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //fetching tutors list
  useEffect(() => {
    const getTutors = async () => {

      if(searchTutor) {
        try {
          const res = await axios.get(
            `${localStorage.getItem('api')}/api/tutor/getTutors/${searchTutor}`,
            {
              params: {
                page: val,
                limit: 20,
              },
            },
            {
              headers: '',
            }
          );
          setTutorList(res.data.result);
          setTutorListLoading(false);
          setTutorCount(res.data.length);
          setTutorPage(val);

        } catch (err) {
          setTutorListLoading(false);
          console.log(err.Error);
        }
      } else {
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/tutor/getTutors`,
          {
            params: {
              page: 1,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        setTutorList(res?.data?.result);
        setTutorCount(res.data.length);
        setTutorListLoading(false);
      } catch (err) {
        console.log(err.Error);
        setTutorListLoading(false);
      }
    }
    };
    getTutors();
  }, [tutorTagUpdated, tutorRatingUpdated, updated]);

  useEffect(() => {
    if(newSessions && newSessions.length > 0) {
      setClickedNoti(false);
    }
  }, [newSessions])

  const handleTutorList = async (event, value) => {
    if (searchTutor) {
      setTutorListLoading(true);
      setTutorPage(value);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/tutor/getTutors/${searchTutor}`,
          {
            params: {
              page: value,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setTutorList(res.data.result);
        setTutorListLoading(false);
        setval(value);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      setTutorListLoading(true);
      setTutorPage(value);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/tutor/getTutors`,
          {
            params: {
              page: value,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setTutorList(res.data.result);
        setTutorListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSearchTutors = async (e) => {
    setSearchTutor(e.target.value);
    if (e.key == 'Enter') {
      setTutorListLoading(true);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/tutor/getTutors/${e.target.value}`,
          {
            params: {
              page: 1,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setTutorListLoading(false);
        setTutorList(res.data.result);
        setTutorCount(res.data.length);
        setTutorPage(1);
        // setTutorListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleTutorTab = () => {
    setTutorTab(true);
    setSessionTab(false);
    setPaymentTab(false);
  };
  const handleSessionTab = () => {
    setTutorTab(false);
    setSessionTab(true);
    setPaymentTab(false);
  };
  const handlePaymentTab = () => {
    setTutorTab(false);
    setSessionTab(false);
    setPaymentTab(true);
  };

  //   const logOutFunc = () => {
  //     localStorage.clear();
  //     window.location.reload();
  //   };

  return (
    <div className='chatMenu2'>
      <header className='chat_header2'>
        <div
          style={{
            flex: '1',
            fontSize: `${tutorTab ? '17px' : '16px'}`,
            fontWeight: '600',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${tutorTab ? '#5e8de7' : '#EDEDED'}`,
            color: `${tutorTab ? '#fff' : 'black'}`,
            borderRight: '1px solid lightgray',
            cursor: 'pointer',
          }}
          onClick={handleTutorTab}
        >
          Tutors List
        </div>
        <div
          style={{
            flex: '1',
            fontSize: `${sessionTab ? '17px' : '16px'}`,
            // marginLeft: '10px',
            fontWeight: '600',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${sessionTab ? '#5e8de7' : '#EDEDED'}`,
            color: `${sessionTab ? '#fff' : 'black'}`,
            borderRight: '1px solid lightgray',
            cursor: 'pointer',
          }}
          onClick={handleSessionTab}
        >
          Sessions12345
        </div>
        <div
          style={{
            flex: '1',
            fontSize: `${paymentTab ? '17px' : '16px'}`,
            // marginLeft: '10px',
            fontWeight: '600',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${paymentTab ? '#5e8de7' : '#EDEDED'}`,
            color: `${paymentTab ? '#fff' : 'black'}`,
            cursor: 'pointer',
          }}
          onClick={handlePaymentTab}
        >
          Payments
        </div><div
          // style={{
          //   flex: '1',
          //   fontSize: `${paymentTab ? '17px' : '16px'}`,
          //   // marginLeft: '10px',
          //   fontWeight: '600',
          //   height: '100%',
          //   display: 'flex',
          //   alignItems: 'center',
          //   justifyContent: 'center',
          //   backgroundColor: `${paymentTab ? '#5e8de7' : '#EDEDED'}`,
          //   color: `${paymentTab ? '#fff' : 'black'}`,
          // }}
        >
           <div style={{ placeSelf: 'center' }}>
              <IconButton
                aria-label='more'
                style={{marginLeft: '-16px', marginRight: '6px'}}
                id='long-button'
                aria-controls='long-menu'
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
              >
                {newSessions && !clickedNoti ? <Badge color="success" badgeContent="" variant='dot'>
                  <NotificationsIcon fontSize='small' style={{ placeSelf: 'center', color: 'gray' }} />
                </Badge> :
                <NotificationsIcon fontSize='small' style={{ placeSelf: 'center', color: 'gray' }} />}
              </IconButton>
              <Menu
                id='long-menu'
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '35ch',
                  },
                }}
              >
                {newSessions ? newSessions?.map((option, i, arr) => (
                  <MenuItem
                    key={option.session_id}
                    // selected={option.session_id == arr[0].session_id}
                    onClick={handleClose}
                    style={{
                      fontSize: '14px'
                    }}
                  >
                   New<span style={{marginLeft: '4px', marginRight: '4px', fontWeight: '700'}}>{option?.type}</span>available<span style={{marginLeft: '4px', fontWeight: '700'}}>{'ID: '}{option?.session_id}</span> 
                  </MenuItem>
                )) : 
                  <MenuItem
                    key='no'
                  >
                    No new notifications
                  </MenuItem>}
              </Menu>
            </div>
        </div>
        {/* <PersonAddAltOutlinedIcon
              style={{
                fontSize: '32px',
                color: addNewContact ? '#337DDD' : '#50585C',
                cursor: 'pointer',
                marginRight: '10px',
              }}
              onClick={() => setAddNewContact(true)}
            /> */}
        {/* <MoreVertIcon
              style={{
                fontSize: '25px',
                color: '#50585C',
                cursor: 'pointer',
                marginRight: '-10px',
              }}
            /> */}
      </header>
      {tutorTab ? (
        <div>
          <div
            style={{
              height: '2.3rem',
              padding: '6px 0px 6px 17px',
              backgroundColor: '#9DE1FE',
            }}
          >
            <input
              placeholder='Search for tutors'
              className='chatMenuInput'
              // onChange={(e) => handleSearchTutors(e)}
              onKeyPress={handleSearchTutors}
            />
          </div>

          {tutorListLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '100px',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <div className='chatMenuWrapper'>
              {tutorList?.map((c) => (
                <div
                // onClick={() => {
                //   setCurrentChat(c);
                //   setHighlighted(true);
                //   setShowTemplateMsg(false);
                //   setTaglabel('');
                //   setTagUpdated('');
                // }}
                >
                  <TutorContact
                    conversation={c}
                    setTutorTagUpdated={setTutorTagUpdated}
                    setTutorRatingUpdated={setTutorRatingUpdated}
                    updated={updated}
                    setUpdated={setUpdated}
                    searchTutor={searchTutor}
                    // currentChat={currentChat}
                    // finalMessage={finalMessage}
                    // alertMsg={alertMsg}
                    // arrivalMessage={arrivalMessage}
                    // alert={alert}
                    // // newNotification={newNotification}
                    // setAlert={setAlert}
                    // msgCountUpdated={msgCountUpdated}
                    // setMsgCountUpdated={setMsgCountUpdated}
                    // setPinned={setPinned}
                    // setMarkChat={setMarkChat}
                    // setAlertUpdate={setAlertUpdate}
                    // apiUrl={apiUrl}
                  />
                </div>
              ))}
              <Pagination
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '15px',
                }}
                count={Math.ceil(tutorCount / 20)}
                page={tutorPage}
                onChange={handleTutorList}
              />
            </div>
          )}
        </div>
      ) : sessionTab ? (
        <div>
          <Session tutorList={tutorList} setTutorList={setTutorList} searchTutor={searchTutor} handleSearchTutors={handleSearchTutors} tutorCount={tutorCount} interestedTutors={interestedTutors} clientPayment={clientPayment} tutorPayout={tutorPayout} />
        </div>
      ) : paymentTab ? (
        <div>
          <PaymentData />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default RightSec;
