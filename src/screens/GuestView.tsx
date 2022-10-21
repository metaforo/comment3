import React, {useState} from "react";
import {LoginDialog} from "../components/LoginDialog";

export default function GuestView() {
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(true);
    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    }

    return (
        <LoginDialog open={isOpenLoginDialog} onClose={closeLoginDialog}
                     closeDialog={closeLoginDialog}/>
    );
}