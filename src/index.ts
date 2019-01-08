import { createHttpServer } from "./http";
import { httpConfig } from "../config";

(async () => {
    try {
        const app = await createHttpServer();
        app.listen(httpConfig.PORT, async () => {
            console.log(`Server is listening on ${httpConfig.PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
})();
