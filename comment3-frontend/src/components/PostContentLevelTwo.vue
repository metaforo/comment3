<template>
	<!--    <div v-if="depth==2" style="width: 44px;height: 100%">-->

	<!--      <div style=" margin: auto; width: 2px;  height: 100%;  background-color: rgb(58, 61, 63);"></div>-->

	<!--      <div class="post-quxian-class"></div>-->

	<!--    </div>-->
	<!--    <div v-if="depth==3" style="width: 38px;height: 100%">-->
	<!--      <div class="post-quxian-class"></div>-->
	<!--    </div>-->
	<div v-if="$store.state.Post.folded.indexOf(post.id) !== -1">
		<section v-if="sortStatus" class="folded">
			<UserAvatar
				:avatar="post.user.photo_url"
				:username="post.user.name"
				:profileId="post.user.id"
				:nfc="post.user.is_nfc"
				:scale="depth == 1 ? 2 : 1"
				:is-ban="
					$store.getters['BanUser/isBan'](post.user_id, post.is_ban)
				"
				:online="post.online"
			/>
			<Username :username="post.user.name" :profileId="post.user.id" />

			<!--            <span class="thread-badge" v-if="post.badge && post.badge.length > 0">-->
			<!--                <a-tooltip placement="top"  v-for="(value, index) in post.badge" :key="index" overlayClassName="bgc_tooltip">-->
			<!--                   <template slot="title">-->
			<!--                      <div>{{ value.desc }}</div>-->
			<!--                    </template>-->
			<!--                    <img-->
			<!--                            :src="value.image_url"-->
			<!--                            style="cursor: pointer"-->
			<!--                    >-->
			<!--                </a-tooltip>-->
			<!--            </span>-->

			<Badge
				v-if="post.badge && post.badge.length > 0"
				:badge="post.badge"
			/>
			<Dot v-if="post.title" />

			<span v-if="post.title" class="title-style">
				{{ post.title }}
			</span>

			<div class="brief" v-on:click="unFold">
				<Dot />
				<TimeString :time="post.created_at" />
				<span
					v-if="
						post &&
						post.deleted != 1 &&
						post.deleted != 3 &&
						!$store.getters['User/isBlocked'](post.user_id) &&
						!$store.getters['BanUser/isBan'](
							post.user_id,
							post.is_ban
						)
					"
					class="content-short"
					>{{ contentShort }}</span
				>
			</div>
		</section>
	</div>
	<div v-else>
		<!--        <div-->
		<!--            v-if="(depth < indentDepth && post.children && post.children.length) || (showReplyStatus && ((!post.children || !post.children.length) || depth > 2))"-->
		<!--            :class="['fold-line', {'level-one': depth == 1}, {'level-three': depth > 3 && showReplyStatus}, {'mobile': isMobile}, {'fold-line-reply': showReplyStatus && (!post.children || !post.children.length)}]"-->
		<!--            :style="foldStyle"-->
		<!--            ref="fold-line-reply"-->
		<!--        ></div>-->
		<!--            v-on:click="onFold"-->
		<div class="post-block">
			<div
				:class="[{ 'post-quxian-2': depth >= 2 }]"
				:style="quxianStyle"
			></div>

			<div :id="post.id" :class="['main', { 'tier-3': depth > 2 }]">
				<div style="display: flex; flex-direction: column">
					<UserAvatar
						:avatar="post.user.photo_url"
						:username="post.user.name"
						:profileId="post.user_id"
						:nfc="post.user.is_nfc"
						:scale="depth == 1 ? 2 : 1"
						:class="[{ mobile: isMobile }]"
						:is-ban="
							$store.getters['BanUser/isBan'](
								post.user_id,
								post.is_ban
							)
						"
						:online="post.online"
					/>
					<div
						v-if="
							depth == 1 &&
							((this.post.children &&
								this.post.children.length > 0) ||
								this.showReplyStatus)
						"
						class="line-2-div"
						:style="this.lineStyle"
					>
						<div class="line-style"></div>
					</div>

					<div
						v-if="depth >= 2 && this.showReplyStatus"
						class="line-3-div"
						:style="this.lineStyle"
					>
						<div class="line-style"></div>
					</div>

					<!--                <div v-if="depth >= 3 && this.showReplyStatus"class="line-3-div"  :style="this.lineStyle">-->
					<!--                    <div class="line-style"></div>-->
					<!--                </div>-->
				</div>

				<div class="post-body" :class="[{ mobile: isMobile }]">
					<div :class="['qipao', { new: isAnchorPost }]">
						<div
							v-if="postHidden"
							class="read_more"
							v-on:click="showContent"
						>
							<span class="underline">Read More</span>
						</div>
						<div
							:class="[
								'poster-info',
								{ 'level-one': depth == 1 },
								{ mobile: isMobile },
							]"
						>
							<Username
								:username="post.user.name"
								:profileId="post.user_id"
							/>

							<Badge
								v-if="post.badge && post.badge.length > 0"
								:badge="post.badge"
							/>

							<Dot
								v-if="post.user_title && post.user_title.name"
							/>
							<Title
								v-if="post.user_title && post.user_title.name"
								:title="post.user_title"
							/>

							<Dot />
							<TimeString :time="post.created_at" />
							<Dot v-if="post.arweave" />
							<span class="ipfs">
								<IPFS
									v-if="post.arweave"
									:ipfs-hash="post.arweave"
								/>
							</span>
							<Dot v-if="post.sign" />
							<span class="sign">
								<SIGN
									v-if="post.sign"
									:sign-date="post.created_at"
									:sign-hash="post.sign"
								/>
							</span>
						</div>
						<PostContentHidden
							v-if="
								post &&
								(post.deleted == 1 ||
									post.deleted == 3 ||
									post.nsfw == 1 ||
									$store.getters['User/isBlocked'](
										post.user_id
									) ||
									$store.getters['BanUser/isBan'](
										post.user_id,
										post.is_ban
									))
							"
							:post="post"
						/>
						<ImageBlock
							v-else-if="imageContent.length"
							:images="imageContent"
						/>
						<div
							v-else
							slot="content"
							ref="content"
							:class="[
								'post-content',
								{ new: isAnchorPost, post_hidden: postHidden },
							]"
							v-html="htmlContent"
						></div>
						<AttachedFiles
							v-if="
								!(
									post.deleted == 1 ||
									post.deleted == 3 ||
									post.nsfw == 1 ||
									$store.getters['User/isBlocked'](
										post.user_id
									) ||
									$store.getters['BanUser/isBan'](
										post.user_id,
										post.is_ban
									)
								)
							"
							:attached-files="post.attached_files"
							:class="'post-attach'"
						/>
					</div>
					<div class="link-preview-block"></div>
					<PostAction
						v-if="
							post &&
							post.deleted != 1 &&
							post.deleted != 3 &&
							!$store.getters['User/isBlocked'](post.user_id) &&
							!$store.getters['BanUser/isBan'](
								post.user_id,
								post.is_ban
							)
						"
						:post="post"
						:is-first-post="false"
						:depth="depth"
						:reply-placeholder="
							$t('reply_to', { username: post.user.name })
						"
						v-on:new-post="onNewPost"
						v-on:edit-post="onEditPost"
						v-on:post-delete="onPostDelete"
						v-on:show-reply="showReply"
					/>
				</div>
			</div>
			<!--            <div :class="[{'nested': depth < indentDepth}, {'mobile': isMobile}, {'nested-2': depth > 1 && depth < 3}]">-->

			<!--            </div>-->
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import PostAction from "@/components/PostAction.vue";
import AttachedFiles from "@/components/AttachedFiles.vue";
import ImageBlock from "@/components/ImageBlock.vue";
import PostContentHidden from "@/components/PostContentHidden.vue";
import Dot from "@/components/Dot.vue";
import TimeString from "@/components/TimeString.vue";
import Title from "@/components/Title.vue";
import Badge from "@/components/Badge.vue";
import Username from "@/components/Username.vue";
import SIGN from "@/components/SIGN.vue";
import IPFS from "@/components/IPFS.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { PostInterface, DeltaOpsInterface } from "@/helpers/Interfaces";
import {
	convertQuillDeltaToHTML,
	insertCardNew,
	twitterWidget,
	hashFunc,
	windowWidth,
} from "@/helpers/Utils";

