<template>
	<div>
		<div
			v-if="posts.length"
			class="posts"
			:class="[
				{
					'flex-row': depth > 1,
				},
			]"
		>
			<!--      <div v-if="depth==2" style="width: 44px;height: 100%">-->
			<div v-if="depth == 2" class="long-line-2-div">
				<div class="long-line"></div>
				<!--              <div class="post-quxian-class post-quxian-class-2-top" ></div>-->
				<div class="post-quxian-class post-quxian-class-2-bottom"></div>
			</div>

			<!--        <div v-if="depth == 3" class="long-line-3-div">-->
			<!--          <div class="long-line"></div>-->
			<!--&lt;!&ndash;          <div class="post-quxian-class post-quxian-class-3 post-quxian-class-3-top"></div>&ndash;&gt;-->
			<!--          <div class="post-quxian-class post-quxian-class-3 post-quxian-class-3-bottom"></div>-->
			<!--        </div>-->

			<div :class="[{ 'level-padding-2': depth > 1 }]">
				<div
					v-for="(post, index) in posts"
					:key="String(index) + post.id"
					class="item"
					:class="[{ mobile: isMobile && depth === 1 }]"
				>
					<PostContentLevelTwo
						v-if="post && post.id"
						:post="post"
						:depth="depth"
					/>
					<div v-else-if="!disableLoadMore" class="load-more">
						<span v-on:click="loadMore(index)">{{
							$tc("load_more", parseInt(post))
						}}</span>
					</div>
				</div>
				<div v-if="disableLoadMore">
					<a-skeleton
						active
						avatar
						:paragraph="{ rows: 1 }"
						:loading="disableLoadMore"
					/>
				</div>
			</div>
		</div>

		<div
			:class="[
				{
					'reply-padding-2': depth == 2,
					'reply-padding-3': depth == 3,
				},
			]"
		>
			<div class="editor-box">
				<!--            <div-->
				<!--                    :class="[{'post-quxian-2': depth == 2}, {'post-quxian-3': depth > 2 && depth < 4}]"-->
				<!--                    :style="bottomReplyStyle"-->
				<!--            >-->
				<!--            </div>-->
				<div v-if="depth > 1 && depth < 3">
					<EditorTrigger
						v-if="!bottomReply"
						:avatar-scale="1"
						:placeholder="replyPlaceholder"
						:triggerFunc="showBottomReply"
					/>
					<QuickReply
						v-else
						:post="pesudoPost"
						:is-first-post="false"
						:set-editor-focus="true"
						:scale="1"
						:placeholder="replyPlaceholder"
						:max-height="maxHeight"
						v-on:new-post="onNewPost"
						v-on:close-editor="() => {}"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PostInterface } from "@/helpers/Interfaces";
import QuickReply from "@/components/QuickReply.vue";
import PostContentLevelTwo from "@/components/PostContentLevelTwo.vue";
import EditorTrigger from "@/components/EditorTrigger.vue";

