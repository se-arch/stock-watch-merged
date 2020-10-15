"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bodyParser = require("body-parser");
const logger_1 = require("./middleware/logger");
const search_controller_1 = require("./controllers/search.controller");
const lookup_controller_1 = require("./controllers/lookup.controller");
const cors = require('cors');
const app = new app_1.default({
    port: 5000,
    controllers: [
        new search_controller_1.default(),
        new lookup_controller_1.default(),
    ],
    middleWares: [
        cors(),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        logger_1.default
    ]
});
app.listen();
//# sourceMappingURL=server.js.map