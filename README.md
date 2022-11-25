# Metaforo SDK

Metaforo SDK contains following components:

- Tipping Widget
- Comment Widget

## How to install

### yarn

`yarn add @dforo3/metaforo-sdk`

### npm

`npm install @dforo3/metaforo-sdk`

## Tipping Widget

Metaforo Tipping Widget is a widget for tipping to specified wallet addresses. Currently supports :

- ArConnect
- Metamask
- WalletConnect

Based on Everpay

## Usage

```html
import {MfTippingWidget} from '@dforo3/metaforo-sdk';
<MfTippingWidget
    siteName='INPUT_SITE_NAME'
    pageId='INPUT_PAGE_ID'
    receiverAddress='INPUT_WALLET_ADDRESS'
    receiverUsername='INPUT_USERNAME'
    receiverChainId={1}
    theme='light'
/>
```

You can modify the theme attribute to specify **light** or **dark** styles.

## Comment Widget

Metaforo Comment Widget provides a comment box for the website, allowing users to send and view comments after logging in via their wallet.

The comment data will be stored in Metaforo's Group. Site owners can manage their comments via metaforo.

## Usage

```html
import {MfCommentWidget} from '@dforo3/metaforo-sdk';
<MfCommentWidget
    siteName={'CommentWidgetDemo'}
    pageId={'DemoThread1'}
    theme={'light'}
/>
```

You can modify the theme attribute to specify **light** or **dark** styles.

## Custom Style

We use mui as the component library. If you need to customize the style of the widget, you can define a variable in
the window with the value of mui's theme definition in mfTheme. For the full definition format, please refer
to [this document](https://mui.com/material-ui/customization/default-theme/).

```javascript
<script>
window.mfTheme = {
    palette: {
        primary: {
            main: '#702AF1',
        },
        background: {
            paper: '#ffffff',
        },
        text: {
            primary: '#222222',
            secondary: '#71717A',
        },
    }
}
</script>
```
