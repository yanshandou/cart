// 数据库设置

const mongoose = require("mongoose");


// 开始连接
mongoose.connect(`mongodb://xujunhao:CLD74d8D8XGDMcBG@127.0.0.1:27017/shop?authMechanism=DEFAULT&authSource=shop`);

// 获取连接对象
const conn = mongoose.connection;

// 监听连接失败
conn.on("error", (err) => console.log(err));

// 测试数据库连接
conn.once("open", () => console.log("数据库连接成功"));

// 导出
module.exports = mongoose;
