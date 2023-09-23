// 从koa-router中引入router
const router = require("koa-router")();
// 从controller中引入getList方法
const { getList } = require("../controller/cart.js");

// 设置路由前缀
router.prefix("/cart");

// 设置路由, get请求, 路由地址是/cart/list, 调用getList方法
router.get("/list", async function (ctx, next) {
	// 调用getList方法, 通过模型查询数据库, 获取购物车列表
	const list = await getList();
	// 判断是否有数据
	if (list) {
		// 返回数据
		ctx.body = {
			errno: 0,
			data: list,
		};
	} else {
		ctx.body = {
			errno: 1,
			msg: "暂无数据",
		};
	}
});

module.exports = router;
