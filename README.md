# No bad Map access

An ESLint rule that uses TypeScript types to check if an ES6 Map is being accessed
incorrectly.

## Usage

```
npm install eslint-plugin-no-bad-map-access --save-dev
```

Add the following to your `.eslintrc.json`:

```
"rules": {
  ...
  "no-bad-map-access/no-bad-map-access: error": "error"
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
