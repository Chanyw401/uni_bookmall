<template>

	<view class="wrap">
		<view class="content">
			<view class="text">
				修改个人信息
			</view>
			<view class="registerForm">
				<u-form :model="form" ref="uForm" :rules="formRule" label-width="160">
					<u-form-item label="姓名" prop="name">
						<u-input v-model="form.name" />
					</u-form-item>

				</u-form>
				<button @tap="reviseInfo" :style="[inputStyle]" class="getCaptcha">修改个人信息</button>
			</view>
		</view>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				// 表单
				form: {
					name: '',

				},
				// 验证规则
				formRule: {
					name: [{
						required: true,
						message: '请输入昵称',
						trigger: ['change', 'blur']
					}, {
						min: 3,
						max: 6,
						message: '请输入3-6个字符'
					}]

				}

			}


		},
		onReady() {
			this.$refs.uForm.setRules(this.formRule)
		},
		computed: {
			inputStyle() {
				let style = {};
				if (this.form.name) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['warning'];
				}
				return style;
			}
		},onShow() {
			this.form.name = this.vuex_user.name
		},

		methods: {
			async reviseInfo() {
				// const res = await this.$u.api.authRegister(this.form)
				// console.log(res)
				this.$refs.uForm.validate(async (valid) => {
					if (!valid) return false
					// 调用接口
					
					 await this.$u.api.userInfoUpdata(this.form)
					 // 更新个人数据
					this.$u.utils.userUpdata()
					console.log(this.vuex_user)
					this.$u.route({
						type: 'reLaunch',
						url: 'pages/auth/login'
					})
				})
			}

		}
	}
</script>
</script>
<style lang="scss" scoped>
	.wrap {

		display: flex;
		justify-content: center;

		.content {
			width: 100%;
			padding: 100rpx;
			font-size: 28rpx;
		}

		.text {
			display: flex;
			justify-content: center;

			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 50rpx;

		}

		.getCaptcha {
			background-color: rgb(253, 243, 208);
		}
	}
</style>
