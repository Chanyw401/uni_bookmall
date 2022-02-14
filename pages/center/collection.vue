<template>
	<view class="u-p-20">
		<u-row gutter="16">
			<u-col span="6" v-for="item in collectionList" :key="item.id">
				<view class="goods-item">
					<u-image width="100%" height="300rpx" :src="item.goods.cover_url"></u-image>
					<view class="name ">{{item.goods.title}}</view>
					<view class="u-flex">
						<view class="price">￥ {{item.goods.price}}</view>
					</view>
				</view>
			</u-col>
		</u-row>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectionList: [], // 收藏数据列表
			}
		},
		async created() {
			const res = await this.$u.api.collects()
			this.collectionList = res.data
			console.log(res)
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	*{
		box-sizing: border-box;
	}
	.goods-item {
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 12rpx 20rpx rgba(0, 0, 0, .1);

		// 标题
		.name {
			font-size: 32rpx;
			font-weight: bold;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			width: 100%;
		}

		// 价格
		.price {
			width: 100%;
			color: red;
		}
	}
</style>
