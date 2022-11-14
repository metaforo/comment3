import ReactQuill, {UnprivilegedEditor, Value} from "react-quill";
import "../../css/quill.scss";
import 'react-quill/dist/quill.snow.css';
import {DeltaStatic, Sources} from "quill";
import {quillModules} from "../../utils/QuillUtil";
import React, {useEffect, useRef} from "react";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import {IconButton, useTheme} from "@mui/material";

interface QuillEditorProps {
    widgetKey: string,
    onChange: (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => void;
    value?: Value,
    disabled?: boolean,
    toolbarWidgets?: JSX.Element,
    onClose?: (widgetKey: string) => void;
}

export default function QuillEditor(props: QuillEditorProps) {
    const modules = quillModules();
    const theme = useTheme();
    modules.toolbar = {
        container: '#' + props.widgetKey,
    };

    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef != null && inputRef.current != null) {
            // @ts-ignore
            const quill = (inputRef.current as ReactQuill);
            quill.setEditorSelection(quill.getEditor(), {index: quill.getEditor().getLength(), length: 0});
        }
    }, []);

    const handleChange = (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
        props.onChange(value, delta, source, editor);
    }

    const CustomToolbar = () => (
        <div className={'mf-ql-toolbar'}>
            {props.toolbarWidgets}
            <div id={props.widgetKey}>
            <span className={'ql-formats'}>
                <button className="ql-bold"/>
                <button className="ql-italic"/>
                <button className="ql-underline"/>
                <button className="ql-strike"/>
            </span>
                <span className={'ql-formats'}>
                <button className="ql-list" value="ordered"/>
                <button className="ql-list" value="bullet"/>
            </span>
            </div>
            <IconButton
                onClick={() => props.onClose?.(props.widgetKey)}
                className={'mf-ql-toolbar-close'}
            ><KeyboardArrowUpRoundedIcon/></IconButton>
        </div>
    );

    // @ts-ignore
    return (
        <div className={'mf-ql-editor'}
             style={{
                 backgroundColor: (theme.palette as any).inputField.background,
             }}
        >
            <ReactQuill
                className={'quill-editor'}
                readOnly={props.disabled}
                theme={'snow'}
                value={props.value}
                onChange={handleChange}
                modules={modules}
                ref={inputRef}
            />
            {CustomToolbar()}
        </div>
    );
}