// 使用ajax, 从测试接口获取数据
// 支持async/await用法
async function getData() {
	try {
		const response = await axios.get("https://api.xujunhao.tech/cart/list");
		return response.data.data;
	} catch (error) {
		console.error(error);
	}
}



// 定义箭头函数

/**
 * 封装一个函数, 编写删除商品的逻辑
 * @param {object} productDom 商品元素
 */
const deleteProduct = (productDom) => {
	// 找到当前点击的叉号的父元素(商品元素, 删除)
	productDom.remove();
	// 重新计算总价
	countCartTotalPrice();
};

/**
 * 定义加号/减号的点击事件
 * @param {string} buttonType 按钮类型, 加号或者减号
 * @param {object} buttonObj 按钮元素
 */
const buttonClick = (buttonType, buttonObj) => {
	// 找到当前点击的按钮的父元素
	const parent = buttonObj.parentNode;
	// 找input框
	const input = parent.children[1];
	// 把 input 元素的值转换成数字
	let number = parseInt(input.value);
	// 判定是加号还是减号
	if (buttonType === "plus") {
		// 加号
		number++;
		// 把数字赋值给 input 元素
		input.value = number;
		// 因为数字发生改变了, 所以需要重新计算单一商品的总价
		// 定义一个函数, 专门计算当前商品的总价
		const productDom = parent.closest(".cart-item");
		countProductTotalPrice(productDom);
	} else {
		// 减号
		number--;
		// 判断如果减一后的数字小于等于0, 就把数字设置为1
		if (number === 0) {
			Swal.fire({
				title: "确定删除商品吗?",
				text: "删除之后, 购物车中就看不到这个商品了!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "确定!",
				cancelButtonText: "取消!",
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire("删除成功!", "购物车中的商品已经成功删除.", "success");
					// 删除商品
					deleteProduct(parent.closest(".cart-item"));
				} else {
					Swal.fire("取消删除!", "购物车中的商品没有被删除.", "error");
					// 取消删除, number 还应该是1
					input.value = 1;
				}
			});
		} else {
			// 把数字赋值给 input 元素
			input.value = number;
			// 因为数字发生改变了, 所以需要重新计算单一商品的总价
			// 定义一个函数, 专门计算当前商品的总价
			const productDom = parent.closest(".cart-item");
			countProductTotalPrice(productDom);
		}
	}
};

/**
 * 定义函数, 计算单一商品的总价
 * @param {object} productDom 商品元素
 */
const countProductTotalPrice = (productDom) => {
	// 找到商品的单价
	const priceDom = productDom.getElementsByClassName("price")[0];
	// 找到商品的数量
	const numberDom = productDom.getElementsByTagName("input")[0];
	// 找到商品的总价
	const totalPriceDom = productDom.getElementsByClassName("product-total-price")[0];
	// 把商品的单价转换成数字
	const price = parseFloat(priceDom.innerText);
	// 把商品的数量转换成数字
	const number = parseInt(numberDom.value);
	// 计算商品的总价
	const totalPrice = price * number;
	// 把商品的总价赋值给商品的总价元素
	totalPriceDom.innerText = totalPrice;
	// 更新购物车信息
	countCartTotalPrice();
};

/**
 * 定义函数, 计算购物车的总价
 */
const countCartTotalPrice = () => {
	// 定义税率
	const taxRate = 7.02;
	// 找到所有的商品的总价
	const productsTotalPrices = document.querySelectorAll(".product-total-price");
	// 定义一个变量, 用来保存购物车的小计
	let cartSubTotal = 0;
	// 遍历所有的商品的总价
	productsTotalPrices.forEach((item) => {
		// 把商品的总价转换成数字
		const productTotalPrice = parseFloat(item.innerText);
		// 把商品的总价累加到购物车的小计
		cartSubTotal = cartSubTotal + productTotalPrice;
	});

	// 找到购物车的小计元素
	const cartSubTotalDom = document.getElementById("sub-total");
	// 把购物车的小计赋值给购物车的小计元素
	cartSubTotalDom.innerText = cartSubTotal;
	// 计算购物车的税费

	let cartTax = cartSubTotal / taxRate;
	// 保留两位小数
	cartTax = cartTax.toFixed(2);
	// 转成浮点数
	cartTax = parseFloat(cartTax);
	// 找到购物车的税费元素
	const cartTaxDom = document.getElementById("tax-amount");
	// 把购物车的税费赋值给购物车的税费元素
	cartTaxDom.innerText = cartTax;
	// 计算购物车的总价
	let cartTotal = cartSubTotal + cartTax;
	// 保留两位小数
	cartTotal = cartTotal.toFixed(2);
	// 转成浮点数
	cartTotal = parseFloat(cartTotal);
	// 找到购物车的总价元素
	const cartTotalDom = document.getElementById("total-price");
	// 把购物车的总价赋值给购物车的总价元素
	cartTotalDom.innerText = cartTotal;
};



