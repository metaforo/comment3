import {createTheme} from '@mui/material/styles';
import {Components} from "@mui/material/styles/components";
import {Theme} from "@mui/material/styles/createTheme";

const components = {
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 24,
                paddingTop: 16,
                paddingBottom: 16,
                backgroundImage: "none",
            },
        }
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                alignSelf: 'center',
                marginTop: '6px',
                paddingBottom: 0,
                fontWeight: 'bold',
                fontSize: '22px',
            },
        }
    },
} as Components<Omit<Theme, 'components'>>;

const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#702AF1',
        },
        background: {
            paper: '#ffffff'
        },
        text: {
            primary: '#222222',
            secondary: '#71717A',
        },
    },
    components: components,
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#702AF1',
        },
        background: {
            paper: '#1D1D20',
        },
        text: {
            primary: '#DDDADA',
            secondary: '#71717A',
        },
    },
    components: components,
});

export const loginIconSize = 24;

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