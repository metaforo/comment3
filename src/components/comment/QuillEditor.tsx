import ReactQuill, {UnprivilegedEditor, Value} from 'react-quill';
import '../../css/quill.css';
import '../../css/quill.snow.css';
import {DeltaStatic, Sources} from 'quill';
import {quillModules} from '../../utils/QuillUtil';
import React from 'react';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import {IconButton, useTheme} from '@mui/material';
import {boldIcon, italicIcon, olIcon, ulIcon, underlineIcon} from '../../assets/SvgAssets';
import log from '../../utils/LogUtil';

const icons = ReactQuill.Quill.import('ui/icons');

const iconSize = 20;
icons['bold'] = boldIcon(iconSize);
icons['italic'] = italicIcon(iconSize);
icons['underline'] = underlineIcon(iconSize);
icons['list']['ordered'] = olIcon(iconSize);
icons['list']['bullet'] = ulIcon(iconSize);

interface QuillEditorProps {
    widgetKey: string;
    onChange: (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => void;
    value?: Value;
    disabled?: boolean;
    toolbarWidgets?: JSX.Element;
    onClose?: (widgetKey: string) => void;
}

export default function QuillEditor(props: QuillEditorProps) {
    log('mf-quill: init', props);
    const modules = quillModules();
    const theme = useTheme();
    modules.toolbar = {
        container: '#' + props.widgetKey,
    };


    // const inputRef = useRef(null);
    // useEffect(() => {
    //     if (inputRef != null && inputRef.current != null) {
    //         // @ts-ignore
    //         const quill = inputRef.current as ReactQuill;
    //         quill.setEditorSelection(quill.getEditor(), {index: quill.getEditor().getLength(), length: 0});
    //     }
    // }, []);

    const handleChange = (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
        log('mf-onChange: ' + value, delta);
        props.onChange(value, delta, source, editor);
    };

    const iconStyle = {
        // color: theme.palette.text.primary,
    };
    const CustomToolbar = () => (
        <div className={'mf-ql-toolbar'} style={{fill: theme.palette.text.primary}}>
            {props.toolbarWidgets}
            <div id={props.widgetKey}>
                <span className={'ql-formats'}>
                    <button className='ql-bold' style={iconStyle} />
                    <button className='ql-italic' style={iconStyle} />
                    <button className='ql-underline' style={iconStyle} />
                    {/*<button className="ql-strike" style={iconStyle}/>*/}
                </span>
                <span className={'ql-formats'}>
                    <button className='ql-list' value='ordered' style={iconStyle} />
                    <button className='ql-list' value='bullet' style={iconStyle} />
                </span>
            </div>
            <IconButton
                onClick={() => props.onClose?.(props.widgetKey)}
                className={'mf-ql-toolbar-close'}
                style={iconStyle}
            >
                <KeyboardArrowUpRoundedIcon />
            </IconButton>
        </div>
    );

    // @ts-ignore
    return (
        <div
            className={'mf-ql-editor'}
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
                // ref={inputRef}
            />
            {CustomToolbar()}
        </div>
    );
}
