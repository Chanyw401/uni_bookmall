<template>
	<view class="">
		<view class="container">
			<view class="cartItem" v-for="item in cartList" :key="item.id">
				<view class="left u-text-center">
					<u-checkbox v-model="item.is_checked === 1 ? true : false" :name="item.id" @change="changCheck"
						shape="circle" size="40"></u-checkbox>
				</view>
				<view class="image">
					<u-image width="200rpx" height="240rpx" border-radius="20" :src="item.goods.cover_url"></u-image>
				</view>
				<view class="right u-flex u-flex-col u-fl u-flex-1">
					<view class="top u-flex u-flex-col">
						<text class="title">{{item.goods.title}}</text>
						<text class="desc">{{item.goods.description}}</text>
					</view>
					<view class="bottom ">
						<view class="price">
							￥{{item.goods.price}}
						</view>
						<view class="num u-m-l-10 u-m-r-10" style="width: 200rpx;">
							<u-number-box v-model="item.num" @minus="handleNum(item)" @plus="handleNum(item)">
							</u-number-box>
						</view>
						<view class="icon" @click="del(item.id)">
							<u-icon name="trash" size="40"></u-icon>
						</view>
					</view>
				</view>
			</view>

		</view>
		<view class="footer">
			<view class="u-flex-5">
				<u-checkbox v-model="allCheck" size="40" shape="circle">全选</u-checkbox>
			</view>
			<view>
				<view class="footer_price">
					<text class="title">合计:</text>
					<text class="price">￥{{totalPrice}}</text>
					<u-button type="primary" :ripple="true" shape="square" disabled>去结算</u-button>
				</view>

			</view>
		</view>
		<u-modal v-model="show" content="确认要移除商品吗？" :show-cancel-button="true" @cancel="show = false"
			@confirm="confirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardId: '', // 要删除的id
				cartList: [], // 购物车数据列表
				show: false, // 删除提示
			}
		},
		computed: {
			//合计
			totalPrice() {
				return this.cartList.filter(item => {
					return item.is_checked ? true : false;
				}).reduce((pre, curr) => {
					return parseFloat(pre) + parseFloat(curr.goods.price) * curr.num;
				}, 0)
			},
			// 全选或全不选
			allCheck: {
				get() {
					return this.cartList.every(item => {
						return item.is_checked;
					});
				},
				set(val) {
					this.checkAll(val)
				}
			}
		},
		onLoad() {
			this.getCartList()
		},
		methods: {
			// 获取购物车数据
			async getCartList() {
				const res = await this.$u.api.cartsList()
				this.cartList = res.data
				console.log(res)
			},
			// 移除购物车数据
			del(id) {
				this.show = true
				this.cardId = id
			},
			async confirm() {
				await this.$u.api.cartsDel(this.cardId)
				this.$u.toast('移除商品成功')
				this.getCartList()
			},
			//单选
			async changCheck(val) {
				const {
					name,
					value
				} = val

				let idArr = []
				this.cartList.map(item => {
					if (item.is_checked) {
						idArr.push(item.id)
					}
				})
				if (!value) {
					//选中状态 -> 未选中状态
					idArr.splice(idArr.indexOf(name), 1)
				} else {
					// 未选中 -> 选中
					idArr.push(name)
				}
				// 更新选中状态
				await this.$u.api.cartsChecked({
					cart_ids: idArr
				})
				// 重新获取数据刷新
				this.getCartList()
			},

			// 全选/全不选
			async checkAll(val) {
				let idArr = []
				if (!val) {
					await this.$u.api.cartsChecked({
						cart_ids: []
					})
				} else {
					this.cartList.map(item => {
						idArr.push(item.id)
					})
					await this.$u.api.cartsChecked({
						cart_ids: idArr
					})
				}
				this.getCartList()
			},

			// 数量增加或减少
			async handleNum(item) {
				await this.$u.api.cartsNum(item.id, {
					num: item.num
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	*{
		box-sizing: border-box;
	}
	.container {
		height: calc(100vh - 298rpx);
		overflow-y: scroll;

		.cartItem {
			display: flex;
			align-items: center;


			border: 1rpx solid #eee;
			border-radius: 20rpx;
			margin-bottom: 20rpx;

			.left {
				display: flex;
				align-items: center;
				width: 80rpx;
				height: 80rpx;
				padding: 10rpx;
			}

			.image {}

			.right {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				
				height: 240rpx;
				padding: 20rpx 20rpx;

				.top {
					width: 100%;

					text {
						height: 40rpx;
						line-height: 40rpx;
						width: 100%;
						text-align: left;
					}
				}

				.bottom {
					display: flex;
					justify-content: space-around;
					align-items: center;
					width: 100%;




				}



			}
		}


	}

	.footer {
		display: flex;

		align-items: center;
		justify-content: space-between;
		padding-left: 40rpx;
		padding-right: 20rpx;
		margin-top: 40rpx;
		position: fixed;


		bottom: 100rpx;
		height: 100rpx;

		width: 100%;
		z-index: 1111;

		.price {
			height: 50rpx;
			line-height: 50rpx;
			overflow: hidden;
			color: red;
			font-weight: bold;
			font-size: 35rpx;
			padding-right: 20rpx;
		}

		.icon {
			color: red;
			width: 40rpx;
		}

		.footer_price {
			display: flex;
			align-items: center;

		}
	}
</style>
