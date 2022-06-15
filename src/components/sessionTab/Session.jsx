import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import './session.css';
import SessionList from './SessionList';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Chip from '@mui/material/Chip';
import StarPurple500SharpIcon from '@mui/icons-material/StarPurple500Sharp';
import Checkbox from '@mui/material/Checkbox';

import FormControlLabel from '@mui/material/FormControlLabel';
import { sendtemplateMsgUrl } from '../../serviceUrls/Message-Services';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FilterListOffRoundedIcon from '@mui/icons-material/FilterListOffRounded';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Session = ({
  tutorList,
  setTutorList,
  searchTutor,
  tutorCount,
  interestedTutors,
  clientPayment,
  tutorPayout,
  handleSearchTutors
}) => {
  const [value, setValue] = useState(1);
  const [val, setVal] = useState('1');
  const [sessionList, setSessionList] = useState([]);
  const [sessionListToday, setSessionListToday] = useState([]);
  const [sessionListUpcoming, setSessionListUpcoming] = useState([]);
  const [sessionListPast, setSessionListPast] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionPage, setSessionPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const descriptionElementRef = useRef(null);

  const [tutorPage, setTutorPage] = useState(1);
  const [sessionListLoading, setSessionListLoading] = useState(true);
  const [sessionTime, setSessionTime] = useState('today');
  const [searchSession, setSearchSession] = useState();

  const [assignedTutor, setAssignedTutor] = useState();

  const [updated, setUpdated] = useState(false);
  const [reload, setReload] = useState(false);

  const [clickedNoti, setClickedNoti] = useState(false);

  const today = new Date();
  let tomorrow =  new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [applyFilter, setApplyFilter] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterValue_, setFilterValue_] = useState(null);
  const [filterValue2, setFilterValue2] = useState(null);
  const [filterActive, setFilterActive] = useState(false);

  const snackBarPos = {
    vertical: 'bottom',
    horizontal: 'right',
  }
  const { vertical, horizontal } = snackBarPos;


  const [openSnackBar, setOpenSnackBar] = useState(false);

  console.log(dateRange);
  console.log(assignedTutor);

  
  const ITEM_HEIGHT = 48;

  //fetching sessions list
  useEffect(() => {
    const getSessions = async () => {
      if(searchSession) {
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/getSessions/${sessionTime}/${searchSession}`,
          {
            params: {
              page: value,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        setSessionListLoading(false);
        setSessionList(res?.data?.result);
        setSessionCount(res.data.length);
        setSessionPage(value);
      } catch (err) {
        setSessionListLoading(false);
        console.log(err.Error);
      }
    } else if(filterActive && filterValue || filterValue_ || filterValue2 || dateRange[0] || dateRange[1]) {
      try {
        let payload = {
          work_status: filterValue,
          payment_status: filterValue_,
          tutor_payment_status: filterValue2,
          from: dateRange[0],
          to: dateRange[1]
        }
        const res = await axios.post(
          `${localStorage.getItem('api')}/api/sessions/filter/filterSessions`, payload,
          {
            params: {
              page: value,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        setSessionListLoading(false);
        setSessionList(res?.data?.result);
        setSessionCount(res.data.length);
        setSessionPage(value);
      } catch (err) {
        setSessionListLoading(false);
        console.log(err.Error);
      }
    } else if(applyFilter) {
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/filterSessionsByDate/${dateRange[0]}/${dateRange[1]}`,
          {
            params: {
              page: value,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        setSessionListLoading(false);
        setSessionList(res?.data?.result);
        setSessionCount(res.data.length);
        setSessionPage(value);
      } catch (err) {
        setSessionListLoading(false);
        console.log(err.Error);
      }
    } else {
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/getSessions/${sessionTime}`,
          {
            params: {
              page: value,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        setSessionListLoading(false);
        setSessionList(res?.data?.result);
        setSessionCount(res.data.length);
        setSessionPage(value);
      } catch (err) {
        setSessionListLoading(false);
        console.log(err.Error);
      }
    }
    };
    getSessions();
  }, [sessionTime, assignedTutor, updated, reload, openSnackBar]);

  const handleSessionList = async (event, value) => {
    if (searchSession) {
      setSessionListLoading(true);
      setSessionPage(value);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/getSessions/${sessionTime}/${searchSession}`,
          {
            params: {
              page: value,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setSessionList(res.data.result);
        setSessionListLoading(false);
        setValue(value);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    } else if(filterActive) {
      setSessionListLoading(true);
      setSessionPage(value);
      try {
        let payload = {
          work_status: filterValue,
          payment_status: filterValue_,
          tutor_payment_status: filterValue2,
          from: dateRange[0],
          to: dateRange[1]
        }
        const res = await axios.post(
          `${localStorage.getItem('api')}/api/sessions/filter/filterSessions`, payload,
          {
            params: {
              page: value,
              limit: 10
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setSessionList(res.data.result);
        setSessionListLoading(false);
        setValue(value);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    } else if(applyFilter) {
      setSessionListLoading(true);
      setSessionPage(value);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/filterSessionsByDate/${dateRange[0]}/${dateRange[1]}`,
          {
            params: {
              page: value,
              limit: 10
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setSessionList(res.data.result);
        setSessionListLoading(false);
        setValue(value);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSessionListLoading(true);
      setSessionPage(value);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/getSessions/${sessionTime}`,
          {
            params: {
              page: value,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setSessionList(res?.data?.result);
        setSessionListLoading(false);
        setValue(value);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setClickedNoti(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchSession = async (e) => {
    setSearchSession(e.target.value);
    if (e.key == 'Enter') {
      setSessionListLoading(true);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/getSessions/${sessionTime}/${e.target.value}`,
          {
            params: {
              page: 1,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setSessionListLoading(false);
        setSessionList(res.data.result);
        setSessionCount(res.data.length);
        setSessionPage(1);
        setValue(1);
        // setTutorListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (event, newValue) => {
    setVal(newValue);
    console.log(newValue);
    setSessionTime(
      newValue === '1' ? 'today' : newValue === '2' ? 'upcoming' : 'past'
    );
    setValue(1);
    setDateRange([null, null]);
    setSessionListLoading(true);
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  // let interestedTutorList = interestedTutors;
  // console.log(interestedTutors.reverse())

  useEffect(() => {
    if(interestedTutors && interestedTutors.length > 0) {
      setClickedNoti(false);
    }
  }, [interestedTutors]);

  // filter session list by date
  const handleFilterByDateRange = async () => {
    setApplyFilter(true);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/sessions/filterSessionsByDate/${dateRange[0]}/${dateRange[1]}`,
          {
            params: {
              page: 1,
              limit: 10,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setSessionList(res.data.result);
        setSessionCount(res.data.length);
        setSessionPage(1);
        // setTutorListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
  };

  // filter sessions according to selected value
  const handleApplyFilterSession = async () => {
    // setApplyFilter(true);
    try {
      let payload = {
        work_status: filterValue,
        payment_status: filterValue_,
        tutor_payment_status: filterValue2,
        from: dateRange[0],
        to: dateRange[1]
      }
      const res = await axios.post(
        `${localStorage.getItem('api')}/api/sessions/filter/filterSessions`, payload,
        {
          params: {
            page: 1,
            limit: 10,
          },
        },
        {
          headers: '',
        }
        );
        console.log(res.data);
        setSessionList(res.data.result);
        setSessionCount(res.data.length);
        setSessionPage(1);
        toggleDrawer('right', false)
        setFilterActive(true);
        setValue(1);
        setState({ ...state, right: false });
      // setTutorListLoading(false);
      // setLoadingMsg(false);
      // setPage(page + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [range, setRange] = useState([20, 37]);

  const handleRangeChange = (event, newValue) => {
    setRange(newValue);
  };

  const handleFilterSession = (e) => {
    setFilterValue(e.target.value);
  }
  const handleFilterSession_ = (e) => {
    setFilterValue_(e.target.value);
  }
  const handleFilterSession2 = (e) => {
    setFilterValue2(e.target.value);
  }
  console.log(filterValue);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 360 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div style={{padding: '18px', backgroundColor: '#04787C', color: '#ffff', fontSize: '18px', fontWeight: '600'}}>Filters</div>
      <List>
      <ListItem button key='Duration:'>
            {/* <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon> */}
            <ListItemText primary='Duration:' />
            
          </ListItem>
      <div style={{display: 'flex', alignItems: 'center', padding: '0px 10px 0px 12px'}}>
            {/* <span style={{fontSize: '14px'}}>Duration: &nbsp;</span> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                label="Advanced keyboard"
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <Box sx={{ mx: 1, fontSize: '14px' }}> From </Box>
                    <input ref={startProps.inputRef} {...startProps.inputProps} className='dateRange' />
                    <Box sx={{ mx: 1, fontSize: '14px' }}> to </Box>
                    <input ref={endProps.inputRef} {...endProps.inputProps} className='dateRange' />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
            {/* <Button variant="contained" size="small" color='primary' style={{fontSize: '11px', lineHeight: '1.6', minWidth: '57px', marginLeft: '22px'}} onClick={handleFilterByDateRange}>
              Apply
            </Button>
            <>
            <FilterListOffRoundedIcon style={{marginLeft: '20px', cursor: 'pointer'}} color='primary' onClick={() => {setDateRange([null, null]); setFilterValue(null); setFilterValue_(null); setOpenSnackBar(true);}} />
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
              <Alert onClose={handleCloseSnackBar} severity="info" sx={{ width: '100%' }}>
                Cleared all filters!
              </Alert>
            </Snackbar>
            </> */}
          </div>
      </List>
      <List>
        {/* {['Deadline', 'Starred', 'Send email', 'Drafts'].map((text, index) => ( */}
          <ListItem button key='Session Status:'>
            {/* <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon> */}
            <ListItemText primary='Session Status:' />
            
          </ListItem>
          <div style={{display: 'flex', flexDirection: 'row', marginLeft: '18px'}}>
          <RadioGroup row aria-label="gender" name="row-radio-buttons-group" value={filterValue} onChange={handleFilterSession}>
          <FormControlLabel value="New Task" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="New Task" />
          <FormControlLabel value="Not Confirmed" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Not Confirmed" />
            <FormControlLabel value="Tutors Notified" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Tutors Notified" />
            <FormControlLabel value="Tutors Assigned" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Tutors Assigned" />
            <FormControlLabel value="Pending" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Pending" />
            <FormControlLabel value="In Progress" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="In Progress" />
            <FormControlLabel value="Client Cancelled" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Client Cancelled" />
            <FormControlLabel value="Agent Cancelled" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Agent Cancelled" />
            <FormControlLabel value="Completed" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Completed" />
      </RadioGroup>
          </div>
      </List>
      <Divider />
      <List>
        {/* {['Deadline', 'Starred', 'Send email', 'Drafts'].map((text, index) => ( */}
          <ListItem button key='Client Payment Status:'>
            {/* <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon> */}
            <ListItemText primary='Client Payment Status:' />
            
          </ListItem>
          <div style={{display: 'flex', flexDirection: 'row', marginLeft: '18px'}}>
          <RadioGroup row aria-label="gender" name="row-radio-buttons-group" value={filterValue_} onChange={handleFilterSession_}>
        <FormControlLabel value="not_paid" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Not Paid" />
        <FormControlLabel value="partially_paid" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Partially Paid" />
        <FormControlLabel value="paid" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Fully Paid" />
      </RadioGroup>
          </div>
      </List>
      <Divider />
      <List>
        {/* {['Deadline', 'Starred', 'Send email', 'Drafts'].map((text, index) => ( */}
          <ListItem button key='Tutor Payment Status:'>
            {/* <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon> */}
            <ListItemText primary='Tutor Payment Status:' />
            
          </ListItem>
          <div style={{display: 'flex', flexDirection: 'row', marginLeft: '18px'}}>
          <RadioGroup row aria-label="gender" name="row-radio-buttons-group" value={filterValue2} onChange={handleFilterSession2}>
        <FormControlLabel value="not_paid" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Payment pending" />
        <FormControlLabel value="paid" control={<Radio size='small' style={{paddingRight: '5px'}} />} label="Payment released to all assigned tutors" />
      </RadioGroup>
          </div>
      </List>
      <footer style={{padding: '18px', backgroundColor: '#FF9E00', color: '#ffff', fontSize: '18px', fontWeight: '600', textAlign: 'center', cursor: 'pointer', position: 'relative', top: 'calc(100vh - 635px'}} onClick={handleApplyFilterSession}>Apply Filter</footer>
    </Box>
  );

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <div>
      <TabContext value={val}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            aria-label='lab API tabs example'
            centered
          >
            <Tab label='Next 24 Hrs' value='1' />
            <Tab label='Upcoming' value='2' />
            <Tab label='Past' value='3' />
            <div style={{ placeSelf: 'center' }}>
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls='long-menu'
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
              >
                {interestedTutors && !clickedNoti ? <Badge color="success" badgeContent="" variant='dot'>
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
                    width: '35ch'
                  },
                }}
              >
                {interestedTutors ? interestedTutors?.map((option, i, arr) => (
                  <MenuItem
                    key={option.session_id}
                    // selected={option.session_id == arr[0].session_id}
                    onClick={handleClose}
                    style={{
                    fontSize:  '14px'
                    }}
                  >
                   New tutor in session-<span style={{marginLeft: '4px', fontWeight: '700'}}>{option?.session_id}</span>
                  </MenuItem>
                )) : 
                  <MenuItem
                    key='no'
                    style={{fontSize: '14px'}}
                  >
                    No new notifications
                  </MenuItem>}
              </Menu>
            </div>
          </TabList>
        </Box>
        <TabPanel value='1' style={{ padding: '16px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 10px' }}>
            <input
              placeholder='Search for sessions'
              className='sessionSearch'
              // onChange={(e) => handleSearchTutors(e)}
              onKeyPress={handleSearchSession}
            />
            <>
              <FilterListRoundedIcon style={{alignSelf: 'center', cursor: 'pointer'}} fontSize='medium' color='primary' onClick={toggleDrawer('right', true)} />
              <Drawer
              anchor={'right'}
              open={state['right']}
              onClose={toggleDrawer('right', false)}
              >
                {list('right')}
              </Drawer>
            </>
            <>
            <FilterListOffRoundedIcon style={{alignSelf: 'center', cursor: 'pointer'}} fontSize='medium' color='primary' onClick={() => {setDateRange([null, null]); setFilterValue(null); setFilterValue_(null); setFilterValue2(null); setOpenSnackBar(true); setFilterActive(false)}} />
            <Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
              <Alert onClose={handleCloseSnackBar} severity="info" sx={{ width: '100%' }}>
                Cleared all filters!
              </Alert>
            </Snackbar>
            </>
          </div>
          {/* <div style={{display: 'flex', alignItems: 'center', padding: '10px 10px 10px 12px'}}>
            <span style={{fontSize: '14px'}}>Duration: &nbsp;</span>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                label="Advanced keyboard"
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <input ref={startProps.inputRef} {...startProps.inputProps} className='dateRange' />
                    <Box sx={{ mx: 1, fontSize: '14px' }}> to </Box>
                    <input ref={endProps.inputRef} {...endProps.inputProps} className='dateRange' />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
            <Button variant="contained" size="small" color='primary' style={{fontSize: '11px', lineHeight: '1.6', minWidth: '57px', marginLeft: '22px'}} onClick={handleFilterByDateRange}>
              Apply
            </Button>
          </div> */}

          {sessionListLoading ? (
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
            <div className='sessionMenuWrapper'>
              {sessionList?.map((c) => (
                <div
                // onClick={() => {
                //   setCurrentChat(c);
                //   setHighlighted(true);
                //   setShowTemplateMsg(false);
                //   setTaglabel('');
                //   setTagUpdated('');
                // }}
                >
                  <SessionList
                    conversation={c}
                    tutorList={tutorList}
                    setTutorList={setTutorList}
                    searchTutor={searchTutor}
                    tutorCount={tutorCount}
                    setAssignedTutor={setAssignedTutor}
                    interestedTutors={interestedTutors}
                    clientPayment={clientPayment}
                    tutorPayout={tutorPayout}
                    updated={updated}
                    setUpdated={setUpdated}
                    setReload={setReload}
                    reload={reload}
                    handleSearchTutors={handleSearchTutors}
                    // setTutorTagUpdated={setTutorTagUpdated}
                    // setTutorRatingUpdated={setTutorRatingUpdated}
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
                count={Math.ceil(sessionCount / 10)}
                page={sessionPage}
                onChange={handleSessionList}
              />
            </div>
          )}
        </TabPanel>
        <TabPanel value='2' style={{ padding: '16px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 10px' }}>
            <input
              placeholder='Search for sessions'
              className='sessionSearch'
              // onChange={(e) => handleSearchTutors(e)}
              onKeyPress={handleSearchSession}
            />
            <>
              <FilterListRoundedIcon style={{alignSelf: 'center', cursor: 'pointer'}} fontSize='medium' color='primary' onClick={toggleDrawer('right', true)} />
              <Drawer
              anchor={'right'}
              open={state['right']}
              onClose={toggleDrawer('right', false)}
              >
                {list('right')}
              </Drawer>
            </>
            <>
            <FilterListOffRoundedIcon style={{alignSelf: 'center', cursor: 'pointer'}} fontSize='medium' color='primary' onClick={() => {setDateRange([null, null]); setFilterValue(null); setFilterValue_(null); setFilterValue2(null); setOpenSnackBar(true)}} />
            <Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
              <Alert onClose={handleCloseSnackBar} severity="info" sx={{ width: '100%' }}>
                Cleared all filters!
              </Alert>
            </Snackbar>
            </>       
            </div>
          {sessionListLoading ? (
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
            <div className='sessionMenuWrapper'>
              {sessionList?.map((c) => (
                <div
                // onClick={() => {
                //   setCurrentChat(c);
                //   setHighlighted(true);
                //   setShowTemplateMsg(false);
                //   setTaglabel('');
                //   setTagUpdated('');
                // }}
                >
                  <SessionList
                    conversation={c}
                    tutorList={tutorList}
                    setTutorList={setTutorList}
                    searchTutor={searchTutor}
                    tutorCount={tutorCount}
                    setAssignedTutor={setAssignedTutor}
                    interestedTutors={interestedTutors}
                    clientPayment={clientPayment}
                    tutorPayout={tutorPayout}
                    updated={updated}
                    setUpdated={setUpdated}
                    setReload={setReload}
                    reload={reload}                    
                    handleSearchTutors={handleSearchTutors}

                    // setTutorTagUpdated={setTutorTagUpdated}
                    // setTutorRatingUpdated={setTutorRatingUpdated}
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
                count={Math.ceil(sessionCount / 10)}
                page={sessionPage}
                onChange={handleSessionList}
              />
            </div>
          )}
        </TabPanel>
        <TabPanel value='3' style={{ padding: '16px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 10px' }}>
            <input
              placeholder='Search for sessions'
              className='sessionSearch'
              // onChange={(e) => handleSearchTutors(e)}
              onKeyPress={handleSearchSession}
            />
            <>
              <FilterListRoundedIcon style={{alignSelf: 'center', cursor: 'pointer'}} fontSize='medium' color='primary' onClick={toggleDrawer('right', true)} />
              <Drawer
              anchor={'right'}
              open={state['right']}
              onClose={toggleDrawer('right', false)}
              >
                {list('right')}
              </Drawer>
            </>
            <>
            <FilterListOffRoundedIcon style={{alignSelf: 'center', cursor: 'pointer'}} fontSize='medium' color='primary' onClick={() => {setDateRange([null, null]); setFilterValue(null); setFilterValue_(null); setFilterValue2(null); setOpenSnackBar(true)}} />
            <Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
              <Alert onClose={handleCloseSnackBar} severity="info" sx={{ width: '100%' }}>
                Cleared all filters!
              </Alert>
            </Snackbar>
            </>
          </div>

          {sessionListLoading ? (
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
            <div className='sessionMenuWrapper'>
              {sessionList?.map((c) => (
                <div
                // onClick={() => {
                //   setCurrentChat(c);
                //   setHighlighted(true);
                //   setShowTemplateMsg(false);
                //   setTaglabel('');
                //   setTagUpdated('');
                // }}
                >
                  <SessionList
                    conversation={c}
                    tutorList={tutorList}
                    setTutorList={setTutorList}
                    searchTutor={searchTutor}
                    tutorCount={tutorCount}
                    setAssignedTutor={setAssignedTutor}
                    interestedTutors={interestedTutors}
                    clientPayment={clientPayment}
                    tutorPayout={tutorPayout}
                    updated={updated}
                    setUpdated={setUpdated}
                    setReload={setReload}
                    reload={reload}
                    handleSearchTutors={handleSearchTutors}
                  />
                </div>
              ))}
              <Pagination
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '15px',
                }}
                count={Math.ceil(sessionCount / 10)}
                page={sessionPage}
                onChange={handleSessionList}
              />
            </div>
          )}
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Session;
