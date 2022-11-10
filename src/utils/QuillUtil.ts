import Quill, {StringMap} from "quill";
// @ts-ignore
import QuillMarkdown from "quilljs-markdown";
// @ts-ignore
import QuillMention from "quill-mention";
import {Blot} from "parchment/src/blot/abstract/blot";

export const quillModules = (): StringMap => {
    return {
        clipboard: {
            matchVisual: false,
        },
        markdownOptions: {},
        mention: {},
    };
}

export function initQuill() {
    // 3rd party
    Quill.register('modules/markdownOptions', QuillMarkdown, true);
    Quill.register('modules/mention', QuillMention, true);
    Quill.register(emojiBlot(), true);
}

function emojiBlot(): Blot {
    const Inline = Quill.import('blots/inline');

    class EmojiBlot extends Inline {
        static create(value: any) {
            let node = super.create() as Element;
            node.innerHTML += '&#x' + value.unicode + ';';
            return node;
        }

        length() {
            return 1;
        }
    }

    EmojiBlot.blotName = 'emoji';
    EmojiBlot.tagName = 'div';
    // @ts-ignore
    return EmojiBlot;
}