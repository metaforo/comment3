# Metaforo SDK

Metaforo sdk is a widget for tipping specified wallet addresses. Currently supports :

- ArConnect
- Metamask
- WalletConnect

Based on Everpay

## Sample Code

```html

<div class="metaforo-tip"
     style="width: 200px; height: 50px; background-color: #5200ff; color: #FFFFFF; text-align: center; user-select: none"
     siteName="INPUT_SITE_NAME"
     pageId="INPUT_PAGE_ID"
     receiverAddress="INPUT_ADDRESS"
     receiverUsername="INPUT_USERNAME"
     receiverChainId="1"
     theme="light">
    Metaforo Tipping
</div>
```

You can modify the theme attribute in the `<div>` tag to specify **light** or **dark** styles.

## Custom Style

We use mui as the component library. If you need to customize the style of the popup box, you can define a variable in
the window with the value of mui's theme definition in mfTheme. For the full definition format, please refer
to [this document](https://mui.com/material-ui/customization/default-theme/).

```javascript
<script>
window.mfTheme = {
    palette: {
        background: {
            paper: '#232323',
        }
    }
}
</script>
```