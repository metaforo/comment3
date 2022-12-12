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

Metaforo Comment Widget provides a comment box for the website, allowing users to send and view comments after logging
in via their wallet.

The comment data will be stored in Metaforo's Group. Site owners can manage their comments via metaforo.

## Usage

```html
import {MfCommentWidget} from '@dforo3/metaforo-sdk';
<MfCommentWidget
    siteName='INPUT_SITE_NAME'
    pageId='INPUT_PAGE_ID'
    displayName='INPUT_USERNAME'
    theme='light'
/>
```

- The sitename field must be applied for, and we will provide you with the corresponding value.
- The pageId is used to differentiate between different pages. Comments loaded with the same pageId will be the same.
- The displayName field is optional. It is used to specify the current user's username, but the user can manually change
  this value after logging in.
- The theme field is optional. You can use it to specify the  **light** or **dark** styles.

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

# Known issues

## Web3 and Create-react-app

If you are using create-react-app version >=5 you may run into issues building. This is because NodeJS polyfills are not
included in the latest version of create-react-app.

You can follow this topic to solve this
issue : [Web3.js - Web3 and Create-react-app](https://github.com/web3/web3.js#web3-and-create-react-app)