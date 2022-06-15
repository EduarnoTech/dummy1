import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './noteHistory.css';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreMenu from './MoreMenu';
import DoneIcon from '@mui/icons-material/Done';

const NoteHistory = ({ setCurrentChat, setFinalMessage, scrollRef, setScrollView_, setPage }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMore = Boolean(anchorEl);
  const [allNotes, setAllNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const descriptionElementRef = useRef(null);
  const [val, setVal] = useState(1);
  const [count, setCount] = useState(0);
  const [notePage, setNotePage] = useState(1);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [closeBtnDisabled, setCloseBtnDisabled] = useState(false);
  const [clientAmt, setClientAmt] = useState();
  const [currency, setCurrency] = useState('USD');
  const [scroll, setScroll] = useState('paper');
  const [errorMsg, setErrorMsg] = useState('Please enter your name here!');
  let deviceNo = localStorage.getItem('device');
  const ITEM_HEIGHT = 48;

  const handleClickOpen = () => {
    getAllNotes();
    setOpen(true);
    setIsLoading(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAllNotes([]);
    // setFormLink('');
    // setBtnDisabled(false);
  };

  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const getAllNotes = async () => {
    try {
      const res = await axios.get(
        `${localStorage.getItem("api")}/api/messages/getAllNotes`,
        {
          params: {
            page: val,
            limit: 10,
          },
        },
        {
          headers: '',
        }
      );
      setAllNotes(res?.data?.result);
      setIsLoading(false);
      setCount(res?.data?.length);
      setNotePage(val);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleNoteHistory = async (event, value) => {
    setIsLoading(true);
    setNotePage(value);
    try {
      const res = await axios.get(
        `${localStorage.getItem("api")}/api/messages/getAllNotes`,
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
      setAllNotes(res?.data?.result);
      setIsLoading(false);
      setVal(value);
    } catch (err) {
      console.log(err);
    }
  };

const handleMarkAsSolved = async (_id) => {
  let payload = {
    _id: _id
  }
  try {
    const res = await axios.post(`${localStorage.getItem("api")}/api/messages/markNotesAsResolved`, payload, {
      headers: ''
    });
    getAllNotes();
  }
  catch (err) {
    console.log(err);
  }
};

//   const openInChat = async (wa_id, time) => {
//     try {
//         const res_ = await axios.get(`${localStorage.getItem("api")}/api/conversations5/findContact/${wa_id}`);
//         setCurrentChat(res_?.data?.result[0]);
        
//         const res = await axios.get(`${localStorage.getItem("api")}/api/messages5/filteredMsg/${wa_id}/${time}`);
//         setFinalMessage(res?.data);
//         handleClose();
//         setScrollView_(false);
//         window.scrollTo(0, scrollRef.current.offsetTop);
//         // scrollRef.current?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
//     } catch (err) {
//         console.log(err);
//     }
//   }

  return (
    <div>
      <CommentOutlinedIcon
        fontSize='medium'
        color='primary'
        style={{cursor: 'pointer', display: 'flex'}}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle
          style={{
            fontSize: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 10px 10px 24px',
          }}
          id='scroll-dialog-title'
        >
          All Notes:
        </DialogTitle>

        <DialogContent
          dividers={scroll === 'paper'}
          style={{ padding: '16px 0px' }}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '255px 210px',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <DialogContentText
              id='scroll-dialog-description'
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <>
                {allNotes &&
                  allNotes.map((i, j) => {
                    return (
                      <div className='tutorlist_'>
                        <div className='userTab'>
                          <Avatar className='conversationImg_'>
                            {i?.name?.slice(0, 1)}
                          </Avatar>
                          <div style={{ paddingBottom: '5px' }}>
                            <div className='conversationName_'>
                              {i?.name}
                              <div style={{ fontSize: '10px' }}>
                                {moment(new Date(i?.timestamp * 1000)).format(
                                  'lll'
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{display: 'flex', flexDirection: 'row', flex:'0%', justifyContent: 'flex-end', alignSelf: 'center', marginRight: '10px'}}>
                            {i?.clientNotes?.status && i?.clientNotes?.status === 'resolved' ? <span style={{color: '#3c4043', opacity: '0.8', fontStyle: 'italic', fontSize: '10px'}}>Marked as resolved</span> : <DoneIcon fontSize='small' color='success' style={{cursor: 'pointer'}} onClick={() => handleMarkAsSolved(i?._id)} />}
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '13px',
                            marginTop: '5px',
                            marginLeft: '2px',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: i?.clientNotes?.priority === 'high' ? 'red' : i?.clientNotes?.priority === 'medium' ? 'royalblue' : '#565555',
                            opacity: i?.clientNotes?.status && i?.clientNotes?.status === 'resolved' ? 0.5 : 1
                          }}
                        >
                          {i?.clientNotes?.noteText}
                          <span>
                          <MoreMenu data = {i} setCurrentChat = {setCurrentChat} setFinalMessage = {setFinalMessage} scrollRef = {scrollRef} setScrollView_ = {setScrollView_} handleCloseModal = {handleClose} setAllNotes = {setAllNotes} setPage = {setPage} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                <Pagination
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '20px 45px 20px 30px',
                  }}
                  count={Math.ceil(count / 10)}
                  page={notePage}
                  onChange={handleNoteHistory}
                />
              </>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default NoteHistory;
