<template>
	<a-row
		type="flex"
		align="top"
		:class="[{ 'thread-quick-reply': isThread }]"
	>
		<UserAvatar
			:scale="scale ? scale : 2"
			:profileId="$store.state.User.id"
			:nfc="$store.state.User.is_nfc"
		/>
		<div :style="replyEditorStyle" class="reply-editor">
			<div
				v-if="post.depth && !isThread && !isFirstPost"
				:class="[
					{ 'editor-quxian-1': post.depth == 1 },
					{ 'editor-quxian-2': post.depth == 2 },
					{ 'editor-quxian-3': post.depth >= 3 },
				]"
			></div>
			<Editor
				:setDefaultContent="mention"
				:set-focus="setEditorFocus"
				:submit-complete="submitComplete"
				:placeholder="editorPlaceholder"
				:max-height="maxHeight ? maxHeight : 0"
				:clear-content="clearReply"
				v-on:on-submit="onSubmit"
				v-on:close-editor="$emit('closeEditor')"
				v-on:upload-image="onUploadImage"
			/>
		</div>
	</a-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import UserAvatar from "@/components/UserAvatar.vue";
import {
	isGroupFollowed,
	StorageLocal,
	LOGIN_TYPE_PHANTOM,
	PHANTOM_KEY,
	WEB3_KEY,
	LOGIN_TYPE_LEDGER,
	LEDGER_KEY,
} from "@/helpers/Utils";
import { PostInterface } from "@/helpers/Interfaces";
import Editor from "@/components/Editor.vue";
import { message } from "ant-design-vue";

export default defineComponent({
	components: { Editor, UserAvatar },
	props: {
		post: Object as PropType<PostInterface>,
		isFirstPost: Boolean,
		isShow: Boolean,
		isThread: Boolean,
		setEditorFocus: Boolean,
		placeholder: String,
		maxHeight: Number,
		scale: Number,
		depth: Number,
	},
	data() {
		return {
			clearReply: false,
			submitComplete: false,
			editorPlaceholder: "",
			mention: "",
			replyEditorStyle: {
				order: "1",
				flex: "1 1 auto",
				padding: "0 0 0 var(--p2)",
				maxWidth: "100%",
			},
		};
	},
	created() {
		this.editorPlaceholder = this.placeholder
			? this.placeholder
			: (this.$t("share_thoughts") as string);
		if (
			this.post &&
			this.post.depth &&
			this.post.depth >= 2 &&
			this.post.user &&
			this.post.user_id != this.$store.state.User.id
		) {
			this.mention =
				'[{"insert":{"mention":{"index":"0","denotationChar":"@","id":"' +
				this.post.user_id +
				'","value":"' +
				this.post.user.name +
				'","target":"u"}}},{"insert":" \\n"}]';
		}
	},
	beforeDestroy() {
		// delete this.post;
	},
	methods: {
		onSubmit(data: FormData) {
			data.append("thread_id", this.post.thread_id + "");

			if (StorageLocal.getItem("login_type") == LOGIN_TYPE_PHANTOM + "") {
				data.append("login_type", PHANTOM_KEY + "");
			} else if (
				StorageLocal.getItem("login_type") ==
				LOGIN_TYPE_LEDGER + ""
			) {
				data.append("login_type", LEDGER_KEY + "");
			} else {
				data.append("login_type", WEB3_KEY + "");
			}

			if (!this.isFirstPost) {
				data.append("reply_id", this.post.id + "");
			}

			this.$store
				.dispatch("Post/submit", data)
				.then((data: PostInterface | any) => {
					if (data && data.id) {
						this.clearReply = true;
						data.is_new = true;
						data.online = true;
						//if user subscribe thread,change subscribe status
						if (data.is_subscribe) {
							this.$store.commit(
								"Subscribe/setSubscribe",
								data.thread_id
							);
						}
						this.onNewPost(data);

						if (
							!isGroupFollowed(
								this.$store.state.User.groups,
								this.$store.state.Group.id
							)
						) {
							this.$store
								.dispatch("Group/follow")
								.then((response: { success: number }) => {
									if (response.success) {
										this.$store.dispatch("User/getMe");
									}
								});
						}
					} else {
						if (
							data &&
							data.response &&
							data.response.data &&
							data.response.data.code == 503
						) {
							message.info(this.$t("flood_check") as string);
						} else if (
							data &&
							data.response &&
							data.response.data &&
							data.response.data.code == 401
						) {
							message.error(this.$t("ban_message") as string);
						} else if (
							data &&
							data.response &&
							data.response.data &&
							data.response.data.code == 40003
						) {
							message.error(this.$t("join_error") as string);
						} else if (
							data &&
							data.response &&
							data.response.data &&
							data.response.data.code == 403
						) {
							message.error(this.$t("no_permission") as string);
						} else if (
							data &&
							data.response &&
							data.response.data &&
							data.response.data.code == 40011
						) {
						} else {
							message.error(this.$t("network_error") as string);
						}
					}
				})
				.finally(() => {
					this.submitComplete = true;
					this.clearReply = false;
					this.$nextTick(() => {
						this.submitComplete = false;
					});
				});
		},
		onNewPost(postData: PostInterface) {
			this.$emit("new-post", postData);
		},
		onCloseEditor(): boolean {
			/**
			 * close editor if it's a post reply editor, we never close a thread reply editor
			 */
			this.$emit("close-editor", !this.isFirstPost);
		},
		onUploadImage(val: boolean) {
			if (val) {
				this.replyEditorStyle.flex = "1 1 auto";
			} else {
				this.replyEditorStyle.flex = "0 0 auto";
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.quick-reply {
	padding: var(--p5) 0 0;
	flex-wrap: nowrap;

	.reply-editor {
	}

	&.mobile {
		.reply-editor {
			max-width: 100%;
		}
	}
	.editor-quxian-1 {
		height: 18px;
		width: 23px;
		position: absolute;
		left: 19px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
		//bottom: 18px;
	}
	.editor-quxian-2 {
		height: 18px;
		width: 18px;
		position: absolute;
		left: 13px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
		//bottom: 18px;
	}
	.editor-quxian-3 {
		height: 18px;
		width: 16px;
		position: absolute;
		left: 13px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
		//bottom: 20px;
	}
}
.thread-quick-reply {
	margin-bottom: 60px;
	max-width: calc(100% - 40px);
}
</style>
