<template>
	
	<navigator class="goddsList" :url="'/pages/goods/detail?goodsId='+goods.id">
		
		<u-image width="100%" height="300rpx" class="u-skeleton-fillet"
			:src="goods.cover_url"></u-image>
		<view class="text u-skeleton-rect">
			{{goods.title}}
		</view>
		<view class="goddsListItem u-skeleton-rect">
			<view class="goodsPrice   ">
				￥:{{goods.price}}
			</view>
			<view class="goodsSales  ">
				销量:{{goods.sales}}
			</view>
			</view>
	</navigator>
</template>

<script>
	export default {
		
		data() {
			return {
				
			}
		}
		,props:{
			goods:{
				type:Object,
				default() {
					return {}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goddsList {
		
		padding: 20rpx 40rpx
		;
		margin-top: 10rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	
	
		.goddsListItem {
			display: flex;
			width: 100%;
			justify-content: space-between;
			
			.goodsPrice{
				width: 40%;
				color: #ea6280;
				
			}
			.goodsSales{
				width: 40%;
				font-size: 28rpx;
				color: #e2e2e2;
				
			}
	
		}
		.text{
			width: 100%;
			margin: 20rpx;
			font-size: 28rpx;
			// 一行显示，多出部分用....省略
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		
	
	}
</style>