// 获取数据
(async function () {
	// 购物车中商品的数据, 将来渲染到页面中去
	// 先写死, 后期学了前后端交互, 可以请求后端的接口, 动态的获取数据
	const productList = await getData();
	// 遍历数据, 拼接字符串, 渲染到页面中去
	let html = "";
	// 遍历数据
	productList.forEach((item) => {
		// 获取当前商品的信息
		const imgUrl = item.imgUrl; // 商品图片
		const title = item.title; // 商品名称
		const price = item.price; // 商品价格
		const num = item.num; // 商品数量
		const totalPrice = price * num; // 商品总价
		// 拼接字符串, 商品信息
		html += ` <div class="cart-item"> <div class="row"> <div class="col-md-7 center-item"> <img src="${imgUrl}" alt="" /> <h5>${title} (¥<span class="price">${price}</span>)</h5> </div> <div class="col-md-5 center-item"> <div class="input-group number-spinner"> <button id="phone-minus" class="btn btn-default"><i class="fas fa-minus"></i></button> <input id="phone-number" type="text" min="0" class="form-control text-center" value="${num}" /> <button id="phone-plus" class="btn btn-default"><i class="fas fa-plus"></i></button> </div> <h5>¥<span id="phone-price" class="product-total-price">${totalPrice}</span></h5> <img src="images/remove.png" alt="" class="remove-item" /> </div> </div> </div> `;
	});

	// 渲染到页面中去
	// 获取购物车容器元素
	const cartContainer = document.querySelector(".cart .mx-auto");
	// 先取出原来已经有的元素, 和最新的数据拼接之后, 再写回去
	cartContainer.innerHTML = html + cartContainer.innerHTML;

	// 弹框, 欢迎用户查看购物车
	Swal.fire({
		icon: "success",
		title: "欢迎查看购物车",
		showConfirmButton: false,
		timer: 1000,
	});

	// 找到所有的按钮
	const buttons = document.querySelectorAll(".btn-default");
	// 遍历所有的按钮
	buttons.forEach((item) => {
		// 为每个按钮添加点击事件
		item.onclick = function () {
			// 弹出提示框, 提示用户正在点击按钮, 减号和加号都会弹出提示框, 但是内容不一样
			if (this.id.includes("plus")) {
				// 触发加号的点击事件
				buttonClick("plus", this);
			}
			if (this.id.includes("minus")) {
				// 触发减号的点击事件
				buttonClick("minus", this);
			}
		};
	});

	// 找到所有的input框
	const inputs = document.querySelectorAll("input");
	// 定义一个变量, 用来存储当前input框的值
	let oldValue = "";
	// 遍历所有的input框
	inputs.forEach((item) => {
		// 聚焦的时候, 保存原来input的值
		item.onfocus = function () {
			oldValue = this.value;
			console.log(oldValue);
		};
		// 为每个input框添加onchange事件
		item.onchange = function () {
			// 判断, 输入的值, 必须是一个整数, 范围是0-999
			// 定义正则表达式
			const reg = /^[0-9]{1,3}$/;
			// 判断输入的值是否符合正则表达式
			if (reg.test(this.value)) {
				// 判断是否为0, 如果为0, 先提醒用户, 得到确定后, 再执行
				if (this.value === "0") {
					// 提醒用户确定删除吗?
					Swal.fire({
						title: "确定删除商品吗?",
						text: "删除之后, 购物车中就看不到这个商品了!",
						icon: "warning",
						showCancelButton: true,
						confirmButtonColor: "#3085d6",
						cancelButtonColor: "#d33",
						confirmButtonText: "确定!",
						cancelButtonText: "取消!",
					}).then((result) => {
						if (result.isConfirmed) {
							Swal.fire("删除成功!", "购物车中的商品已经成功删除.", "success");
							// 删除商品
							deleteProduct(this.closest(".cart-item"));
						} else {
							// 点击了取消, 数值还原
							this.value = oldValue;
						}
					});
				} else {
					// 数值生效, 计算总价
					const productDom = this.closest(".cart-item");
					countProductTotalPrice(productDom);
				}
			} else {
				// 如果不符合正则表达式, 就弹出提示框, 提示用户输入的值不合规, 然后把原来的值赋值给input框
				Swal.fire("内容不正确!", "商品数量应该在0~999之间!", "warning");
				this.value = oldValue;
			}
		};
	});

	// 给叉号添加点击事件, 执行删除商品的操作
	const deleteButtons = document.querySelectorAll(".remove-item");
	// 遍历所有的叉号
	deleteButtons.forEach((item) => {
		// 为每个叉号添加点击事件
		item.onclick = function () {
			// 提醒用户确定删除吗?
			Swal.fire({
				title: "确定删除商品吗?",
				text: "删除之后, 购物车中就看不到这个商品了!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "确定!",
				cancelButtonText: "取消!",
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire("删除成功!", "购物车中的商品已经成功删除.", "success");
					// 找到当前点击的叉号的父元素(商品元素, 删除)
					const productDom = this.closest(".cart-item");
					// 执行删除商品的操作
					deleteProduct(productDom);
				} else {
					Swal.fire("取消删除!", "购物车中的商品没有被删除.", "error");
				}
			});
		};
	});

	// 刚进来的时候, 就需要计算一下总价
	countCartTotalPrice();
})();