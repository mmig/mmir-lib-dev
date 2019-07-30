
Custom build for ES6 shims for use in `mmir` to support older browsers / execution environments.

Included shims for ES6 features:
 * `Map`
 * `Set`
 * `Symbols`
 * `Array.from`
 * `Array@@iterator`

## Build

run
```bash
npm run build
```

copy `/dist/**` -> `<mmir-lib-src>/vendor/libs`
