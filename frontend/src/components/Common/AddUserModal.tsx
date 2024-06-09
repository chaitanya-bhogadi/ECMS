import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { DesktopDatePicker } from '@mui/lab';
import { useState } from 'react';

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose }) => {
    const [dob, setDob] = useState<Date | null>(new Date());

    const handleDateChange = (date: Date | null) => {
        setDob(date);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="Created By" fullWidth variant="standard" />
                <TextField margin="dense" label="First Name" fullWidth variant="standard" />
                <TextField margin="dense" label="

Last Name" fullWidth variant="standard" />
                <DesktopDatePicker
                    label="Date of Birth"
                    inputFormat="MM/dd/yyyy"
                    value={dob}
                    onChange={handleDateChange}
                    renderInput={(params: any) => <TextField {...params} fullWidth />}
                />
                <TextField margin="dense" label="Phone Number" fullWidth variant="standard" />
                <TextField margin="dense" label="Domain" select fullWidth variant="standard">
                    {/* Map options here */}
                </TextField>
                <TextField margin="dense" label="City" fullWidth variant="standard" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onClose}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserModal;