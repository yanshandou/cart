// 引入模型
const { Cart } = require("../db/model.js");

// 获取购物车列表
async function getList() {
	// 从数据库中获取购物车列表
	const cartList = await Cart.find({});
	// 返回购物车列表
	return cartList;
}

// 导出
module.exports = { getList };
