import {useUserContext} from "../context/UserContext";
import React, {useState} from "react";
import {UserStatus} from "../utils/Constants";
import {EverpayDialog} from "../components/EverpayTipDialog";
import {useTipWidgetContext} from "../context/TipWidgetContext";

export default function MemberView() {
    const {setUserState} = useUserContext();
    const {tipWidgetState} = useTipWidgetContext();
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(true);

    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    }

    return (
        <EverpayDialog open={isOpenLoginDialog}
                       onClose={closeLoginDialog}
                       closeDialog={closeLoginDialog}
                       toUsername={tipWidgetState.receiver.username}
                       toAddress={tipWidgetState.receiver.address}
        />
    );
}