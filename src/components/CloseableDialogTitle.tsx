import {DialogTitle, IconButton} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface DialogTitleProps {
    children?: React.ReactNode;
    onClose?: () => void;
    [x:string]: any;
}

export function CloseableDialogTitle(props: DialogTitleProps) {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 24,
                        top: 24,
                        width: 14,
                        height: 14,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}