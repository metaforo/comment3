import ReactQuill, {UnprivilegedEditor, Value} from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {DeltaStatic, Sources} from "quill";
import {quillModules} from "../../utils/QuillUtil";

interface QuillEditorProps {
    onChange: (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => void;
    value?: Value,
    disabled?: boolean,
}


export default function QuillEditor(props: QuillEditorProps) {
    const modules = quillModules();

    const handleChange = (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
        props.onChange(value, delta, source, editor);
    }

    return (
        <ReactQuill
            className={'quill-editor'}
            readOnly={props.disabled}
            theme={'snow'}
            value={props.value}
            onChange={handleChange}
            modules={modules}
            // formats={formats}
        />
    );
}