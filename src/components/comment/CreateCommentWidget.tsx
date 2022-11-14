import React, {useState} from "react";
import {submitPost} from "../../api/ApiService";
import {useCommentWidgetContext} from "../../context/CommentWidgetContext";
import QuillEditor from "./QuillEditor";
import {DeltaStatic, Sources} from "quill";
import {UnprivilegedEditor} from "react-quill";
import {EMPTY_DELTA} from "../../utils/Util";
import {LoadingButton} from "@mui/lab";
import {Post} from "../../model/Post";

interface CreateCommentWidgetProp {
    onClose: () => void;
    widgetKey: string;
    replyPostId: number;
    onReplySuccess: (replyPostId: number, newPost: Post) => void;
}

export default function CreateCommentWidget(props: CreateCommentWidgetProp) {
    const [content, setContent] = useState('');
    const [quillContent, setQuillContent] = useState(EMPTY_DELTA);
    const {commentWidgetState} = useCommentWidgetContext();
    const [isLoading, setIsLoading] = useState(false);

    const createThread = () => {
        if (!content) {
            return;
        }

        setIsLoading(true);
        submitPost(commentWidgetState.siteName, commentWidgetState.pageId, content, props.replyPostId,).then((res) => {
            if (res.status) {
                setQuillContent(EMPTY_DELTA);
                props.onReplySuccess(props.replyPostId, res.data.post);
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

    const submitBtn = (
        <LoadingButton
            className='ql-submit'
            variant={"contained"}
            loading={isLoading}
            onClick={createThread}
        >Submit</LoadingButton>);
    return (
        <div style={{
            width: '100%',
        }}>
            <QuillEditor
                widgetKey={props.widgetKey}
                disabled={isLoading}
                onChange={handleChange}
                value={quillContent}
                toolbarWidgets={submitBtn}
                onClose={(w) => props.onClose()}
            />
        </div>
    );
}