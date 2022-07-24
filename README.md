# No bad Map access

An [ESLint rule](https://eslint.org/) that uses [TypeScript plugin](https://github.com/typescript-eslint/typescript-eslint) to check if an [ES6 Map is being accessed incorrectly](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#setting_object_properties). Also looks for `{} as Map`, which is not a valid cast 

## Usage

```
npm install eslint-plugin-no-bad-map-access --save-dev
```

Add the following to your `.eslintrc.json`:

```
"rules": {
  ...
  "no-bad-map-access/no-bad-map-access": "error"
}
...
"plugins": [
  ...
  "no-bad-map-access"
]
```


## Development

### Setup

```bash
npm install
```

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```
