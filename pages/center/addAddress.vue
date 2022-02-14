<template>
	<view class="wrap">
		<view class="top">
			<view class="item">
				<view class="left">收货人</view>
				<input type="text" placeholder-class="line" v-model="name" placeholder="请填写收货人姓名" />
			</view>
			<view class="item">
				<view class="left">手机号码</view>
				<input type="text" placeholder-class="line" v-model="phone" placeholder="请填写收货人手机号" />
			</view>
			<view class="item" @tap="showRegionPicker">
				<view class="left">所在地区</view>
				<input disabled type="text" v-model="result" placeholder-class="line" placeholder="省市区县、乡镇等" />
			</view>
			<view class="item address">
				<view class="left">详细地址</view>
				<textarea type="text" placeholder-class="line" v-model="address" placeholder="街道、楼牌等" />
			</view>
		</view>
		<view class="bottom">
			<view class="default">
				<view class="left">
					<view class="set">设置默认地址</view>
					<view class="tips">提醒：每次下单会默认推荐该地址</view>
				</view>
				<view class="right">
					<u-switch v-model="is_default"></u-switch>
				</view>
			</view>
			<u-picker mode="region" ref="uPicker" :default-region="defalutRegion" v-model="show" @confirm="confirm" />
		</view>
		<u-button class="u-m-l-40 u-m-r-40" type="primary" @click="save()">保存</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defalutRegion: [],// 默认地址
				addressId: 0,// 地址id
				show: false,
				result: '', // 地址选择后的结果
				name: '', // 收货人姓名
				phone: '', //收货手机号
				province: '', //省
				city: '', //市
				country: '', // 区县
				address: '', // 详细地址
				is_default: false, // 是否是默认地址
			};
		},
		onLoad(options) {
			this.addressId = options.addressId 
			if(options.addressId !== '0'){
				this.getAddressDetail(options.addressId)
			}
		},
		methods: {
			// 获取地址详情
			async getAddressDetail(id){
				const res = await this.$u.api.addressDetail(id)
				console.log(res)
				this.name = res.name
				this.phone = res.phone
				this.province = res.province
				this.country = res.county
				this.result = `${res.province}-${res.county}-${res.city}`
				this.city = res.city
				this.address = res.address
				this.is_default = res.is_default === 1 ? true : false
				this.defalutRegion.push(res.province)
				this.defalutRegion.push(res.city)
				this.defalutRegion.push(res.county)
			},
			showRegionPicker() {
				this.show = true;
			},
			// 获取省市区
			confirm(res) {
				// console.log(res)
				// 省 市 区
				this.province = res.province.label
				this.city = res.city.label
				this.country = res.area.label
				this.result = `${this.province}-${this.city}-${this.country}`
			},
			async save() {
				if (!this.name) return this.$u.toast('收货人姓名不能为空')
				if (!this.phone) return this.$u.toast('手机号不能为空')
				if (!this.$u.test.mobile(this.phone)) return this.$u.toast('手机号格式不正确')
				if (!this.result) return this.$u.toast('所在地区不能为空')
				if (!this.address) return this.$u.toast('详细地址不能为空')
				let is_default = 0
				if (this.is_default) is_default = 1
				const params = {
					name: this.name,
					phone: this.phone,
					province: this.province,
					city: this.city,
					county: this.country,
					address: this.address,
					is_default
				}
				// console.log(params)
				if(this.addressId !== 0){
					// 调用接口
					await this.$u.api.addressEdit(this.addressId,params)
					this.$u.toast('修改地址成功')
				}else{
					// 调用接口
					await this.$u.api.addressAdd(params)
					this.$u.toast('添加地址成功')
				}
				setTimeout(() => {
					this.$u.route('pages/center/address')
				},1000)
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .line {
		color: $u-light-color;
		font-size: 28rpx;
	}

	.wrap {
		background-color: #f2f2f2;

		.top {
			background-color: #ffffff;
			border-top: solid 2rpx $u-border-color;
			padding: 22rpx;

			.item {
				display: flex;
				font-size: 32rpx;
				line-height: 100rpx;
				align-items: center;
				border-bottom: solid 2rpx $u-border-color;

				.left {
					width: 180rpx;
				}

				input {
					text-align: left;
				}
			}

			.address {
				padding: 20rpx 0;

				textarea {
					// width: 100%;
					height: 150rpx;
					background-color: #f7f7f7;
					line-height: 60rpx;
					margin: 40rpx auto;
					padding: 20rpx;
				}
			}

			.site-clipboard {
				padding-right: 40rpx;

				textarea {
					// width: 100%;
					height: 150rpx;
					background-color: #f7f7f7;
					line-height: 60rpx;
					margin: 40rpx auto;
					padding: 20rpx;
				}

				.clipboard {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					color: $u-tips-color;
					height: 80rpx;

					.icon {
						margin-top: 6rpx;
						margin-left: 10rpx;
					}
				}
			}
		}

		.bottom {
			// margin-top: 20rpx;
			padding: 40rpx;
			padding-right: 0;
			background-color: #ffffff;
			font-size: 28rpx;

			.tag {
				display: flex;

				.left {
					width: 160rpx;
				}

				.right {
					display: flex;
					flex-wrap: wrap;

					.tags {
						width: 140rpx;
						padding: 16rpx 8rpx;
						border: solid 2rpx $u-border-color;
						text-align: center;
						border-radius: 50rpx;
						margin: 0 10rpx 20rpx;
						display: flex;
						font-size: 28rpx;
						align-items: center;
						justify-content: center;
						color: $u-content-color;
						line-height: 1;
					}

					.plus {
						//padding: 10rpx 0;
					}
				}
			}

			.default {
				margin-top: 50rpx;
				display: flex;
				justify-content: space-between;
				border-bottom: solid 2rpx $u-border-color;
				line-height: 64rpx;

				.tips {
					font-size: 24rpx;
				}

				.right {}
			}
		}
	}
</style>
