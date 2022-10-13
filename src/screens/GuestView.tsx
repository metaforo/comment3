import React, {useState} from "react";
import {Card, CardContent, Typography} from "@mui/material";
import {LoginDialog} from "../components/LoginDialog";
import {TipButton} from "../utils/ThemeUtil";
import {useTipWidgetContext} from "../context/TipWidgetContext";


export default function GuestView() {
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);
    const {tipWidgetState} = useTipWidgetContext();
    const openLoginDialog = () => {
        setIsOpenLoginDialog(true);
    }

    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    }

    return (
        <Card sx={{maxWidth: 400, minHeight: 300}}>
            <CardContent>
                <Typography>
                    Interested with {tipWidgetState.receiver.username}?
                </Typography>
                <TipButton variant={"contained"}
                           onClick={openLoginDialog}>
                    Tipping to {tipWidgetState.receiver.username}
                </TipButton>
                <LoginDialog open={isOpenLoginDialog} onClose={closeLoginDialog}
                             closeDialog={closeLoginDialog}/>
            </CardContent>
        </Card>
    );
}