import ReactQuill from 'react-quill';
import {DeltaStatic} from 'quill';
import {quillModules} from '../../utils/QuillUtil';

interface QuillViewerProps {
    content: string;
}

export default function QuillViewer(props: QuillViewerProps) {
    const delta = {ops: JSON.parse(props.content)} as unknown as DeltaStatic;
    const modules = quillModules();
    modules.toolbar = false;

    return <ReactQuill className={'quill-viewer'} value={delta} readOnly={true} modules={modules} />;
}
