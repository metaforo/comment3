import {ReactSVG} from 'react-svg';
import React from 'react';

type SvgIconProps = {
    src?: string;
    data?: string;
    size?: number;
    color?: string;
};

export default function SvgIcon(props: SvgIconProps) {
    if (!props.src && !props.data) {
        return null;
    }

    if (props.data) {
        // noinspection HtmlRequiredAltAttribute
        return <img src={`data:image/svg+xml;utf8,${props.data.replaceAll('#', '%23')}`} />;
    } else {
        let style = '';
        if (props.size) {
            style += `width: ${props.size}px; height: ${props.size}px;`;
        }
        if (props.color) {
            style += `fill: ${props.color}`;
        }
        return (
            <ReactSVG
                src={props.src!}
                beforeInjection={(svg) => {
                    svg.setAttribute('style', style);
                }}
            />
        );
    }
}
