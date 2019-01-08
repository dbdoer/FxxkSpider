import { Task } from "../src/core/model";
import ms = require("ms");

export const taskFlush = async () => {
    const getDate = Date.now() - ms("2d");
    await Task.remove({ createdAt: { $lte: getDate} });
};
