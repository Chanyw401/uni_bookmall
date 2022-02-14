const install = (Vue, vm) => {
	const isLogin = () => {
		
		const token = vm.vuex_token
		if (!token) {
			vm.$u.toast('请先登录')
			const currentPage = getCurrentPages().pop()
			// 跳转 获取携带的参数
			const {route , options} = currentPage
			
			const optionsKey = Object.keys(options)//获取key
			let params = ''
			if(optionsKey.length !==0 ) {
				params = optionsKey.reduce((pre, current)=>{
					return `${pre}${current}=${options[current]}&`
				},'?').slice(0,-1)
			}
			
			// 获取跳转的地址
			uni.setStorageSync('back_url',route+params)
			console.log(uni.getStorageSync('back_url'))
			setTimeout(() => {
				vm.$u.route({
						type: 'reLaunch',
						url: 'pages/auth/login'
					})
			}, 1500)
			return false
		}
		return true
	}
	const userUpdata = async () => {
		const userInfo = await vm.$u.api.userInfo()
		vm.$u.vuex('vuex_user',userInfo)
	}



	vm.$u.utils = {
		isLogin,
		userUpdata
	}
}
export default {
	install
}