export default defineComponent({
	components: { EditorTrigger, PostContentLevelTwo, QuickReply },
	props: {
		parentPost: {
			type: Object as PropType<PostInterface>,
		},
		posts: {
			type: Object as PropType<Array<PostInterface>>,
			default: [],
		},
		depth: {
			type: Number,
			default: 0,
		}, // how deep the post tree nested
	},
	data() {
		return {
			isMobile: false,
			parentPostId: -1,
			hasLoadMore: false,
			disableLoadMore: false,
			bottomReply: false,
			maxHeight: 0,
			bottomReplyStyle: {},
			pesudoPost: {} as PostInterface,
			replyPlaceholder: this.$t("share_thoughts") as string,
		};
	},
	created() {
		// console.log(this.depth);
		if (this.posts && this.posts[0] && this.posts[0].parent_id != -1) {
			this.parentPostId = this.posts[0].parent_id;
			// with parent post_id and thread_id, it is enough to submit a reply
			this.pesudoPost.id = this.posts[0].parent_id;
			this.pesudoPost.thread_id = this.posts[0].thread_id;
		}

		if (this.depth == 1) {
			this.replyPlaceholder = "Write a reply...";
		} else {
			this.replyPlaceholder = this.$t("reply_to", {
				username: this.parentPost.user.name,
			}) as string;
		}

		if (
			this.posts &&
			this.posts.length &&
			this.posts[this.posts.length - 1] &&
			(typeof this.posts[this.posts.length - 1] == "number" ||
				typeof this.posts[this.posts.length - 1] == "string")
		) {
			this.hasLoadMore = true;

			if (this.parentPost.user.id != this.$store.state.User.id) {
				this.replyPlaceholder = this.$t("reply_to", {
					username: this.parentPost.user.name,
				}) as string;
			}
		}
	},
	beforeDestroy() {
		// delete this.posts;
	},
	watch: {
		bottomReply: {
			handler() {
				this.onOpenEditor();
			},
		},
	},
	methods: {
		showBottomReply() {
			this.bottomReply = true;
		},

		loadMore(index: number) {
			//
			if (this.parentPostId == -1 && this.disableLoadMore) {
				return;
			}

			this.disableLoadMore = true;

			this.$store
				.dispatch("Thread/loadMore", {
					post_id: this.parentPostId,
					sort: this.$route.params.sort
						? this.$route.params.sort
						: SORT_BY_GROUP[1],
				})
				.then((response: Response) => {
					// if http status is not 200
					if (response.getStatus() != 200) {
						this.$message.info(this.$t("network_error") as string);
						return;
					}

					const responseData: { posts: PostInterface[] } =
						response.getData();

					// this.$store.commit('Attachment/pushAttachImg', );

					if (
						typeof this.posts[index] === "string" ||
						typeof this.posts[index] === "number"
					) {
						// use `this.posts.length` becasue we will load the sub post tree from server,
						// we don't need to keep the dynamically added posts
						this.posts.splice(
							index,
							this.posts.length,
							...responseData.posts
						);
						this.disableLoadMore = false;
					}

					this.$store.commit(
						"Attachment/addAttachImg",
						this.getPostAttachImg(
							this.$store.state.Thread.first_posts,
							this.$store.state.Thread.posts
						)
					);
				});
			this.$emit("load-more");
		},

		getPostAttachImg(first_post: any, posts: any) {
			let attached_files: any[] = [];
			if (first_post && first_post.attached_files) {
				for (let attachment in first_post.attached_files) {
					if (
						String(
							first_post.attached_files[attachment].mime_type
						).match(/^image\//)
					) {
						attached_files.push(
							first_post.attached_files[attachment]
						);
					}
				}
			}
			for (let post in posts) {
				if (
					posts[post].attached_files &&
					posts[post].attached_files &&
					posts[post].attached_files.length > 0
				) {
					for (let attachment in posts[post].attached_files) {
						// console.log(posts[post].attached_files,posts[post].attached_files[attachment],String(posts[post].attached_files[attachment].mime_type));
						if (
							String(
								posts[post].attached_files[attachment].mime_type
							).match(/^image\//)
						) {
							attached_files.push(
								posts[post].attached_files[attachment]
							);
						}
					}
				}
				if (posts[post].children) {
					attached_files = attached_files.concat(
						this.getPostAttachImg([], posts[post].children)
					);
				}
			}
			return attached_files;
		},

		onNewPost(postData: PostInterface): void {
			this.hasLoadMore = false;
			this.bottomReply = false;
			this.posts.push(postData);
		},

		onOpenEditor() {
			if (this.bottomReply) {
				if (this.isMobile) {
					this.bottomReplyStyle = {
						bottom: "160px",
					};
				} else {
					this.bottomReplyStyle = {
						bottom: "194px",
					};
				}
			} else {
				this.bottomReplyStyle = {};
			}
			this.$emit("open-editor", this.bottomReply);
		},
	},
});
</script>

<style lang="scss" scoped>
.posts {
	margin: 0;
	padding: 0;
	line-height: 1;
	list-style: none;
	position: relative;

	&.mobile {
		padding-top: 10px;
	}

	.item {
		padding: 0;
		position: relative;

		&.mobile {
			padding-top: 10px;
		}

		.load-more {
			padding: var(--p6) 0 0;

			span {
				@include load_more;
			}
		}
	}
}

.flex-row {
	display: flex;
	flex-direction: row;
}

.reply-padding-2 {
	padding-left: 48px;
}

.reply-padding-3 {
	padding-left: 36px;
}

.level-padding-2 {
	//margin-left: var(--p2);
	//width: 100%;
	//margin-right: 25px;
	width: calc(100% - var(--p2) - 40px);
}

.level-padding-3 {
	//margin-left: var(--p1);
	//width: 100%;
	width: calc(100% - var(--p2) - 28px);
}

.long-line-2-div {
	width: calc(40px + var(--p2));
	min-width: calc(40px + var(--p2));
	position: relative;
	padding-right: var(--p2);
}

.long-line-3-div {
	width: calc(28px + var(--p2));
	min-width: calc(28px + var(--p2));
	position: relative;
	padding-right: var(--p2);
}

.long-line {
	margin: auto;
	width: 2px;
	background-color: var(--border-color7);
	height: 100%;
}

.post-quxian-class {
	height: calc(16px + var(--p5));
	margin-left: 19px;
	width: 20px;
	border-width: 2px;
	border-color: var(--border-color7);
	border-bottom-left-radius: 15px;
	border-bottom-style: solid;
	border-left-style: solid;
	position: absolute;
}

.post-quxian-class-2-top {
	top: 0px;
}

.post-quxian-class-3 {
	margin-left: 13px;
}

.post-quxian-class-3-top {
	top: 0px;
}

.post-quxian-class-2-bottom {
	bottom: -25px;
}
.post-quxian-class-3-bottom {
	bottom: -25px;
}

@media (min-width: 1000px) {
	div.post-quxian-class-2-bottom {
		bottom: -35px;
	}
	div.post-quxian-class-3-bottom {
		bottom: -35px;
	}
}

// .posts::deep(.ant-list-item) {
// 	padding: 0;
// }

.editor-box {
	.post-quxian-2 {
		height: 18px;
		width: 23px;
		position: absolute;
		left: -29px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
		bottom: 18px;
	}
	.post-quxian-3 {
		height: 18px;
		width: 18px;
		position: absolute;
		left: -23px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
		bottom: 20px;
	}

	.editor-trigger-section {
		//width: 54%;
		padding-top: var(--p4);
	}
	.editor-trigger-section-mobile {
		width: 100%;
	}
}
</style>
