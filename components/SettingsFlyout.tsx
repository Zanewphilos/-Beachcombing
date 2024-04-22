import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import Divider from '@mui/material/Divider';
import LoginPrompt from './LoginPrompt';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { UpdateUserData } from '../types/UserTypes';

interface IFormInput {
  email: string;
  username: string;
  selfIntro: string;
}

const SettingsFlyout = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, update, deleteUser } = useAuth() ?? { logout: () => {}, update: async () => {}, deleteUser: async () => {} };
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormInput>();
  const user = useAuth()?.user;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const onOpenUpdateDialog = () => {
    //if user is not null, set the value of the form fields to the user's current values
    if (user) {
      setValue('username', user.userName);
      setValue('email', user.email);
      setValue('selfIntro', user.selfIntro || ''); //use empty string if selfIntro is null
    }
  
    setOpenUpdateDialog(true);
    handleClose();
  };

  const onCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const onOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const onCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const onUpdateSubmit = handleSubmit(async (data) => {
  

    const updateData: UpdateUserData = {
      email: data.email,
      userName: data.username,
      selfIntro: data.selfIntro,
    };
    try {
      await update(updateData);
      
      onCloseUpdateDialog();
    } catch (error) {
      console.error('Update error:', error);
    }
  });

  const onDeleteAccount = async () => {
    try {
      await deleteUser();
      onCloseDeleteDialog();
      
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  
  return (
    <div>
      <IconButton aria-label="settings" aria-controls="settings-menu" aria-haspopup="true" onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Menu id="settings-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onOpenUpdateDialog}>Profile</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        <MenuItem onClick={onOpenDeleteDialog}>Delete Account</MenuItem>
      </Menu>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={onCloseUpdateDialog}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <form onSubmit={onUpdateSubmit}>
            <TextField
  {...register('username', { required: true })}
  label="Username"
  fullWidth
  margin="dense"
  defaultValue={user?.userName} // user optional chaining
/>
<TextField
  {...register('email', { required: true })}
  label="Email"
  fullWidth
  margin="dense"
  defaultValue={user?.email}
/>
<TextField
  {...register('selfIntro')}
  label="Self Introduction"
  fullWidth
  margin="dense"
  defaultValue={user?.selfIntro || ''} //deal with null selfIntro
/>
            <DialogActions>
              <Button onClick={onCloseUpdateDialog}>Cancel</Button>
              <Button type="submit">Update</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={onCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this account?</DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteDialog}>Cancel</Button>
          <Button onClick={onDeleteAccount}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsFlyout;