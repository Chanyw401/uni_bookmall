// /common/http.api.js



// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	vm.$u.api = {};


	// 首页数据
	let index = (params = {}) => vm.$u.get('/api/index', params);


	// 认证相关
	let authLogin = (params = {}) => vm.$u.post('/api/auth/login', params) //登录
	let authRegister = (params = {}) => vm.$u.post('/api/auth/register', params) //注册
	let authLogout = () => vm.$u.post('/api/auth/logout') //退出
	let authOssToken = () => vm.$u.get('/api/auth/oss/token') //更新头像token


	// 用户相关
	let userInfo = () => vm.$u.get('/api/user')
	let userInfoUpdata = (params = {}) => vm.$u.put('/api/user', params) //修改个人信息
	let userUpdateAvatar = (params = {}) => vm.$u.patch('/api/user/avatar', params) //更新用户头像

	// 商品相关
	let goodsInfo = (goodsID) => vm.$u.get(`/api/goods/${goodsID}`) //获取商品详情
	let goodsList = (params) => vm.$u.get(`/api/goods`, params) //商品列表

	// 购物车相关
	let addCar = (params) => vm.$u.post('/api/carts', params) //添加购物车
	let cartsList = (params) => vm.$u.get(`/api/carts?include=goods`, params) //获取购物车信息
	let cartsNum = (cartId, params = {}) => vm.$u.put(`/api/carts/${cartId}`, params); // 购物车数量变化
	let cartsDel = cartId => vm.$u.delete(`/api/carts/${cartId}`); // 移出购物车
	let cartsChecked = (params = {}) => vm.$u.patch(`/api/carts/checked`, params); // 购物车改变选中

	// 地址相关
	let addressList = () => vm.$u.get(`/api/address`); // 地址列表
	let addressAdd = params => vm.$u.post(`/api/address`, params); // 新增地址
	let addressDetail = id => vm.$u.get(`/api/address/${id}`); // 地址详情
	let addressEdit = (id, params) => vm.$u.put(`/api/address/${id}`, params); // 地址详情
	let addressDefault = id => vm.$u.patch(`/api/address/${id}/default`); // 设置默认地址
	let addressDel = id => vm.$u.delete(`/api/address/${id}`); // 删除地址



	//收藏相关
	let collectsCollectionAndCancel = goodsId => vm.$u.post(`/api/collects/goods/${goodsId}`); // 收藏取消
	
	let collects = (params = {}) => vm.$u.get(`/api/collects`,params);// 我的收藏


	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		index,
		authLogin,
		userInfo,
		authRegister,
		userInfoUpdata,
		authLogout,
		goodsInfo,
		addCar,
		cartsList,
		collectsCollectionAndCancel,
		collects,
		goodsList,
		cartsChecked,
		cartsDel,
		cartsNum,
		addressList,
		addressAdd,
		addressDetail,
		addressEdit,
		addressDefault,
		addressDel
	};
}

export default {
	install
}
