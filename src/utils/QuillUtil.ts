import Quill, {StringMap} from 'quill';
// @ts-ignore
import QuillMarkdown from 'quilljs-markdown';
// @ts-ignore
import QuillMention from 'quill-mention';
// @ts-ignore
import * as Emoji from 'quill-emoji';

export const quillModules = (): StringMap => {
    return {
        clipboard: {
            matchVisual: false,
        },
        markdownOptions: {},
        mention: {},
        'emoji-textarea': true,
    };
};

export function initQuill() {
    // 3rd party
    Quill.register('modules/markdownOptions', QuillMarkdown, true);
    Quill.register('modules/mention', QuillMention, true);
    Quill.register('modules/emoji', Emoji, true);
}
