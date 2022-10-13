import {createTheme} from '@mui/material/styles';
import {Button, styled} from "@mui/material";

export let theme = createTheme({
    palette: {
        primary: {
            main: '#5200ff',
        },
        secondary: {
            main: '#00e8b0',
        },
    },
});

export const loginIconSize = 36;

export const TipButton = styled(Button)(
    {
        textTransform: 'none',
    }
);