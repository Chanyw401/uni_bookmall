<template>
	<view class="wrap">
		<view class="content">
			<view class="text">
				用户注册
			</view>
			<view class="registerForm">
				<u-form :model="form" ref="uForm" :rules="formRule" label-width="160" label-align=center>
					<u-form-item label="姓名" prop="name">
						<u-input v-model="form.name" />
					</u-form-item>
					<u-form-item label="邮箱" prop="email">
						<u-input v-model="form.email" />
					</u-form-item>
					<u-form-item label="密码" prop="password">
						<u-input v-model="form.password"  type='password' />
					</u-form-item>
					<u-form-item label="确定密码" prop="password_comfirmation" type='password' >
						<u-input v-model="form.password_comfirmation"   />
					</u-form-item>
				</u-form>
				<button @tap="register" :style="[inputStyle]" class="getCaptcha">注册</button>
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
					email: '',
					password: '',
					password_confirmation: ''
				},
				// 验证规则
				formRule: {
					name: [{
						required: true,
						message: '请输入昵称',
						trigger: ['change', 'blur']
					}],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: ['change', 'blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.email(value);
							},
							message: '邮箱格式不正确',
							trigger: ['change', 'blur'],
						}
					],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur']
					}],
					password_confirmation: [{
						required: true,
						message: '请输入确认密码',
						trigger: ['change', 'blur']
					}, {
						validator: (rule, value, callback) => {
							if (this.form.password !== value) {
								return false;
							}
							return true;
						},
						message: '确认密码和密码不一致',
						trigger: ['change', 'blur'],
					}]
				}

			}


		},
		onReady() {
			this.$refs.uForm.setRules(this.formRule)
		},
		computed: {
			inputStyle() {
				let style = {}
				if (this.$u.test.email(this.email)) {
					style.color = '#fff';
					style.backgroundColor = this.$u.color(['warning'])
				}
				return style
			}
		},
		methods: {
			async register() {
				// const res = await this.$u.api.authRegister(this.form)
				// console.log(res)
				console.log('注册')
				this.$refs.uForm.validate(async (valid) => {
					console.log(valid)
					if (!valid) return false
					// 调用接口
					const res = await this.$u.api.authRegister(this.form)
					console.log(res)
					this.$u.route({
						type:'reLaunch',
						url:'pages/auth/login'
					})
				})
			}

		}
	}
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
