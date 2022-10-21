import {createTheme} from '@mui/material/styles';
import {Button, styled} from "@mui/material";

const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#5200ff',
        },
        background: {
            paper: '#ffffff'
        },
        text: {
            primary: '#000000DE',
            secondary: '#00000099',
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00E8B0',
        },
    }
});

export const loginIconSize = 36;

export const TipButton = styled(Button)(
    {
        textTransform: 'none',
    }
);

export function createThemeFromAttr(paletteMode: string | undefined | null) {
    let theme;
    if (paletteMode === 'dark') {
        theme = darkTheme;
    } else {
        theme = lightTheme;
    }

    const {mfTheme} = window as any;
    if (mfTheme) {
        theme = createTheme(theme, mfTheme);
    }

    return theme;
}