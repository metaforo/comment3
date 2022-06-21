<template>
	<a-row
		v-if="postsCount || likesCount || fixedTipAmount"
		class="post-info"
		type="flex"
		justify="start"
		align="middle"
	>
		<div
			v-if="postsCount"
			:class="['action', { 'first-post': isFirstPost == false }]"
		>
			<span class="num">{{ postsCount }}</span>
			<span class="text"> {{ $tc("comment", postsCount) }}</span>
		</div>
		<Dot v-if="postsCount && likesCount && isFirstPost == false" />
		<div
			v-if="likesCount && isFirstPost == false"
			:class="['action', { 'first-post': isFirstPost == false }]"
		>
			<span class="num">{{ likesCount }}</span>
			<span class="text"> {{ $tc("likes", likesCount) }}</span>
		</div>
		<Dot
			v-if="
				(postsCount || likesCount) &&
				fixedTipAmount != 0 &&
				isFirstPost == false
			"
		/>
		<div
			v-if="fixedTipAmount != '0' && isFirstPost == false"
			:class="['action', { 'first-post': isFirstPost == false }]"
		>
			<span class="num">{{ fixedTipAmount }}</span>
			<span class="text" v-if="fixedTipAmount"> Tipped</span>
		</div>
	</a-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { tranTokenNumber } from "@/helpers/Utils";
import Dot from "@/components/Dot.vue";

export default defineComponent({
	components: { Dot },
	props: {
		postsCount: { type: Number, default: 0 },
		likesCount: { type: Number, default: 0 },
		tipAmount: Object,
		isFirstPost: { type: Boolean, default: false },
	},
	data() {
		return {
			isMobile: false,
			fixedTipAmount: "",
		};
	},
	created() {
		if (undefined != this.tipAmount && this.tipAmount) {
			for (let key in this.tipAmount) {
				// console.log(key + '---' + this.tipAmount[key])
				if (this.tipAmount[key] > 0) {
					this.fixedTipAmount +=
						tranTokenNumber(this.tipAmount[key]) + " " + key + " ";
				}
			}
			// this.fixedTipAmount = tranTokenNumber(this.tipAmount);
			// if(!this.fixedTipAmount){
			//   this.fixedTipAmount = '0';
			// }
		}
	},
});
</script>

<style lang="scss" scoped>
.post-info {
	padding: var(--p6) 0 0;

	.action {
		color: var(--font-color1);
		font-size: $font-size2;
		font-weight: 500;
		@include capitalize;

		&.mobile {
			font-size: 1.3rem;
		}
	}

	.action.first-post {
		font-size: 0.9rem;

		.text {
			white-space: pre;
			color: var(--desc-color);
			font-size: 0.9rem;
		}

		&.mobile {
			font-size: $mobile-thread-like-font-size;

			.text {
				white-space: pre;
				font-size: $mobile-thread-like-font-size;
			}
		}
	}

	&.mobile {
		padding-top: 24px;
	}
}
</style>
