<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 user_header">
			<view class="user_imag ">
				<u-upload
								ref="uploadRef"
								:action="action"
								:max-count="1"
								:before-upload="beforeUpload"
								:form-data="formData"
								:multiple="false"
								:deletable="false"
								:max-size="5*1021*1024"
								:limitType="['png', 'jpg', 'jpeg', 'webp', 'gif']"
								:custom-btn="true"
								:preview-full-image="false"
								:show-progress="false"
								width="0"
								height="0"
								@on-success="uploadSuccess">
									<u-avatar slot="addBtn" :src="vuex_user.avatar_url" size="140"></u-avatar>
								</u-upload>



			</view>
			<view class="user_text">
				<view class=" user_name">{{vuex_user.name}}</view>
				<view class=" user_email">邮箱: {{vuex_user.email}}</view>
			</view>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="个人信息" @click="toPersonInfo"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="rmb-circle" title="所有订单" @click="toOrder"></u-cell-item>
				<u-cell-item icon="star" title="商品收藏" @click="toCollection"></u-cell-item>
				<u-cell-item icon="map" title="收货地址" @click="toAddress"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="reload" title="退出登录" @click="logout"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	let _this = {};
	export default {
		data() {
			return {
				action: '', // 上传路径
				formData: {}, // 上传携带的参数
				upFileName: '', // 上传后文件名
			}
		},
		async onLoad() {
			if (!this.$u.utils.isLogin()) return;
		},
		created() {
			_this = this;
		},
		methods: {
			// 跳转到个人信息
			toPersonInfo() {
				this.$u.route({
					type: 'navigateTo',
					url: `pages/center/personInfo`,
					// params: {
					// 	name:this.vuex_user.name
					// }
				})
			},
			// 跳转到我的收藏
			toCollection() {
				this.$u.route({
					url: `pages/center/collection`
				})
			},
			// 跳转到订单列表
			toOrder() {
				this.$u.route({
					url: `pages/center/order`
				})
				console.log(1)
			},
			// 跳转到地址
			toAddress() {
				this.$u.route({
					url: `pages/center/address`
				})
			},
			// 退出登录
			async logout() {
				console.log('退出登录')
				await this.$u.api.authLogout()
				this.$u.toast('退出成功')
				setTimeout(() => {
					// 清除token和用户信息
					this.$u.vuex('vuex_token', '');
					this.$u.vuex('vuex_user', {});

					// 跳转到首页
					this.$u.route({
						type: 'reLaunch',
						url: 'pages/index/index'
					})
				}, 1500)
			},

			// 上传图片之前
			// 注：微信小程序里面的这个this值是获取不到的 所以重新定义了_this的变量
			async beforeUpload(index, lists) {
				// 获取文件
				const {
					file
				} = lists[0];

				// 获取文件名称
				// #ifdef H5
				const fileName = file.name;
				// #endif

				// #ifndef H5
				const fileName = file.path;
				// #endif

				// 获取文件后缀
				const suffix = fileName.slice(fileName.lastIndexOf('.'));
				// 获取上传文件名
				const uploadFileName = _this.$u.guid(20) + suffix;
				_this.upFileName = uploadFileName;
				// 请求获取osstoken
				const res = await _this.$u.api.authOssToken()
				// 上传路径赋值
				_this.action = res.host

				_this.formData = {
					'key': uploadFileName,
					'policy': res.policy,
					'OSSAccessKeyId': res.accessid,
					'success_action_status': '200', //让服务端返回200,不然，默认会返回204
					'signature': res.signature,
				}
				return true
			},

			// 图片上传成功
			async uploadSuccess(data) {
				// 更新头像
				await this.$u.api.userUpdateAvatar({
					avatar: this.upFileName
				})

				this.$u.toast('头像更新成功')
				//更新用户信息
				this.$u.utils.userUpdata()
				// 清除上传列表
				this.$refs.uploadRef.remove(0)
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #ededed;
	}

	.user_header {
		display: flex;
		align-items: center;

		.user_imag {
			
			margin: 20rpx 20rpx;
		}

		.user_text {
			margin-left: 20rpx;

			.user_name {
				font-size: 28px;
				font-weight: 500;
			}
		}
	}

	.upload-box {
		width: 140rpx;
		height: 140rpx;
		border-radius: 70rpx;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}
</style>
