import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";
import {logout, useUserContext} from "../../context/UserContext";
import {UserStatus} from "../../utils/Constants";
import {grey} from "@mui/material/colors";
import {LoginDialog} from "../login/LoginDialog";
import {submitPost} from "../../api/ApiService";
import {useCommentWidgetContext} from "../../context/CommentWidgetContext";
import QuillEditor from "./QuillEditor";
import {DeltaStatic, Sources} from "quill";
import {UnprivilegedEditor} from "react-quill";
import {EMPTY_DELTA} from "../../utils/Util";
import {LoadingButton} from "@mui/lab";

export default function CreateCommentWidget() {
    const [content, setContent] = useState('');
    const [quillContent, setQuillContent] = useState(EMPTY_DELTA);
    const {userInfoState, setUserState} = useUserContext();
    const {commentWidgetState, commentWidgetDispatch} = useCommentWidgetContext();
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    }

    const [needLogin, setNeedLogin] = useState(userInfoState.loginStatus !== UserStatus.login);

    useEffect(() => {
        setNeedLogin(userInfoState.loginStatus !== UserStatus.login);
    }, [userInfoState]);

    const createThread = () => {
        if (!content) {
            return;
        }

        setIsLoading(true);
        submitPost(commentWidgetState.siteName, commentWidgetState.pageId, content, 0).then((res) => {
            if (res.status) {
                commentWidgetDispatch({
                    siteName: commentWidgetState.siteName,
                    pageId: commentWidgetState.pageId,
                    needRefresh: true,
                });
                setQuillContent(EMPTY_DELTA);
            }
            setIsLoading(false);
        });
    }

    const handleChange = (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
        // 如果用户输入的内容为空，则设置 content 也为空（默认是 insert \n ）
        if (editor.getText().trim().length === 0) {
            setContent('');
        } else {
            setContent(JSON.stringify(editor.getContents().ops));
        }
        // @ts-ignore
        setQuillContent(editor.getContents);
    }

    const widget = (
        <div style={{
            flexDirection: "column",
            padding: "20px 12px 0px 12px",
        }}>
            <QuillEditor
                disabled={isLoading}
                onChange={handleChange}
                value={quillContent}
            />

            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
            }}
            >
                <LoadingButton loading={isLoading} onClick={createThread}>Submit</LoadingButton>
                <Button
                    disabled={needLogin}
                    onClick={() => logout(setUserState)}
                    sx={{
                        fontSize: '14px',
                        color: grey['600'],
                        textTransform: 'none',
                    }}
                >Logout</Button>
            </div>
        </div>
    );

    if (needLogin) {
        return (
            <>
                <div
                    style={{
                        height: '120px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        variant={"contained"}
                        onClick={() => setIsOpenLoginDialog(true)}
                    >Login to Comment</Button>
                </div>
                <LoginDialog open={isOpenLoginDialog} onClose={closeLoginDialog}
                             closeDialog={closeLoginDialog}/>
            </>
        );
    } else {
        return widget;
    }
}