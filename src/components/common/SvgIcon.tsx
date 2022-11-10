import {ReactSVG} from "react-svg";

type SvgIconProps = {
    src: string,
    size: number,
}

export default function SvgIcon(props: SvgIconProps) {
    return (<ReactSVG src={props.src} beforeInjection={(svg) => {
        svg.setAttribute('style', `width: ${props.size}px; height: ${props.size}px;`);
    }}/>);
}