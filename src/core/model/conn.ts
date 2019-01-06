import * as mongoose from "mongoose";

import config from "../../http/config";

switch (config.NAME) {
    case "development":
        mongoose.connect(`mongodb://${config.DBHOST}:${config.DBPORT}/${config.DBNAME}`, { useNewUrlParser: true, useCreateIndex: true })
            .then()
            .catch((err) => console.log(err));
        break;
    case "production":
        mongoose.connect(`mongodb://${config.DBHOST}:${config.DBPORT}/${config.DBNAME}`, { useNewUrlParser: true, useCreateIndex: true })
        .then()
        .catch((err) => console.log(err));
        break;
}

mongoose.connection
    .once("error", (err) => console.error(`mongodb connect error:\n${err}`))
    .once("open", () => {
        console.log("mongodb connect success");
    });

export default mongoose;
