import './utils/GlobalImport';
import './css/common.scss';
import './css/quill.scss';
import {TipWidgetContainer as MfTipWidget} from './screens/TipWidget';
import {initQuill} from './utils/QuillUtil';
import {CommentWidgetContainer as MfCommentWidget} from './screens/CommentWidgetContainer';

export {MfCommentWidget, MfTipWidget};

initQuill();
