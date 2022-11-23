import React, {useState} from 'react';
import {EverpayDialog} from '../components/tip/EverpayTipDialog';

export default function MemberView() {
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(true);

    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    };

    return <EverpayDialog open={isOpenLoginDialog} onClose={closeLoginDialog} closeDialog={closeLoginDialog} />;
}
