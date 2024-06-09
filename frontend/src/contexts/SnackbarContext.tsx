import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarContextType {
    showMessage: (message: string, severity?: 'error' | 'warning' | 'info' | 'success') => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('info');

    const showMessage = useCallback((message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'info') => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    }, []);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showMessage }}>
            {children}
            <Snackbar open={open} autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider >
    );
};
