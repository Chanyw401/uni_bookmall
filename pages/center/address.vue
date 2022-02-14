<template>
	<view>
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in addressList" :key="item.id"
			@click="click" @open="open" :options="options" btn-width="240">
			<view class="item u-border-bottom u-p-20">
				<view class="top">
					<view class="name">{{ item.name }}</view>
					<view class="phone">{{ item.phone }}</view>
					<view class="tag" v-if="item.is_default === 1">
						<text class="red">默认</text>
					</view>
				</view>
				<view class="bottom">
					{{item.province}}{{item.city}}{{item.county}}{{item.address}}
					<u-icon name="edit-pen" :size="40" color="#999999" @click="toAddSite(item.id)"></u-icon>
				</view>
			</view>
		</u-swipe-action>


		<view class="addSite" @tap="toAddSite(0)">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [], // 地址列表
				options: [{
						text: '设为默认',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]

			};
		},
		onLoad() {
			this.getData();
		},
		methods: {
			// 获取地址列表
			async getData() {
				const res = await this.$u.api.addressList()
				console.log(res)
				this.addressList = res.data.map(item => {
					item.show = false
					return item;
				})
			},
			// 地址添加或修改
			toAddSite(id) {
				this.$u.route({
					url: 'pages/center/addAddress',
					params: {
						addressId: id
					}
				})
			},
			// 只能打开一个
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.addressList[index].show = true;
				this.addressList.map((val, idx) => {
					if (index != idx) this.addressList[idx].show = false;
				})
			},
			click(index, index1) {
				const address = this.addressList[index]
				if (index1 == 1) {
					this.$u.api.addressDel(address.id)
					this.$u.toast(`删除成功`);
				} else {
					this.$u.api.addressDefault(address.id)
					this.addressList[index].show = false;
					this.$u.toast(`设置成功`);
				}
				this.$nextTick(() => {
					this.getData()
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.item {
		padding: 40rpx 20rpx;

		.top {
			display: flex;
			font-weight: bold;
			font-size: 34rpx;

			.phone {
				margin-left: 60rpx;
			}

			.tag {
				display: flex;
				font-weight: normal;
				align-items: center;

				text {
					display: block;
					width: 60rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #ffffff;
					font-size: 20rpx;
					border-radius: 6rpx;
					text-align: center;
					margin-left: 30rpx;
					background-color: rgb(49, 145, 253);
				}

				.red {
					background-color: red
				}
			}
		}

		.bottom {
			display: flex;
			margin-top: 20rpx;
			font-size: 28rpx;
			justify-content: space-between;
			color: #999999;
		}
	}

	.addSite {
		display: flex;
		justify-content: space-around;
		width: 600rpx;
		line-height: 100rpx;
		position: absolute;
		bottom: 30rpx;
		left: 80rpx;
		background-color: red;
		border-radius: 60rpx;
		font-size: 30rpx;

		.add {
			display: flex;
			align-items: center;
			color: #ffffff;

			.icon {
				margin-right: 10rpx;
			}
		}
	}
</style>
