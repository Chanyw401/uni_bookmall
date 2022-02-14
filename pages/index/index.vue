<template>
	<view class="content ">
		<!-- 轮播图 -->
		<view class="u-swiper">
			<u-swiper :list='swiperList' name="img_url" height="350rpx"></u-swiper>
		</view>
		<!-- 导航栏 -->
		<view class="tabs">
			<u-tabs :list="tabsList" :is-scroll="false" :current="currentSort" @change="tabsChange"></u-tabs>
		</view>

		<view class="wrap  u-skeleton">
			<!-- 商品 -->
			<u-row gutter="16">
				<u-col span="6" v-for=" (item, index) in goodsList.length? goodsList:[{},{}]" :key='index'>
					<goods-card :goods='item'></goods-card>
				</u-col>
			</u-row>
			<!--引用骨架组件-->
			<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>

		</view>
		<!-- 回滚 -->
		<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
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
				// 轮播图
				swiperList: [],
				// 导航栏
				tabsList: [{
						name: '默认'
					},
					{
						name: '销量 '
					},
					{
						name: '推荐 '
					},
					{
						name: '最新 '
					}
				],

				currentSort: 0,
				// 商品
				goodsList: [],
				page: 1,
				loading: false,
				scrollTop: 0


			}
		},


		 onLoad() {
			
			
			// 首页数据
			this.getData()
			
			
			
			







		},
		onReachBottom() {
			this.page++

			this.getData()


			console.log(this.page)

		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			tabsChange(index) {
				console.log(index)
				this.currentSort = index
				this.goodsList = []
				this.page = 1
				this.getData()
			},
			async getData() {
				this.loading = true

				const params = {
					page: this.page
				}

				if (this.currentSort == 1) params.sales = 1
				if (this.currentSort == 2) params.recommend = 1
				if (this.currentSort == 3) params.new = 1

				const res = await this.$u.api.index(params)
				// 轮播图
				this.swiperList = res.slides
				this.goodsList = [...this.goodsList, ...res.goods.data]
				this.loading = false
			}

		}
	}
</script>

<style scoped lang="scss">
	* {
		box-sizing: border-box;
	}

	.tabs {
		padding: 10rpx 20rpx;
		
	}

	.wrap {
		margin-top: 20rpx;
		background-color: #f5f5f5;
	}
</style>
