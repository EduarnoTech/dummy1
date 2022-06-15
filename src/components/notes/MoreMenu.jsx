import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

const ITEM_HEIGHT = 48;

export default function MoreMenu({
  data,
  setCurrentChat,
  setFinalMessage,
  scrollRef,
  setScrollView_,
  handleCloseModal,
  setAllNotes,
  setPage
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = async (event, wa_id) => {
    setAnchorEl(event.currentTarget);
    try {
      const res_ = await axios.get(
        `${localStorage.getItem('api')}/api/conversations/findContact/${wa_id}`
      );
      setCurrentChat(res_?.data?.result[0]);
      setScrollView_(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openInChat = async (wa_id, time) => {
    try {
      const res = await axios.get(
        `${localStorage.getItem('api')}/api/messages/filteredMsg/${wa_id}/${time}`
      );
      setFinalMessage([...res?.data]);
      setPage(Math.floor(res?.data.length/20) + 1);
      handleCloseModal();
      setAllNotes([]);
      setScrollView_(false);
      window.scrollTo(0, scrollRef.current.offsetTop);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={(e) => handleClick(e, data?.wa_id)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem
          key='i'
          onClick={() => openInChat(data?.wa_id, data?.createdAt)}
        >
          Show in chat
        </MenuItem>
      </Menu>
    </div>
  );
}
