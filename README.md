# sleep_ai

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Firebase
Needs `.env.local` with the following configuration constants.
```
VUE_APP_FIREBASE_API_KEY
VUE_APP_FIREBASE_AUTH_DOMAIN
VUE_APP_FIREBASE_PROJECT_ID
VUE_APP_FIREBASE_STORAGE_BUCKET
VUE_APP_FIREBASE_MESSAGING_SENDER_ID
VUE_APP_FIREBASE_APP_ID
VUE_APP_FIREBASE_MEASUREMENT_ID
```

Run Firebase emulators for development.
```
firebase emulators:start
```