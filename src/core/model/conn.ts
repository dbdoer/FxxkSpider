import * as mongoose from "mongoose";

import { coreConfig } from "../../../config";

switch (coreConfig.IDENDITY) {
    case "development":
        mongoose.connect(`mongodb://${coreConfig.AUTH ? `${coreConfig.DB_USERNAME}:${coreConfig.DB_PASSWORD}@` : ""}${coreConfig.DBHOST}:${coreConfig.DBPORT}/${coreConfig.DBNAME}`, { useNewUrlParser: true, useCreateIndex: true })
            .then()
            .catch((err) => console.log(err));
        break;
    case "production":
        mongoose.connect(`mongodb://${coreConfig.AUTH ? `${coreConfig.DB_USERNAME}:${coreConfig.DB_PASSWORD}@` : ""}${coreConfig.DBHOST}:${coreConfig.DBPORT}/${coreConfig.DBNAME}`, { useNewUrlParser: true, useCreateIndex: true })
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
