import {useUserContext} from "../context/UserContext";
import React, {useState} from "react";
import {Storage} from "../utils/Storage";
import {UserStatus} from "../utils/Constants";
import {Avatar, Card, CardContent, Stack, Typography} from "@mui/material";
import {TipButton} from "../utils/ThemeUtil";
import {EverpayDialog} from "../components/EverpayTipDialog";
import {useTipWidgetContext} from "../context/TipWidgetContext";

export default function MemberView() {
    const {userInfoState, setUserState} = useUserContext();
    const {tipWidgetState} = useTipWidgetContext();
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);
    const openLoginDialog = () => {
        setIsOpenLoginDialog(true);
    }

    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    }

    function logout() {
        Storage.removeAll();
        setUserState({
            loginStatus: UserStatus.notLogin,
            username: undefined,
            avatar: undefined,
            ethAddress: undefined,
            arAddress: undefined,
        });
    }

    return (<Card sx={{maxWidth: 400, minHeight: 300}}>
        <CardContent>
            <Stack direction={'row'} spacing={1}>
                <Typography>Hello</Typography>
                <Avatar alt={'User Avatar'}
                        src={userInfoState.avatar}
                        sx={{width: '24px', height: '24px',}}
                />
                <Typography>{userInfoState.username}</Typography>
                <button onClick={logout}>logout</button>
            </Stack>

            <Typography>
                Interested with {tipWidgetState.receiver.username}?
            </Typography>
            <TipButton variant={"contained"}
                       onClick={openLoginDialog}>
                Tipping to {tipWidgetState.receiver.username}
            </TipButton>
            <EverpayDialog open={isOpenLoginDialog}
                           onClose={closeLoginDialog}
                           closeDialog={closeLoginDialog}
                           toUsername={tipWidgetState.receiver.username}
                           toAddress={tipWidgetState.receiver.address}
            />
        </CardContent>
    </Card>);
}