export const getGameId = (gameName: string) => {
    let appid;
    switch (gameName) {
        case "dota2":
            appid = 570;
            break;
        case "csgo":
            appid = 730;
            break;
        case "pubg":
            appid = 578080;
            break;
        default:
            return {
                status: false,
            };
    }
    return appid;
};
