const mongoose = require("./index");

// 定义Schema, 数据库集合的结构, 字段名称, 字段类型, 是否必填, 默认值
const CartSchema = mongoose.Schema(
	{
		// 字段: 商品的图片地址
		imgUrl: {
			type: String, // 字符串类型
			required: true, // 必传, 必写
			unique: true, // 唯一, 去重
		},
		// 字段: 商品的标题
		title: {
			type: String, // 数字类型
			required: true, // 必传
			unique: true, // 唯一, 去重
		},
		// 字段: 商品的价格
		price: {
			type: Number, // 数字类型
			required: true, // 必传
		},
		// 字段: 商品的数量
		num: {
			type: Number, // 数字类型
			default: 1, // 默认值
		},
	},
	{
		timestamps: true, // 配置, 自动添加时间戳, 用来记录数据的创建时间, 和修改时间
	}
);

// 定义Model, 第一个参数, 对应collection的单数,比如collection是users, 第一个参数就是user, 第二个是对应的规则
const Cart = mongoose.model("cart", CartSchema);

// 导出
module.exports = {
	Cart,
};
