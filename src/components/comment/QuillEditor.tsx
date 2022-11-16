import ReactQuill, {UnprivilegedEditor, Value} from "react-quill";
import "../../css/quill.scss";
import "../../css/quill.snow.css";
import {DeltaStatic, Sources} from "quill";
import {quillModules} from "../../utils/QuillUtil";
import React, {useEffect, useRef} from "react";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import {IconButton, useTheme} from "@mui/material";

const icons = ReactQuill.Quill.import('ui/icons');

// icons['bold'] = '<i class="fa-solid fa-bold" aria-hidden="true" color="red"></i>';
// icons['italic'] = '<i class="fa-solid fa-italic" aria-hidden="true"></i>';
// icons['underline'] = '<i class="fa-solid fa-underline" aria-hidden="true"></i>';
// icons['strike'] = '<i class="fa-solid fa-strikethrough" aria-hidden="true"></i>';
// icons['list']['ordered'] = '<i class="fa-solid fa-list-ol" aria-hidden="true"></i>';
// icons['list']['bullet'] = '<i class="fa-solid fa-list-ul" aria-hidden="true"></i>';
const iconSize = 20;
icons['bold'] = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M920.976,3868.04a1,1,0,0,0-.728.23,0.936,0.936,0,0,0-.249.73,4.367,4.367,0,0,0,.3,1.53h1.888c0.066,1.56.1,6.29,0.1,11.1,0,5.33-.033,10.33-0.1,11.9h-1.209a1.05,1.05,0,0,0-.728.23,0.927,0.927,0,0,0-.249.72,4.473,4.473,0,0,0,.3,1.55l7.964-.02c4.348,0,7.392-.68,9.131-2.02s2.608-4.62,2.608-6.69q0-4.575-5.746-5.76c3.069-1.4,4.6-3.44,4.6-6.14,0-1.95-.814-4.96-2.442-5.92s-4.114-1.44-7.458-1.44h-7.981Zm6.424,15.25a13.831,13.831,0,0,1,2.185-.18,5.042,5.042,0,0,1,3.552,1.07,4.114,4.114,0,0,1,1.151,3.15c0,1.29-.318,3.77-0.953,4.33a4.469,4.469,0,0,1-3.037.85c-1.336,0-2.153-.22-2.451-0.65a15.5,15.5,0,0,1-.447-4.31v-4.26Zm0-3.33c0-3.31.006-7.09,0.017-8.24a11.616,11.616,0,0,1,2-.19,3.874,3.874,0,0,1,2.8.9c0.618,0.59.927,3.08,0.927,4.34a3.362,3.362,0,0,1-.869,2.56,4.121,4.121,0,0,1-2.856.81,9.672,9.672,0,0,1-2.02-.18h0Z" transform="translate(-910 -3862.03)"/></svg>`;
icons['italic'] = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M995.992,3870.37v-0.93a1.383,1.383,0,0,0-1.332-1.42h-9.327a1.383,1.383,0,0,0-1.332,1.42v1.43a1.383,1.383,0,0,0,1.332,1.42,1.853,1.853,0,0,1,1.732,2.28l-2.4,15.63a1.869,1.869,0,0,1-1.732,1.57h-1.6a1.383,1.383,0,0,0-1.332,1.42v1.42a1.383,1.383,0,0,0,1.332,1.42h9.327a1.383,1.383,0,0,0,1.332-1.42v-1.42a1.383,1.383,0,0,0-1.332-1.42,1.853,1.853,0,0,1-1.732-2.28l2.4-15.64a1.869,1.869,0,0,1,1.732-1.56h1.133a1.852,1.852,0,0,0,1.8-1.92h0Z" transform="translate(-968 -3862.03)"/></svg>`;
icons['underline'] = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M1038.63,3870.97h-0.35a3.536,3.536,0,0,1-1.79-.32,1.273,1.273,0,0,1-.49-1.15,1.412,1.412,0,0,1,.41-1.11,1.854,1.854,0,0,1,1.24-.36h5.44a1.527,1.527,0,0,1,1.62,1.47,1.613,1.613,0,0,1-1.62,1.47h-0.94v6.53a16.981,16.981,0,0,0,.23,3.29,6.03,6.03,0,0,0,.75,1.89,5.165,5.165,0,0,0,2.12,1.94,6.542,6.542,0,0,0,3.01.7,5.5,5.5,0,0,0,4.53-1.76q1.425-1.755,1.43-5.68v-6.91h-1.16a1.693,1.693,0,0,1-1.75-1.47,1.342,1.342,0,0,1,1.25-1.47h5.85a1.7,1.7,0,0,1,1.19.37,1.451,1.451,0,0,1,.4,1.1,1.292,1.292,0,0,1-.48,1.15,3.392,3.392,0,0,1-1.74.32h-0.3v7.36q0,4.965-2.36,7.44c-1.57,1.66-3.94,2.48-7.1,2.48a9.4,9.4,0,0,1-6.84-2.48,8.884,8.884,0,0,1-2.55-6.68v-8.12Zm0.1,21.95h18.54a1.557,1.557,0,1,1,0,3.11h-18.54A1.557,1.557,0,1,1,1038.73,3892.92Z" transform="translate(-1028 -3862.03)"/></svg>`;
icons['list']['ordered'] = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M1351.6,3897.01h-19.21a1.4,1.4,0,0,1-1.4-1.4v-0.21a1.4,1.4,0,0,1,1.4-1.4h19.21a1.4,1.4,0,0,1,1.4,1.4v0.21A1.4,1.4,0,0,1,1351.6,3897.01Zm0-13h-19.21a1.4,1.4,0,0,1-1.4-1.4v-0.21a1.4,1.4,0,0,1,1.4-1.4h19.21a1.4,1.4,0,0,1,1.4,1.4v0.21A1.4,1.4,0,0,1,1351.6,3884.01Zm0-13h-19.21a1.4,1.4,0,0,1-1.4-1.4v-0.21a1.4,1.4,0,0,1,1.4-1.4h19.21a1.4,1.4,0,0,1,1.4,1.4v0.21A1.4,1.4,0,0,1,1351.6,3871.01Zm-25.68,28c-1.46,0-2.92-.63-2.92-2.22h2.02a0.775,0.775,0,0,0,.9.74,0.767,0.767,0,0,0,.9-0.75,0.838,0.838,0,0,0-.94-0.75h-0.28v-1.41h0.28a0.719,0.719,0,0,0,.84-0.67,0.814,0.814,0,0,0-1.6-.01h-2.02c0-1.33,1.25-2.14,2.82-2.14,1.62,0,2.82.88,2.82,2.1a1.482,1.482,0,0,1-.92,1.39,1.684,1.684,0,0,1,1.01,1.54C1328.83,3898.31,1327.46,3899.01,1325.92,3899.01Zm-2.92-14.48,3.29-2.8a0.954,0.954,0,0,0,.45-0.77,0.685,0.685,0,0,0-.81-0.66,0.716,0.716,0,0,0-.84.69H1323c0-1.4,1.35-2.17,2.93-2.17,1.68,0,2.9.81,2.9,2.15a2.183,2.183,0,0,1-1.12,1.76l-2.16,1.8h3.28v1.49H1323v-1.49Zm2.13-16.96h-1.3v-1.58H1328V3874h-2.87v-6.43Z" transform="translate(-1318 -3862.5)"/></svg>`;
icons['list']['bullet'] = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M1430.6,3897.01h-19.21a1.4,1.4,0,0,1-1.4-1.4v-0.21a1.4,1.4,0,0,1,1.4-1.4h19.21a1.4,1.4,0,0,1,1.4,1.4v0.21A1.4,1.4,0,0,1,1430.6,3897.01Zm0-13h-19.21a1.4,1.4,0,0,1-1.4-1.4v-0.21a1.4,1.4,0,0,1,1.4-1.4h19.21a1.4,1.4,0,0,1,1.4,1.4v0.21A1.4,1.4,0,0,1,1430.6,3884.01Zm0-13h-19.21a1.4,1.4,0,0,1-1.4-1.4v-0.21a1.4,1.4,0,0,1,1.4-1.4h19.21a1.4,1.4,0,0,1,1.4,1.4v0.21A1.4,1.4,0,0,1,1430.6,3871.01ZM1404.5,3898a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,1404.5,3898Zm0-13a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,1404.5,3885Zm0-13a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,1404.5,3872Z" transform="translate(-1397 -3862.5)"/></svg>`;