export default defineComponent({
	components: {
		UserAvatar,
		IPFS,
		SIGN,
		Username,
		Badge,
		Title,
		TimeString,
		Dot,
		PostContentHidden,
		ImageBlock,
		AttachedFiles,
		PostAction,
	},
	props: {
		post: {
			type: Object as PropType<PostInterface>,
			default: {},
		},
		depth: { type: Number, default: 0 }, // how deep the post tree nested
	},
	data() {
		return {
			contentShort: "",
			indentDepth: 3,
			isMobile: false,
			imageContent: [] as DeltaOpsInterface[],
			htmlContent: "",
			isAnchorPost: false,
			showReplyStatus: false,
			foldStyle: {},
			lineStyle: {},
			quxianStyle: {},
			postHidden: false,
			links_set: new Set(),
			content: this.$refs.content,
			// fold_line_reply: this.$refs.content,
		};
	},
	computed: {
		newPostNotification(): PostInterface {
			return this.$store.state.Post.new_post;
		},
		sortStatus(): boolean {
			return this.post.deleted != 2;
		},
	},
	watch: {
		$route: {
			handler() {
				if (
					this.$route.params &&
					this.$route.params.post_id &&
					parseInt(this.$route.params.post_id) == this.post.id
				) {
					// scroll to this post
					const postEle = document.getElementById(
						this.post.id + ""
					) as HTMLDivElement;
					if (!postEle) {
						return;
					}
					const rect = postEle.getBoundingClientRect();

					window.scrollTo(0, rect.top - 150);

					this.isAnchorPost = true;

					setTimeout(() => {
						this.isAnchorPost = false;
					}, 3000);
				}
			},
		},
	},
	beforeCreate() {
		//https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
		// Circular References Between Components
		this.$options.components!.PostTree = import(
			"@/components/PostTree.vue"
		);
	},
	created() {
		// let delta: DeltaOpsInterface[] = [];
		// try{
		//     delta = JSON.parse(this.post.content);
		// } catch(e) {
		//     console.info('illegal json:' + this.post.content);
		// }

		if (this.post.content && this.post.content.length) {
			let delta: DeltaOpsInterface[] = [];

			const urlRegex =
				/(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

			try {
				delta = JSON.parse(this.post.content);
			} catch (e) {
				console.info("illegal json:" + this.post.content);
			}
			for (let i = 0; i < delta.length; i++) {
				if (
					typeof delta[i].insert === "object" &&
					delta[i].insert.image
				) {
					this.imageContent.push(delta[i]);
				}

				if (delta[i].insert && typeof delta[i].insert === "string") {
					let string = delta[i].insert.replaceAll(/[\r\n]/gi, " ");
					let result = null;

					while ((result = urlRegex.exec(string)) !== null) {
						if (result && result.length) {
							for (let j = 0; j < result.length; j++) {
								this.links_set.add(result[j]);
							}
						}
					}
					// also search for link
					// if (delta[i].attributes && delta[i].attributes.link) {
					//     links_set.add(delta[i].attributes.link);
					// }
				}
			}

			if (this.imageContent.length == 0) {
				this.htmlContent = convertQuillDeltaToHTML(this.post.content);
			}
		}

		const text: DeltaOpsInterface[] = [];
		let totalTextLength: number = 0;

		// for (let i = 0; i < delta.length; i++) {
		// for videos and images

		// when user blocked the post, we fold it, note, in this case when don't have to generate short content
		if (
			(this.$store.state.User.id &&
				this.$store.getters["User/isBlocked"](this.post.user_id)) ||
			this.post.deleted == 2
		) {
			this.$store.commit("Post/addFolded", this.post.id);
		}
	},

	mounted() {
		let that = this;

		if (
			this.$route.params &&
			this.$route.params.post_id &&
			parseInt(this.$route.params.post_id) == this.post.id
		) {
			// scroll to this post
			const postEle = document.getElementById(
				this.post.id + ""
			) as HTMLDivElement;
			if (!postEle) {
				return;
			}
			const rect = postEle.getBoundingClientRect();

			window.scrollTo(0, rect.top - 150);

			this.isAnchorPost = true;

			setTimeout(() => {
				this.isAnchorPost = false;
			}, 3000);
		}

		if (this.links_set.size) {
			let id = "";
			const parent = (this.$refs.content as any).parentElement;
			if (!parent) {
				return;
			}

			const linkPreviewBlock = parent.nextElementSibling;

			this.links_set.forEach((url: string) => {
				try {
					if (url.indexOf("twitter.com") !== -1) {
						twitterWidget(this.content, url);
					} else {
						if (
							this.$store.getters["Group/showLinkPreview"] == true
						) {
							if (linkPreviewBlock) {
								let div = document.createElement("div");
								id =
									"t-" +
									this.post.id +
									"-" +
									hashFunc(url, true);
								div.id = id;
								div.className = "link-preview-item";
								linkPreviewBlock.appendChild(div);
							}

							const data = new FormData();

							data.append("url", url);

							this.$store
								.dispatch("Thread/linkPreview", data)
								.then((response: Response) => {
									const data: {
										title: string;
										image: string;
										description: string;
									} = response.getData();

									insertCardNew(
										this.content,
										url,
										data,
										this.post,
										true
									);
								})
								.catch((er) => {
									let lid =
										"t-" +
										this.post.id +
										"-" +
										hashFunc(url, true);
									let removeDiv =
										document.getElementById(lid);
									if (removeDiv) {
										removeDiv.remove();
									}
								});
						}
					}
				} catch (error) {
					console.log(error);
				}

				// else if (url.indexOf('facebook.com') !== -1){
				//     facebookSDK(this.content, url);
				// }
			});
		}

		var list = document.getElementsByClassName("mention_link");

		var mention_index = "";

		for (var i = 0; i < list.length; i++) {
			const mention_index = list[i].getAttribute("data-id");

			if (list[i].getAttribute("data-target") == "u") {
				list[i].addEventListener("click", function () {
					if (that.$store.state.User.id) {
						that.$store.commit("Profile/showProfile", true);
						that.$store.commit(
							"Profile/setProfileId",
							mention_index != null ? parseInt(mention_index) : 0
						);
					}
				});
			}

			if (list[i].getAttribute("data-target") == "t") {
				list[i].addEventListener("click", function () {
					window.location.href =
						import.meta.env.VITE_MAIN_DOMAIN +
						"/g/" +
						that.$route.params.group_name +
						"/thread/-" +
						mention_index;
				});
			}
		}

		let content = document.getElementById(this.post.id.toString());
		if (null != content) {
			// qipao_H = qipao_H.getElementsByClassName("qipao")[0].offsetHeight ;
			let content_e = content.getElementsByClassName("post-content")[0];
			// var link_priview_e = qipao.getElementsByClassName("link-preview-block")[0] ;
			if (null != content_e && content_e.clientHeight > 210) {
				this.postHidden = true;
			}
		}
	},

	beforeDestroy() {
		// delete this.post;
	},

	methods: {
		onFold() {
			if (this.contentShort === null) {
				let delta: DeltaOpsInterface[] = [];
				this.contentShort = "";
				try {
					delta = JSON.parse(this.post.content);
				} catch (e) {
					// catch when delta is broken
				}

				for (let i = 0; i < delta.length; i++) {
					if (
						delta[i] &&
						delta[i].insert &&
						typeof delta[i].insert === "string"
					) {
						this.contentShort = this.contentShort + delta[i].insert;

						if (this.contentShort.length > 50) {
							this.contentShort =
								this.contentShort.substring(0, 50) + "...";
							break;
						}
					}
				}
			}

			this.$store.commit("Post/addFolded", this.post.id);
		},

		unFold() {
			this.$store.commit("Post/removeFolded", this.post.id);
		},

		onOpenEditor(is_open: boolean) {
			// console.log('postaction',is_open);
			if (is_open) {
				// this.quxianStyle = {
				//     bottom: '170px',
				// };
				if (this.isMobile) {
					if (this.depth == 1) {
						this.foldStyle = {
							height: "calc(100% - 235px)",
						};
					} else {
						this.foldStyle = {
							height: "calc(100% - 225px)",
						};
					}
				} else {
					// console.log(this.depth);
					if (this.depth == 1) {
						this.foldStyle = {
							height: "calc(100% - 272px)",
						};
					} else {
						this.foldStyle = {
							height: "calc(100% - 264px)",
						};
					}
				}
			} else {
				// this.quxianStyle = {};
				this.foldStyle = {};
			}
		},

		onLoadMore() {
			this.$store.commit(
				"Attachment/addAttach",
				this.getPostAttach(
					this.$store.state.Thread.first_posts,
					this.$store.state.Thread.posts,
					[],
					true
				)
			);
			this.$store.commit(
				"Attachment/addAttachImg",
				this.getPostAttachImg(
					this.$store.state.Thread.first_posts,
					this.$store.state.Thread.posts,
					[],
					true
				)
			);
		},

		onNewPost(postData: PostInterface): void {
			if (!this.post.children) {
				this.post.children = [];
			}
			// console.log(this.$store.state.Thread.posts,2);

			this.post.children.unshift(postData);
			this.$store.commit(
				"Attachment/addAttach",
				this.getPostAttach(
					this.$store.state.Thread.first_posts,
					this.$store.state.Thread.posts,
					postData,
					true
				)
			);
			this.$store.commit(
				"Attachment/addAttachImg",
				this.getPostAttachImg(
					this.$store.state.Thread.first_posts,
					this.$store.state.Thread.posts,
					postData,
					true
				)
			);
			// console.log(this.$store.state.Attachment.attach,3);
		},

		onEditPost(postData: PostInterface): void {
			this.post.content = postData.content;
			// update html content
			this.htmlContent = convertQuillDeltaToHTML(this.post.content);

			if (postData.attached_files) {
				this.post.attached_files = postData.attached_files;
			}
			this.post.attachments = postData.attachments;
			this.$store.commit(
				"Attachment/addAttach",
				this.getPostAttach(
					this.$store.state.Thread.first_posts,
					this.$store.state.Thread.posts,
					postData,
					false
				)
			);
			// console.log(this.thread.first_post);
			this.$store.commit(
				"Attachment/addAttachImg",
				this.getPostAttachImg(
					this.$store.state.Thread.first_posts,
					this.$store.state.Thread.posts,
					postData,
					false
				)
			);
		},

		getPostAttach(
			first_post: any,
			posts: any,
			postData: any,
			add: boolean
		) {
			let attach: any[] = [];
			if (first_post && first_post.attachments) {
				attach = first_post.attachments;
			}
			for (let post in posts) {
				if (posts[post].id == postData.id) {
					if (postData.attachments) {
						attach = attach.concat(postData.attachments);
					}
				} else {
					if (posts[post].attachments) {
						attach = attach.concat(posts[post].attachments);
					}
				}
				if (posts[post].id == this.post.id) {
					attach = attach.concat(
						this.getPostAttach(
							[],
							this.post.children,
							postData,
							add
						)
					);
				} else {
					if (posts[post].children) {
						attach = attach.concat(
							this.getPostAttach(
								[],
								posts[post].children,
								postData,
								add
							)
						);
					}
				}
			}
			return attach;
		},

		getPostAttachImg(
			first_post: any,
			posts: any,
			postData: any,
			add: boolean
		) {
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
				if (posts[post].id == postData.id) {
					if (
						postData.attached_files &&
						postData.attached_files.length > 0
					) {
						for (let attachment in postData.attached_files) {
							// console.log(posts[post].attached_files,posts[post].attached_files[attachment],String(posts[post].attached_files[attachment].mime_type));
							if (
								String(
									postData.attached_files[attachment]
										.mime_type
								).match(/^image\//)
							) {
								attached_files.push(
									postData.attached_files[attachment]
								);
							}
						}
					}
				} else {
					if (
						postData.attached_files &&
						posts[post].attached_files &&
						posts[post].attached_files.length > 0
					) {
						for (let attachment in posts[post].attached_files) {
							// console.log(posts[post].attached_files,posts[post].attached_files[attachment],String(posts[post].attached_files[attachment].mime_type));
							if (
								String(
									posts[post].attached_files[attachment]
										.mime_type
								).match(/^image\//)
							) {
								attached_files.push(
									posts[post].attached_files[attachment]
								);
							}
						}
					}
				}
				if (posts[post].id == this.post.id) {
					attached_files = attached_files.concat(
						this.getPostAttachImg(
							[],
							this.post.children,
							postData,
							add
						)
					);
				} else {
					if (posts[post].children) {
						attached_files = attached_files.concat(
							this.getPostAttachImg(
								[],
								posts[post].children,
								postData,
								add
							)
						);
					}
				}
			}
			return attached_files;
		},

		onPostDelete(post: PostInterface): void {
			if (post.id === this.post.id) {
				this.post.deleted = post.deleted;
				if (this.post.deleted == 2) {
					this.$store.commit("Post/addFolded", this.post.id);
				}
				if (
					parseInt(post.deleted_by as unknown as string) !=
					post.user_id
				) {
					this.post.deleted_by = this.$store.state.User;
				}
			}
		},

		showReply(showReplyStatus: boolean) {
			this.showReplyStatus = showReplyStatus;

			if (
				null != this.post.children &&
				this.post.children.length > 0 &&
				this.depth < 2
			) {
				return;
			}
			// if(this.depth > 1) {
			var qipao = document.getElementById(this.post.id.toString());
			if (null != qipao) {
				// qipao_H = qipao_H.getElementsByClassName("qipao")[0].offsetHeight ;
				var qipao_e = qipao.getElementsByClassName("qipao")[0];
				// var link_priview_e = qipao.getElementsByClassName("link-preview-block")[0] ;
				var link_priview_ary =
					qipao.getElementsByClassName("link-preview-block");
				if (null != qipao_e) {
					var qipao_H = qipao_e.clientHeight;
					if (
						null != link_priview_ary &&
						link_priview_ary.length > 0
					) {
						qipao_H = link_priview_ary[0].clientHeight + qipao_H;
					}
					if (qipao_H > 0) {
						if (windowWidth() >= 1000 && this.depth > 1) {
							qipao_H = qipao_H + 10;
						}
						this.lineStyle = {
							height: qipao_H + "px",
						};
					}
				}
			}
			// }

			//
			// console.log(this.showReplyStatus,11111);
		},

		showContent() {
			this.postHidden = false;
		},
	},
});
</script>

<style lang="scss" scoped>
$avatar-size: $avatar-size1;
$avatar-margin-right: var(--p2);
$name-time-size: $font-size1 - 0.1;

.flex {
	display: flex;
}

.post-block {
	padding: var(--p5) 0 0;

	.line-style {
		margin: auto;
		width: 2px;
		height: 100%;
		background-color: var(--border-color7);
	}

	.line-2-div {
		width: 40px;
		height: 100%;
		margin-top: 20%;
	}

	.line-3-div {
		width: 28px;
		height: 100%;
		margin-top: 20%;
	}

	.post-quxian-class {
		height: calc(16px + var(--p5));
		margin-left: calc(50% - 3px);
		//margin-top: var(--p5);
		width: 22px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
	}

	.post-quxian-2 {
		height: 16px;
		width: 22px;
		position: absolute;
		left: -25px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
	}

	.post-quxian-3 {
		height: 15px;
		width: 18px;
		position: absolute;
		left: -19px;
		border-width: 2px;
		border-color: var(--border-color7);
		border-bottom-left-radius: 15px;
		border-bottom-style: solid;
		border-left-style: solid;
	}

	@media (min-width: 1000px) {
		div.post-quxian-2 {
			left: -29px;
		}
		div.post-quxian-3 {
			left: -23px;
		}
	}

	.main {
		display: flex;
		&.tier-3 {
			display: -webkit-box;
			display: -moz-box;
			display: -ms-flexbox;
			// display: -webkit-flex;
		}

		.avatar-div {
			flex-shrink: 0;
			margin-right: $avatar-margin-right;

			&.mobile {
				margin-right: var(--p4);
			}
		}

		.poster-info {
			padding-top: var(--p1);
			height: 32px;
			line-height: 26px;

			&.mobile {
				height: auto;
				line-height: 1.5rem;
			}

			&.level-one {
				height: 32px;
				line-height: 26px;
				padding-top: 4px;

				&.mobile {
					line-height: 1.5rem;
					height: auto;
				}
			}

			.name,
			.time-string {
				font-size: $name-time-size;
			}

			.ipfs {
				display: inline-block;
				position: relative;
				bottom: 1px;

				.dropdown-link {
					$size: 15px;
					//width: 12px;
					//height: 14.4px;
					display: flex;
				}
			}

			.sign {
				display: inline-block;
				position: relative;
				bottom: -3px;

				.dropdown-link {
					$size: 15px;
					//width: 12px;
					//height: 14.4px;
					display: flex;
				}
			}

			.dot-dot {
				color: var(--desc-color);
			}
		}

		.post-body {
			flex: 1 1 auto;
			/* it should be calc(100% - avartar-size - margin-right),
      but unless user typeing a really long word,
      the editor will spill over the right border by (avartar-size - margin-right)px
      it's fine if your typing normal text with space in it */
			max-width: calc(100% - 60px);
			&.mobile {
				padding-bottom: 10px;
			}

			.post-content {
				@include content_font;
				@include wrap_words;
				line-height: 1.4rem;
				transition: all 2s ease-in-out 1s;

				//&.new {
				//    background-color: var(--high-color);
				//}
			}

			.post-action {
				font-size: $name-time-size;
				padding: var(--p2) 0 0;

				&.mobile {
					padding: var(--p5) 0 0;
				}
			}
		}
		.qipao {
			border-radius: 16px;
			background: var(--qipao);
			padding: 14px;
			padding-top: 0;
			padding-bottom: 10px;
			display: inline-block;
			transition: all 2s ease-in-out 1s;
			&.new {
				background-color: var(--high-color);
			}
		}
	}

	.nested {
		margin-left: var(--nested-margin-left);
		&.unindent {
			margin-left: 0;
		}

		// &.mobile {
		//     margin-left: 52px;
		//     &.unindent {
		//         margin-left: 0;
		//     }
		// }
	}
	.nested-2 {
		margin-left: 38px;
	}
}

.folded {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	padding: var(--p7) 0 0;

	.avatar-div {
		flex-shrink: 0;
		margin-right: $avatar-margin-right;
	}

	.name,
	.time-string {
		font-size: $name-time-size;
	}

	.brief {
		cursor: pointer;

		&:hover {
			opacity: 0.7;
		}

		.content-short {
			margin-left: var(--p2);
			color: var(--font-color3);
			@include wrap_words;
		}
	}
}

.fold-line {
	$hover-area: 16px;
	$line-width: 2px;

	position: absolute;
	top: var(--fold-line-top);
	left: calc($avatar-size / 2) - calc(($hover-area - $line-width) / 2);
	width: $hover-area;
	height: calc(100% - 88px);
	//cursor: pointer;

	&:before {
		content: "";
		position: absolute;
		width: $line-width;
		height: 100%;
		top: 0;
		left: calc(($hover-area - $line-width) / 2);
		background-color: var(--border-color7);
		//box-shadow: 0 0 1px 0 var(--border-color1);
	}

	//&:hover:before {
	//    background-color: $border-focus;
	//}

	&.level-one {
		top: 68px;
		left: 12px;
		height: calc(100% - 98px);

		&.mobile {
			height: calc(100% - 92px);
			top: 64px;
		}
	}
	&.level-three {
		height: 66px;

		&.mobile {
			height: calc(100% - 92px);
			top: 64px;
		}
	}
}
.fold-line-reply {
	height: calc(100% - 260px);
	&.mobile {
		height: calc(100% - 252px);
	}
	&.level-one {
		top: 68px;
		left: 12px;
		height: calc(100% - 275px);

		&.mobile {
			height: calc(100% - 242px);
			top: 64px;
		}
	}
}
</style>
<style lang="scss">
// special global logic to override ant-design/quill style
.post-content {
	p {
		//margin-bottom: 0;
	}
	.ql-image {
		max-width: 100%;
		max-height: 800px;
	}
	//@include link_preview;
}
@include link_preview;

.read_more {
	color: var(--font-color1);
}
</style>

<style>
.underline {
	text-decoration: underline;
}

.qipao {
	position: relative;
}

.read_more {
	font-size: 0.95rem;
	position: absolute;
	/*font-weight: 600;*/
	top: 218px;
	z-index: 2;
	width: 70%;
	cursor: pointer;
}

.post_hidden {
	overflow: hidden;
	max-height: 200px;
	-webkit-mask-image: -webkit-linear-gradient(
		bottom,
		transparent 0%,
		rgba(0, 0, 0, 0.1) 12%,
		rgba(0, 0, 0, 0.8) 32%,
		#fff 100%
	);
}
</style>
