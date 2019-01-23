import * as React from "react";
import { autobind } from "core-decorators";
import { Card, Button, message } from "antd";
import Axios from "axios";

@autobind
class ResetSteamData extends React.Component<{ onResetSuccess: () => {} }> {
    public handleUnsetSteamDataBtnClick() {
        Axios.get("/api/monitor/unset_steam_data")
            .then((res) => {
                if (res.data.error === 0) {
                    message.success("成功");
                    this.props.onResetSuccess();
                } else {
                    message.error("失败");
                }
            })
            .catch(() => {});
    }

    public render() {
        return (
            <Card title="重置所有饰品steam数据" actions={[<Button onClick={this.handleUnsetSteamDataBtnClick}>执行</Button>]}>
                <p>该操作会重置所有饰品的steam数据</p>
                <p>包括steam最高收购价，最小出售价以及24小时成交量</p>
                <p>一般用于第二天定时抓取任务之前，清空已有数据以获得最新数据</p>
            </Card>
        );
    }
}

export default ResetSteamData;
