This repo is an adapation of the code for client and server to work from the same folder and the same host.
The `start` and `build` instructions handle both projects at the same time:

```json
        "start-js": "react-scripts start",
        "backend-start": "node server/dist/server.js",
        "start": "concurrently \"npm-run-all -p backend-start start-build\"",
        "start-build": "serve -s build"
```
