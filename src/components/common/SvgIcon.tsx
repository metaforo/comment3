import {ReactSVG} from "react-svg";

type SvgIconProps = {
    src: string,
    size?: number,
    color?: string,
}

export default function SvgIcon(props: SvgIconProps) {
    let style = '';
    if (props.size) {
        style += `width: ${props.size}px; height: ${props.size}px;`;
    }
    if (props.color) {
        style += `fill: "${props.color}"`;
    }
    return (<ReactSVG src={props.src} beforeInjection={(svg) => {
        svg.setAttribute('style', style);
    }}/>);
}