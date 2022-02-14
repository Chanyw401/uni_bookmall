<template>
	<view class="content">
		<!-- 商品详细 头部 -->

		<view class="gooods-item">
			<view class="goods-img">
				<u-image width="100%" height="500rpx" :src="goodsInfo.cover_url"></u-image>
			</view>
			<view class="goods-text">
				<view class="goods-title">
					{{goodsInfo.title}}
				</view>
				<view class="goods-price-sales">
					<view class="goods-price">
						￥ {{goodsInfo.price}}
					</view>
					<view class="goods-sales">
						销量：{{goodsInfo.sales}}
					</view>
				</view>
			</view>
			<!-- tabs 导航栏 -->
			<view class="tabs">
				<u-tabs :list="list" :current="current" @change="changeTabs" item-width =260rpx ></u-tabs>
			</view>
			


			<!-- 商品详情 -->
			<view class="goods_content">
				<template v-if="current === 0 ">
					<view class="u-content">
						<u-parse :html="goodsInfo.details"></u-parse>
					</view>
				</template>
				<!-- 商品评论 -->
				<template v-if="current === 1">
					<view class="comment" v-for="(res, index) in commentList" :key="res.id">
						<view class="left">
							<image :src="res.url" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="top">
								<view class="name">{{ res.name }}</view>
								<view class="like" :class="{ highlight: res.isLike }">
									<view class="num">{{ res.likeNum }}</view>
									<u-icon v-if="!res.isLike" name="thumb-up" :size="30" color="#9a9a9a"
										@click="getLike(index)"></u-icon>
									<u-icon v-if="res.isLike" name="thumb-up-fill" :size="30" @click="getLike(index)">
									</u-icon>
								</view>
							</view>
							<view class="content">{{ res.contentText }}</view>
							<view class="reply-box">
								<view class="item" v-for="(item, index) in res.replyList" :key="item.index">
									<view class="username">{{ item.name }}</view>
									<view class="text">{{ item.contentStr }}</view>
								</view>
								<view class="all-reply" @tap="toAllReply" v-if="res.replyList != undefined">
									共{{ res.allReply }}条回复
									<u-icon class="more" name="arrow-right" :size="26"></u-icon>
								</view>
							</view>
							<view class="bottom">
								{{ res.date }}
								<view class="reply">回复</view>
							</view>
						</view>
					</view>
				</template>

				<!-- 推荐商品 -->
				<template v-if="current === 2">
					<view class="like_goods">
						<u-row gutter="16">
							<u-col span="6" v-for=" (item, index) in likeGoods.length? likeGoods:[{},{}]" :key='index'>
								<goods-card :goods='item'></goods-card>
							</u-col>
						</u-row>
					</view>
				</template>

			</view>
			<!-- 底部购物栏 -->
			<view class="goods_tabbar">
				<view class="left">
					<view class="item" @click="collectionHandle()" v-if="isCollect === 0">
						<u-icon name="star-fill" :size="40" :color="isCollect === 1 ? '#ed3f14' : ''"></u-icon>
						<view class="text u-line-1"  >收藏</view>
					</view>
					<view class="item" @click="collectionHandle()" v-if="isCollect === 1">
						<u-icon name="star-fill" :size="40" :color="isCollect === 1 ? '#ed3f14' : ''"></u-icon>
						<view class="text u-line-1" style="color: red;" >收藏</view>
					</view>
					<view class="item car" @click="toCart">
						<u-badge class="car-num" :count="cartCount" type="error" :offset="[-3, -6]"></u-badge>
						<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
						<view class="text u-line-1">购物车</view>
					</view>
				</view>
				<view class="right">
					<view class="cart btn u-line-1" @click="addCart">加入购物车</view>
					<view class="buy btn u-line-1">立即购买</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import GoodsCard from '../../compoents/goods-card/goods-card.vue';
	export default {
		components: {
			GoodsCard
		},
		data() {
			return {
				// 商品详细
				goodsInfo: {},

				list: [{
					name: '商品介绍'
				}, {
					name: '商品评论',
					count: 5
				}, {
					name: '推荐商品',

				}],
				current: 0,
				commentList: [], //评论列表
				likeGoods: [], //推荐列表
				cartCount: 0, //购物车数量
				isCollect: 0, //是否收藏 



			}
		},
		async onLoad(options) {
			const res = await this.$u.api.goodsInfo(options.goodsId)
			console.log(res)

			this.goodsInfo = res.goods
			this.commentList = res.goods.comments
			this.likeGoods = res.like_goods
			console.log(this.goodsInfo)
			this.isCollect = res.goods.is_collect

		},
		onShow() {
			this.getCartsCount()



		},
		methods: {
			changeTabs(index) {
				this.current = index
			},
			async collectionHandle() {
				if (!this.$u.utils.isLogin()) return;
				await this.$u.api.collectsCollectionAndCancel(this.goodsInfo.id)
				if (this.isCollect === 0) {
					this.isCollect = 1
					this.$u.toast('收藏成功')
				} else {
					this.isCollect = 0
					this.$u.toast('取消收藏成功')
				}
			},
			async toCart() {
				this.$u.route({
					type:'switchTab',
					url:'pages/cart/cart'
				})

			}, //添加购物车
			async addCart() {
				const params = {
					goods_id: this.goodsInfo.id
				}
				await this.$u.api.addCar(params)
				this.getCartsCount()
				this.$u.toast('商品添加成功')
			},
			// 获取购物车数量
			async getCartsCount() {
				if (this.$u.utils.isLogin()) {
					const res = await this.$u.api.cartsList()
					console.log(res)
					this.cartCount = res.data.length
				}
			},


		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
	}
	.tabs {
		display: flex;
		justify-content: center;
		
			
			
			
			u-tabs {
				padding:0 40rpx;
				margin: 0 40rpx;  
			}
		}

	.content {

		padding: 20rpx 20rpx;

		.gooods-item {
			.goods-text {
				.goods-title {
					margin-top: 20rpx;
					font-weight: 600;
					font-size: 36rpx;
				}

				.goods-price-sales {
					display: flex;
					justify-content: space-between;
					padding: 0 20rpx;
					margin-top: 10rpx;

					.goods-price {
						font-size: 36rpx;
						color: red;
					}

					.goods-sales {
						color: #ccc;
					}


				}
			}
		}

		
	}

	.goods_content {
		margin-bottom: 110rpx;
	}

	.goods_tabbar {
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 0rpx;
		left: 0;
		right: 0;
		width: 100%;
		height: 100rpx;

		background-color: #ffffff;
		border: 2rpx solid #ccc;

		.left {
			display: flex;
			font-size: 20rpx;
			align-items: center;

			.item {
				padding: 0 40rpx;

				&.car {
					text-align: center;
					position: relative;

					.car-num {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}
				}
			}
		}

		.right {

			display: flex;
			align-items: center;
			font-size: 28rpx;
			margin-right: 20rpx;

			.btn {
				line-height: 66rpx;
				padding: 0 30rpx;
				border-radius: 36rpx;
				color: #ffffff;
			}

			.cart {
				background-color: #ed3f14;
				margin-right: 30rpx;
			}

			.buy {
				background-color: #ff7900;
			}
		}


	}
</style>
