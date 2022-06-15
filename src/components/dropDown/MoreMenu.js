import React, { useState, useEffect } from 'react';
import './moreMenu.css'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NotificationsIcon from '@material-ui/icons/Notifications';

const MoreMenu = ({ arrivalMessage }) => {
  const [options, setOptions] = useState();
  const uniqueValuesSet = new Set();

  useEffect(() => {
    const filteredArr = arrivalMessage.reverse().filter((obj) => {
      const isPresentInSet = uniqueValuesSet.has(obj.waId);
      uniqueValuesSet.add(obj.waId);
      return !isPresentInSet;
    });
    setOptions(filteredArr);
  }, [arrivalMessage]);
  //   const options = filteredArr;

  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const truncString = (str, max, add) => {
    add = add || '...';
    return (typeof str === 'string' && str.length > max ? str.substring(0,max)+add : str);
 };
  return (
    <div>
      <IconButton
        aria-label='more'
        aria-controls='long-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <NotificationsIcon className={options?.length>0 ? 'notification' : 'no_noti'} />
      </IconButton>
      <Menu
        id='long-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options?.length > 0 ? (
          options?.map((option) => (
            <MenuItem
              key={option.id}
              // selected={option === 'None'}
              onClick={handleClose}
              style={{fontSize: '14px', fontWeight: 'bold'}}
            >
              {truncString(option.senderName, 10, '...')} ({truncString(option.text, 3, '..')})
            </MenuItem>
          ))
        ) : (
          <MenuItem
            key={'noMsg'}
            // selected={option === 'None'}
            onClick={handleClose}
          >
            No new messages
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default MoreMenu;
