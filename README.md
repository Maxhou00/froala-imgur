# froala-imgur [![npm](https://img.shields.io/npm/v/froala-imgur.svg)](https://www.npmjs.com/package/froala-imgur) [![license](https://img.shields.io/npm/l/froala-imgur.svg)](LICENSE.md)

Plugin for using imgur as uploader for Froala WYSIWYG HTML Editor

## Prerequisites

The following must be available for this plugin to work properly:

- Froala Editor >= 4.0.0 (developed under 4.0.4)
- A ClientID from the [imgur API](https://apidocs.imgur.com/)

## Installing

Add `froala-imgur` to your package.json:

```bash
npm install --save froala-imgur
# or
yarn add froala-imgur
```

Load `froala-imgur.js` on your page:

```html
<!-- after loading froala core -->
<script src="/node_modules/froala-imgur/froala-imgur.js"></script>
```

In your Froala configuration, add `imgurClientId` with your imgur's API id and add `imgurButton` anywhere on your toolbar.

```javascript
const froalaConfig = {
  ...,
  imgurClientId: "xxxxxxxxxxxx",
  toolbarButtons: ['imgurButton', '|', 'insertVideo', ...],
  ...
};
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