/*
*
attach
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M1202.13,3878.85l-2.22-2.47a3.741,3.741,0,0,0,0-4.92,2.937,2.937,0,0,0-4.45,0l-2.22-2.47a5.863,5.863,0,0,1,8.89,0A7.509,7.509,0,0,1,1202.13,3878.85Zm-16.18,17.05c-3.65,2.95-8.55,2.85-11.58-.51s-3.12-8.78-.46-12.82l1.01-1.34h0l13.87-14.7a1.463,1.463,0,0,1,2.22,0,1.882,1.882,0,0,1,0,2.46l-14.05,14.5c-2.45,2.72-2.62,6.95-.37,9.44a5.4,5.4,0,0,0,7.23.62l16.09-17.17,2.22,2.47Zm-4.91-9.13a0.953,0.953,0,0,0,0,1.23,0.742,0.742,0,0,0,1.12,0l-0.04.17,0.04-.17,13.3-14.08a1.474,1.474,0,0,1,2.23,0,1.882,1.882,0,0,1,0,2.46l-13.98,14.58a3.6,3.6,0,0,1-4.89-.49,4.637,4.637,0,0,1-.44-5.42l14.86-16.06,2.22,2.47-14.42,15.31h0Z" transform="translate(-1168 -3862.03)"/></svg>

emoji
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M868,3898.03h-0.006a16,16,0,0,1,.01-32h0.008A16,16,0,0,1,868,3898.03Zm0-28.79c0-.01,0-0.01,0-0.01a12.8,12.8,0,0,0-.007,25.6H868A12.8,12.8,0,0,0,868,3869.24Zm5.813,11.55a1.6,1.6,0,0,1-1.6-1.6v-2.8a1.6,1.6,0,0,1,3.2.01v2.79A1.6,1.6,0,0,1,873.813,3880.79Zm-0.479,5.8a6.665,6.665,0,0,1-10.677-.01,1.6,1.6,0,1,1,2.407-2.11,3.506,3.506,0,0,0,5.866.01A1.6,1.6,0,1,1,873.334,3886.59Zm-11.288-5.81a1.6,1.6,0,0,1-1.6-1.6v-2.8a1.6,1.6,0,0,1,3.2.01v2.8A1.592,1.592,0,0,1,862.046,3880.78Z" transform="translate(-848 -3862.03)"/></svg>

pic
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M1271.12,3866.02a4.912,4.912,0,0,1,4.9,4.92h0v22.18a4.912,4.912,0,0,1-4.9,4.92h-22.21a4.906,4.906,0,0,1-4.9-4.92h0v-22.18a4.906,4.906,0,0,1,4.9-4.92h22.21Zm-18.06,15.74-0.18.15-5.67,7.99v3.66a1.266,1.266,0,0,0,1.03,1.25l0.23,0.02h23.08a1.277,1.277,0,0,0,.97-0.45l0.13-.2-5.7-7.18c-1.13-1.14-3.64,1.86-3.64,1.86-1.85,1.86-3.21,1.99-5.22.29l-0.32-.29-3.1-6.95a1.248,1.248,0,0,0-1.61-.15h0Zm18.49-12.53h-23.08a1.264,1.264,0,0,0-1.24,1.05l-0.02.22v14.01l3.8-5.29c1.97-1.99,3.57-1.99,5.54,0l3.1,6.94a2.406,2.406,0,0,0,2.58,0l1.85-1.86c1.98-1.98,1.97-1.98,3.94,0l4.8,5.45V3870.5a1.275,1.275,0,0,0-1.04-1.25Zm-4.35,6.4a2.4,2.4,0,0,1,.01,4.8h-0.01A2.4,2.4,0,0,1,1267.2,3875.63Z" transform="translate(-1240 -3862.03)"/></svg>


link
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 40 40"><path d="M1110.02,3877.59a1.794,1.794,0,0,1,.12,2.4l-0.12.14-4.71,4.71a5.546,5.546,0,0,0,7.64,8.04l0.21-.19,4.71-4.71a1.79,1.79,0,0,1,2.66,2.39l-0.13.14-4.71,4.71a9.13,9.13,0,0,1-13.14-12.68l0.22-.24,4.72-4.71a1.787,1.787,0,0,1,2.53,0h0Zm12.82-2.4a1.78,1.78,0,0,1,.12,2.39l-0.12.14-11.07,11.07a1.794,1.794,0,0,1-2.66-2.4l0.12-.13,11.08-11.07a1.787,1.787,0,0,1,2.53,0h0Zm6.43-6.46a9.129,9.129,0,0,1,.23,12.68l-0.23.23-4.71,4.72a1.794,1.794,0,0,1-2.66-2.4l0.12-.14,4.72-4.71a5.553,5.553,0,0,0-7.65-8.05l-0.2.2-4.72,4.71a1.786,1.786,0,0,1-2.65-2.39l0.12-.14,4.71-4.71a9.132,9.132,0,0,1,12.92,0h0Z" transform="translate(-1095.97 -3862.03)"/></svg>

*
* */

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

    const iconStyle = {
        // color: theme.palette.text.primary,
    };
    const CustomToolbar = () => (
        <div className={'mf-ql-toolbar'} style={{fill: theme.palette.text.primary}}>
            {props.toolbarWidgets}
            <div id={props.widgetKey}>
            <span className={'ql-formats'}>
                <button className="ql-bold" style={iconStyle}/>
                <button className="ql-italic" style={iconStyle}/>
                <button className="ql-underline" style={iconStyle}/>
                {/*<button className="ql-strike" style={iconStyle}/>*/}
            </span>
                <span className={'ql-formats'}>
                <button className="ql-list" value="ordered" style={iconStyle}/>
                <button className="ql-list" value="bullet" style={iconStyle}/>
            </span>
            </div>
            <IconButton
                onClick={() => props.onClose?.(props.widgetKey)}
                className={'mf-ql-toolbar-close'}
                style={iconStyle}
            ><KeyboardArrowUpRoundedIcon/></IconButton>
        </div>
    );

    // @ts-ignore
    return (
        <div className={'mf-ql-editor'}
             style={{
                 backgroundColor: (theme.palette as any).action.hover,
             }}
        >
            <ReactQuill
                className={'quill-editor'}
                readOnly={props.disabled}
                value={props.value}
                onChange={handleChange}
                modules={modules}
                ref={inputRef}
            />
            {CustomToolbar()}
        </div>
    );
}