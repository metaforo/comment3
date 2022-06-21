<template>
	<a-row type="flex" justify="center" align="top" class="edit-post">
		<UserAvatar
			:scale="1"
			:profileId="post.user.id"
			:online="post.user.id"
			:nfc="post.user.is_nfc"
		/>
		<div class="post-editor" :style="replyEditorStyle">
			<Editor
				:default-post="post"
				:set-focus="setEditorFocus"
				:submit-complete="submitComplete"
				v-on:on-submit="onSubmit"
				v-on:upload-image="onUploadImage"
			/>
		</div>
	</a-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PostInterface, ThreadInterface } from "@/helpers/Interfaces";
import UserAvatar from "@/components/UserAvatar.vue";
import Editor from "@/components/Editor.vue";
import { message } from "ant-design-vue";

export default defineComponent({
	components: { Editor, UserAvatar },
	props: {
		post: Object as PropType<PostInterface>,
		setEditorFocus: { type: Boolean, default: false },
	},
	data() {
		return {
			submitComplete: false,
			replyEditorStyle: {
				order: "1",
				flex: "1 1 auto",
				padding: "0 0 0 var(--p2)",
				maxWidth: "100%",
			},
		};
	},
	methods: {
		onSubmit(data: FormData): void {
			data.append("post_id", this.post.id + "");

			this.$store
				.dispatch("Post/edit", data)
				.then(
					(
						data:
							| { post: PostInterface; thread?: ThreadInterface }
							| any
					) => {
						//code is 401 ,user be banned
						if (
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
							data.response.data.code == 403
						) {
							message.error(this.$t("no_permission") as string);
						} else {
							this.onEditPost(data.post);
						}
					}
				)
				.finally(() => {
					this.submitComplete = true;
					this.$nextTick(() => {
						this.submitComplete = false;
					});
				});
		},
		onEditPost(postData: PostInterface): PostInterface {
			this.$emit("edit-post", postData);
		},
		onUploadImage(val: boolean) {
			// console.log(val);
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
.edit-post {
	padding: var(--p6) 0 0;
	flex-wrap: unset;

	.post-editor {
		order: 1;
		flex: 1 1 auto;
		padding: 0 0 0 var(--p4);
	}
}
</style>
