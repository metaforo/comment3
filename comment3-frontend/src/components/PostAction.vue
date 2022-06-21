<template>
	<!-- the following div is for login user -->
	<div
		v-if="$store.state.User.id && $store.state.User.activate"
		:class="['post-action', { mobile: isMobile }]"
	>
		<div :class="['actions', { 'first-post': isFirstPost }]">
			<div
				v-if="isFirstPost"
				:class="['item', { mobile: isMobile }]"
				v-on:click="replyThread"
			>
				<span>
					<Icons type="pinglun" />
				</span>
				<span v-if="isFirstPost" class="text">{{ $t("replys") }}</span>
			</div>
			<div
				v-else
				:class="['item', { mobile: isMobile }]"
				v-on:click="replyAction"
			>
				<span>
					<Icons type="pinglun" />
				</span>
			</div>
			<!-- when user already liked the post -->
			<div
				v-if="liked"
				:class="['item', { liked: liked }, { mobile: isMobile }]"
			>
				<span v-on:click="unlikeAction">
					<Icons type="dianzan" />
				</span>
				<span
					v-if="isFirstPost"
					v-on:click="unlikeAction"
					class="text"
					>{{ $t("liked") }}</span
				>
				<Dot v-if="totalLikes" />
				<span
					v-if="(!isFirstPost || isMobile) && totalLikes"
					v-on:click="onLikeNumClicked"
					class="num"
					>{{ totalLikes }}</span
				>
				<LikePreview
					v-if="isFirstPost && totalLikes && !isMobile"
					:likes="likes"
				/>
			</div>
			<!-- when user did not like the post yet -->
			<div v-else :class="['item', 'like', { mobile: isMobile }]">
				<span v-on:click="likeAction">
					<Icons type="dianzan" />
				</span>
				<span v-if="isFirstPost" v-on:click="likeAction" class="text">{{
					$t("like")
				}}</span>
				<Dot v-if="totalLikes > 0" />
				<span
					v-if="(!isFirstPost || isMobile) && totalLikes"
					v-on:click="onLikeNumClicked"
					class="num"
					>{{ totalLikes }}</span
				>
				<LikePreview
					v-if="isFirstPost && totalLikes && !isMobile"
					:likes="likes"
				/>
			</div>

			<div v-if="tipEnable" :class="['item', { liked: tipped }]">
				<span v-if="isFirstPost" v-on:click="tipActionFirstPost"
					><Icons type="tip"
				/></span>
				<span v-else v-on:click="tipActionPost"
					><Icons type="tip"
				/></span>

				<span
					v-if="isFirstPost && tipped"
					v-on:click="tipActionFirstPost"
					class="text"
					>Tipped</span
				>
				<span
					v-if="isFirstPost && !tipped"
					v-on:click="tipActionFirstPost"
					class="text"
					>Tip</span
				>
				<Dot v-if="totalTips" />
				<span
					v-if="(!isFirstPost || isMobile) && totalTips"
					v-on:click="onTipNumClicked"
					class="num"
					>{{ totalTips }}</span
				>
				<TipPreview
					v-if="isFirstPost && thread.tip_count && !isMobile"
					:likes="thread.tip_list"
					:likeCount="thread.tip_count"
					:post-id="thread.first_post.id"
				/>
				<EverpayComponents
					ref="EverpayComponents"
					:postId="post.id"
					:user="isFirstPost ? user : post.user"
				>
				</EverpayComponents>
			</div>

			<!-- Flag -->
			<div
				v-if="totalReport && isAdmin"
				:class="['item', 'flag', { liked: flagged }]"
				v-on:click="showFlagList"
			>
				<span>
					<Icons type="flag" />
				</span>
				<span class="text" v-if="isFirstPost">{{ $t("flag") }}</span>
				<Dot v-if="totalReport" />
				<span class="num">{{ totalReport }}</span>
			</div>

			<!-- share -->
			<div
				class="like item"
				v-if="isFirstPost && subscribeFeatureStatus && !isSubscribe"
				v-on:click="subscribeThread"
			>
				<span
					:title="$t('subscribe')"
					:class="[{ 'subscribe-icon': isFirstPost }]"
				>
					<Icons type="subscribe" />
				</span>
				<!--                <span-->
				<!--                    class="text"-->
				<!--                    v-if="isFirstPost"-->
				<!--                >{{$t('subscribe')}}</span>-->
			</div>

			<div
				:class="['like', 'item', 'liked', { mobile: isMobile }]"
				v-if="isFirstPost && subscribeFeatureStatus && isSubscribe"
				v-on:click="unsubscribeThread"
			>
				<span
					:title="$t('subscribed')"
					:class="[{ 'unsubscribe-icon': isFirstPost }]"
				>
					<Icons type="unsubscribe" />
				</span>
				<!--                <span-->
				<!--                    class="text"-->
				<!--                    v-if="isFirstPost"-->
				<!--                >{{$t('subscribed')}}</span>-->
			</div>

			<a-dropdown :trigger="['click']" v-if="shareFeatureStatus">
				<div :class="['like', 'item', { mobile: isMobile }]">
					<span
						:title="$t('share')"
						:class="[{ 'share-icon': isFirstPost }]"
					>
						<Icons type="share" />
					</span>
					<!--                    <span-->
					<!--                        class="text"-->
					<!--                        v-if="isFirstPost"-->
					<!--                    >{{$t('share')}}</span>-->
				</div>
				<a-menu slot="overlay" class="share-menu">
					<a-menu-item>
						<div class="share-div">
							<span v-if="!isMobile" class="share-with">
								{{ $t("share_with") }}：
							</span>
							<a v-on:click="onShare('facebook')"
								><img class="share-img" :src="facebookImg"
							/></a>
							<a
								class="twitter-img"
								v-on:click="onShare('twitter')"
								><img class="share-img" :src="twitterImg"
							/></a>
						</div>
					</a-menu-item>
					<a-menu-item>
						<div class="share-div share-span">
							<span v-if="!isMobile" class="share-with">
								{{ $t("link") }}：
							</span>
							<span
								class="share-link"
								:title="shareLink"
								v-text="shortShareLink"
							>
							</span>
							<span
								v-clipboard:error="onError"
								v-clipboard:copy="shareLink"
								v-clipboard:success="onCopy"
							>
								<Icons type="copy" />
							</span>
						</div>
					</a-menu-item>
				</a-menu>
			</a-dropdown>

			<a-dropdown
				v-if="showMoreButton && !hideMore"
				:trigger="['click']"
				v-on:visibleChange="menuVisibleHandler"
			>
				<a
					:class="[
						'show-more-action',
						{ 'menu-showed': showActionMenu },
					]"
				>
					<Icons type="more" />
				</a>
				<a-menu slot="overlay" class="comment-action-menu">
					<a-menu-item v-if="showEditButton">
						<!--                        v-if="showDeleteButton && editStatus && !signStatus"-->
						<div v-on:click="editAction" class="item">
							<Icons type="bianji" />
							<span class="text">{{ $t("edit") }}</span>
						</div>
					</a-menu-item>
					<a-menu-item v-if="showDeleteButton">
						<div v-on:click="showDeleteConfirm = true" class="item">
							<Icons type="shanchu" />
							<span class="text">{{ $t("delete") }}</span>
						</div>
					</a-menu-item>
					<a-menu-item
						v-if="isFirstPost && $store.state.User.super_admin"
					>
						<div v-on:click="noRecmmend" class="item">
							<Icons v-if="threadNoRecommend" type="zhengyan" />
							<Icons v-else type="biyan" />
							<span class="text">{{
								threadNoRecommend
									? $t("show_in_trending")
									: $t("hide_from_trending")
							}}</span>
						</div>
					</a-menu-item>
					<a-menu-item v-if="showFlagButton">
						<div v-on:click="flagAction" class="item">
							<Icons type="flag" />
							<span class="text">{{ $t("flag") }}</span>
						</div>
					</a-menu-item>
					<a-menu-item v-if="showUnpinButton">
						<div v-on:click="unpinThread" class="item">
							<Icons type="unpin" />
							<span class="text">{{ $t("unpin") }}</span>
						</div>
					</a-menu-item>
					<a-menu-item v-if="showPinButton">
						<div v-on:click="onPin" class="item">
							<Icons type="pin" />
							<span class="text">{{ $t("pin") }}</span>
						</div>
					</a-menu-item>
				</a-menu>
			</a-dropdown>
		</div>
		<keep-alive>
			<QuickReply
				v-if="showReply"
				:post="post"
				:is-first-post="isFirstPost"
				:clear-reply="clearReply"
				:set-editor-focus="setEditorFocus"
				:placeholder="replyPlaceholder"
				:depth="depth"
				:scale="isFirstPost ? 2 : 1"
				v-on:new-post="onNewPost"
				v-on:close-editor="onCloseReply"
			/>
		</keep-alive>
		<PostEdit
			v-if="showEdit && !isFirstPost"
			:post="post"
			:set-editor-focus="setEditorFocus"
			v-on:edit-post="onEditPost"
		/>
		<ThreadEdit
			v-if="showEdit && isFirstPost"
			:post="post"
			:is-edit="true"
			:tags="tags"
			:thread-title="threadTitle"
			:category-id="categoryId"
			v-on:edit-post="onEditPost"
			v-on:edit-thread-title="onEditThreadTitle"
			v-on:edit-thread-category="onEditThreadCategory"
			v-on:close="showEdit = false"
		/>
		<ConfirmModal
			v-if="showDeleteConfirm"
			:reverse-button="true"
			:yes-text="
				$store.state.User.super_admin
					? $t('delete_forever')
					: $t('delete')
			"
			:no-text="$t('not_now')"
			v-on:confirm="deleteAction"
			v-on:cancel="showDeleteConfirm = false"
		>
			<div class="confirm-message">{{ $t("delete_post") }}</div>
		</ConfirmModal>
		<ConfirmModal
			v-if="showDeleteAllConfirm"
			:reverse-button="true"
			:yes-text="$t('delete_all_replies')"
			:no-text="$t('No')"
			v-on:confirm="deleteAllAction"
			v-on:cancel="
				onPostDelete(deletePost) && (showDeleteAllConfirm = false)
			"
		>
			<div class="confirm-message">
				{{ $t("delete_all_replies_desc") }}
			</div>
		</ConfirmModal>
		<ConfirmModal
			v-if="showPinConfirm"
			:reverse-button="true"
			:yes-text="$t('Yes')"
			:no-text="$t('cancel')"
			v-on:confirm="pinThread"
			v-on:cancel="showPinConfirm = false"
		>
			<div class="ant-ban-image"><QuestionMark /></div>

			<div class="confirm-message">{{ $t("pin_topic") }}</div>
		</ConfirmModal>
	</div>
	<!-- the following div is for guests -->
	<div v-else :class="['post-action', { mobile: isMobile }]">
		<div :class="['actions', { 'first-post': isFirstPost }]">
			<div
				:class="['item', { mobile: isMobile }]"
				v-on:click="showLoginModal"
			>
				<Icons type="pinglun" />
				<span v-if="isFirstPost" class="text">{{ $t("replys") }}</span>
			</div>
			<div :class="['item', { mobile: isMobile }]">
				<span v-on:click="showLoginModal">
					<Icons type="dianzan" />
				</span>
				<span
					v-if="isFirstPost"
					class="text"
					v-on:click="showLoginModal"
					>{{ $tc("likes", totalLikes) }}</span
				>
				<Dot v-if="(!isFirstPost || isMobile) && totalLikes" />
				<span
					v-if="(!isFirstPost || isMobile) && totalLikes"
					v-on:click="onLikeNumClicked"
					class="num"
					>{{ totalLikes }}</span
				>
				<Dot v-if="isFirstPost && totalLikes && !isMobile" />
				<LikePreview
					v-if="isFirstPost && totalLikes && !isMobile"
					:likes="likes"
				/>
			</div>

			<div v-if="tipEnable" :class="['item', { mobile: isMobile }]">
				<span v-on:click="showLoginModal">
					<Icons type="tip" />
				</span>
				<span
					v-if="isFirstPost"
					v-on:click="showLoginModal"
					class="text"
					>Tip</span
				>
				<Dot v-if="totalTips" />
				<span
					v-if="(!isFirstPost || isMobile) && totalTips"
					v-on:click="onTipNumClicked"
					class="num"
					>{{ totalTips }}</span
				>
				<TipPreview
					v-if="isFirstPost && thread.tip_count && !isMobile"
					:likes="thread.tip_list"
					:likeCount="thread.tip_count"
					:post-id="thread.first_post.id"
				/>
			</div>

			<div
				:class="['like', 'item', { mobile: isMobile }]"
				v-if="isFirstPost && subscribeFeatureStatus"
				v-on:click="showLoginModal"
			>
				<span
					:title="$t('subscribe')"
					:class="[{ 'subscribe-icon': isFirstPost }]"
				>
					<Icons type="subscribe" />
				</span>
				<!--                <span-->
				<!--                    class="text"-->
				<!--                    v-if="isFirstPost"-->
				<!--                >{{$t('subscribe')}}</span>-->
			</div>

			<div
				v-if="totalReport && isAdmin"
				:class="['item', 'flag', { mobile: isMobile }]"
				v-on:click="showFlagList"
			>
				<span>
					<Icons type="flag" />
				</span>
				<span class="text" v-if="isFirstPost">{{ $t("flag") }}</span>
				<Dot v-if="totalReport" />
				<span class="num">{{ totalReport }}</span>
			</div>

			<a-dropdown :trigger="['click']" v-if="shareFeatureStatus">
				<div :class="['like', 'item', { mobile: isMobile }]">
					<span
						:title="$t('share')"
						:class="[{ 'share-icon': isFirstPost }]"
					>
						<Icons type="share" />
					</span>
					<!--                    <span-->
					<!--                        class="text"-->
					<!--                        v-if="isFirstPost"-->
					<!--                    >{{$t('share')}}</span>-->
				</div>
				<a-menu slot="overlay" class="share-menu">
					<a-menu-item>
						<div class="share-div">
							<span v-if="!isMobile" class="share-with">
								{{ $t("share_with") }}：
							</span>
							<a v-on:click="onShare('facebook')"
								><img class="share-img" :src="facebookImg"
							/></a>
							<a
								class="twitter-img"
								v-on:click="onShare('twitter')"
								><img class="share-img" :src="twitterImg"
							/></a>
						</div>
					</a-menu-item>
					<a-menu-item>
						<div class="share-div share-span">
							<span v-if="!isMobile" class="share-with">
								{{ $t("link") }}：
							</span>
							<span
								class="share-link"
								:title="shareLink"
								v-text="shortShareLink"
							>
							</span>
							<span
								v-clipboard:error="onError"
								v-clipboard:copy="shareLink"
								v-clipboard:success="onCopy"
							>
								<Icons type="copy" />
							</span>
						</div>
					</a-menu-item>
				</a-menu>
			</a-dropdown>
		</div>
		<div
			v-if="isFirstPost && !threadReplies"
			:class="['guest-editor', { mobile: isMobile }]"
		>
			<EditorTrigger :placeholder="$t('first_comment')" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import QuickReply from "@/components/QuickReply.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Dot from "@/components/Dot.vue";
import { RawLocation } from "vue-router";
import {
	PostInterface,
	TagInterface,
	UserInterface,
	ThreadInterface,
} from "@/helpers/Interfaces";
import {
	FlagInterface,
	LikeInterface,
	tipListInterface,
} from "@/helpers/Interfaces";
import TipPreview from "@/components/TipPreview.vue";
import LikePreview from "@/components/LikePreview.vue";
import EverpayComponents from "@/components/EverpayComponents.vue";
import PostEdit from "@/components/PostEdit.vue";
import ThreadEdit from "@/components/ThreadEdit.vue";
import QuestionMark from "@/components/QuestionMark.vue";
import EditorTrigger from "@/components/EditorTrigger.vue";
import { message } from "ant-design-vue";

export default defineComponent({
	components: {
		EditorTrigger,
		QuestionMark,
		ThreadEdit,
		PostEdit,
		EverpayComponents,
		LikePreview,
		TipPreview,
		Dot,
		ConfirmModal,
		QuickReply,
	},
	props: {
		post: Object as PropType<PostInterface>,
		isFirstPost: { type: Boolean, default: false }, // is the post of the first post in a thread, in other word, post is the thread content
		threadTitle: { type: String, default: "" },
		categoryId: { type: Number, default: 0 },
		threadLikes: { type: Number, default: 0 },
		threadReplies: { type: Number, default: 0 },
		threadNoRecommend: { type: Number, default: 0 },
		replyPlaceholder: { type: String, default: "" },
		depth: { type: Number, default: 0 },
		tags: Object as PropType<TagInterface>,
		user: Object as PropType<UserInterface>,
		thread: Object as PropType<ThreadInterface>,
		hideMore: { type: Boolean, default: false },
	},
	data() {
		return {
			totalReplies: 0,
			showReply: false,
			showEdit: false,
			deleteConfirm: false,
			clearReply: false,
			setEditorFocus: false,
			isMobile: false,
			showActionMenu: false,
			showDeleteAllConfirm: false,
			likeActionDsiabled: false,
			unlikeActionDsiabled: false,
			showDeleteConfirm: false,
			unSubscribeDisabled: false,
			subscribeDisabled: false,
			unpinDisabled: false,
			pinDisabled: false,
			showPinConfirm: false,
			facebookImg: "/img/facebook.png",
			twitterImg: "/img/twitter.png",
			deletePost: {} as PostInterface,
		};
	},
	computed: {
		likes(): LikeInterface[] {
			return this.post.likes instanceof Array ? this.post.likes : [];
		},

		tipEnable() {
			if (this.$store.state.Group.chain_type == 1) {
				return true;
			} else {
				return (
					this.$store.getters[
						"Group/getGroupSettings"
					].hasOwnProperty("everpay_enable") &&
					this.$store.getters["Group/getGroupSettings"]
						.everpay_enable == 1
				);
			}
		},

		tips(): tipListInterface[] {
			return this.thread.tip_list instanceof Array
				? this.thread.tip_list
				: [];
		},

		tipped(): boolean {
			if (this.isFirstPost) {
				if (
					undefined != this.thread &&
					undefined != this.thread.tipped &&
					this.thread.tipped
				) {
					return true;
				} else {
					return false;
				}
			} else {
				if (undefined != this.post.tipped && this.post.tipped > 0) {
					return true;
				}
				return false;
			}
		},

		editStatus(): boolean {
			if (this.isFirstPost) {
				return true;
			}
			var content = JSON.parse(this.post.content);
			if (content.length) {
				for (let i = 0; i < content.length; i++) {
					if (
						typeof content[i].insert === "object" &&
						content[i].insert.image
					) {
						return false;
					}
				}
			}
			return true;
		},

		signStatus(): boolean {
			if (this.post.sign && this.post.sign != "") {
				return true;
			} else {
				return false;
			}
		},

		liked(): boolean {
			return this.post.liked === 1;
			// for (let i = 0; i < this.post.likes.length; i++) {
			//     if (this.post.likes[i].user_id == this.$store.state.User.id
			//         && this.post.likes[i].post_id == this.post.id) {
			//         return true;
			//     }
			// }
			//
			// return false;
		},

		totalTips(): number {
			if (this.isFirstPost) {
				return this.thread.tip_count;
			} else {
				return this.post.tip_count;
			}
		},

		// total likes
		totalLikes(): number {
			return this.post.likes.length;
		},

		getCustomType(): boolean {
			return this.$store.getters.getCustomType;
		},

		cacheHref(): string {
			return localStorage.getItem("cacheHref") as string;
		},

		flags(): FlagInterface[] {
			return this.post.flags instanceof Array ? this.post.flags : [];
		},

		flagged(): boolean {
			if (this.onlineFlag) {
				return true;
			}

			for (let i = 0; i < this.post.flags.length; i++) {
				if (
					this.post.flags[i].user_id == this.$store.state.User.id &&
					this.post.flags[i].post_id == this.post.id
				) {
					return true;
				}
			}

			return false;
		},

		onPostId(): number {
			return this.$store.state.Attachment.onPostId;
		},

		onlineFlag(): boolean {
			if (
				this.$store.state.Thread.flag_post_id.indexOf(this.post.id) !==
				-1
			) {
				return true;
			} else {
				return false;
			}
		},

		threadPinStatus(): boolean {
			return this.$store.getters["ThreadPin/isPin"](
				this.post.thread_id,
				this.$store.state.Thread.is_pin
			);
		},

		adminStatus(): number {
			return this.$store.getters["GroupExtensions/getFeatureStatus"](
				"adminsAndModerators"
			);
		},

		isAdmin(): boolean {
			return (
				this.$store.getters["User/isSuperAdmin"]() ||
				this.$store.getters["User/isGroupAdmin"](
					this.$store.state.Group,
					1,
					this.adminStatus
				) ||
				this.$store.getters["User/isGroupAdmin"](
					this.$store.state.Group,
					2,
					this.adminStatus
				) ||
				this.$store.getters["User/isGroupAdmin"](
					this.$store.state.Group,
					3,
					this.adminStatus
				)
			);
		},

		isGroupOwner(): boolean {
			return this.$store.state.Group.owner == this.$store.state.User.id;
		},

		isSuperAdm(): boolean {
			return !!this.$store.state.User.super_admin;
		},

		isGroupAdm(): boolean {
			return this.$store.getters["User/isGroupAdm"](
				this.$store.state.Group
			);
		},

		isGroupMod(): boolean {
			return this.$store.getters["User/isGroupMod"](
				this.$store.state.Group
			);
		},

		isPostOwner(): boolean {
			return this.post && this.post.user_id == this.$store.state.User.id;
		},

		isFollowingGroup(): boolean {
			return this.$store.getters["User/isFollow"](
				this.$store.state.Group.id
			);
		},

		// total flags
		totalReport(): number | undefined {
			if (this.onlineFlag) {
				return this.post.total_report ? this.post.total_report + 1 : 1;
			} else {
				return this.post.total_report;
			}
		},

		subscribeFeatureStatus(): number {
			return this.$store.getters["GroupExtensions/getFeatureStatus"](
				"subscription"
			);
		},

		shareFeatureStatus(): number {
			return this.$store.getters["GroupExtensions/getFeatureStatus"](
				"share_externally"
			);
		},

		//check user subscribe thread
		isSubscribe(): boolean | undefined {
			return (
				this.$store.getters["Subscribe/isSubscribe"](
					this.post.thread_id,
					this.post.is_subscribe
				) &&
				this.$store.getters["User/isFollow"](this.$store.state.Group.id)
			);
		},

		//Used to control show more buttons
		// get showMoreButton(): boolean | undefined | number {
		//     return this.isAdmin || this.isPostOwner || (!this.flagged && this.isFollowingGroup);
		// }

		showEditButton(): boolean {
			return this.signStatus
				? this.isPostOwner && this.editStatus
				: this.showDeleteButton && this.editStatus;
		},

		//Used to control show delete buttons
		showDeleteButton(): boolean {
			// check mod permission,
			// mod can only delete member, admin can delete mod and member
			return (
				this.isPostOwner ||
				this.isGroupOwner ||
				this.isSuperAdm ||
				this.isGroupAdm ||
				(this.isGroupMod &&
					this.$store.state.Group.owner != this.post.user_id &&
					this.post.user_group_level != 1 &&
					this.post.user_group_level != 2 &&
					this.post.user_group_level != 3)
			);
		},

		//Used to control show flag buttons
		showFlagButton(): boolean {
			return (
				!this.flagged &&
				this.isFollowingGroup &&
				!this.isPostOwner &&
				!this.isGroupOwner &&
				!this.isSuperAdm &&
				!this.isGroupAdm &&
				!this.isGroupMod
			);
		},

		showPinButton(): boolean {
			return (
				this.isFirstPost &&
				(this.isGroupOwner ||
					this.isSuperAdm ||
					this.isGroupAdm ||
					this.isGroupMod) &&
				!this.threadPinStatus
			);
		},

		showUnpinButton(): boolean {
			return (
				this.isFirstPost &&
				(this.isGroupOwner ||
					this.isSuperAdm ||
					this.isGroupAdm ||
					this.isGroupMod) &&
				this.threadPinStatus
			);
		},

		//Used to control show more buttons
		showMoreButton(): boolean | undefined | number {
			return (
				this.isPostOwner ||
				this.showFlagButton ||
				this.showDeleteButton ||
				this.showEditButton ||
				this.showPinButton ||
				this.showUnpinButton
			);
		},

		//share link
		shareLink(): string {
			var shareThreadLink =
				import.meta.env.VITE_MAIN_DOMAIN +
				"/landing?method=share&group_name=" +
				this.$route.params.group_name +
				"&thread=" +
				this.$route.params.thread_slug;
			if (this.getCustomType) {
				shareThreadLink =
					this.cacheHref +
					"/landing?method=share&thread=" +
					this.$route.params.thread_slug;
			}
			shareThreadLink = this.userId
				? shareThreadLink + "&refer_id=" + this.userId
				: shareThreadLink;
			//if firt post,return thread link,if comment post,return post link
			// return this.isFirstPost ? shareThreadLink : shareThreadLink + "/" + SORT_BY_GROUP[1] + "/1/" + this.post.id;
			return this.isFirstPost
				? shareThreadLink
				: shareThreadLink + "&post=" + this.post.id;
		},

		//Shorten the link
		shortShareLink(): string {
			if (this.shareLink.length > 20) {
				return (
					this.shareLink.substring(0, 25) +
					"..." +
					this.shareLink.substring(
						this.shareLink.length - 7,
						this.shareLink.length
					)
				);
			}
			return this.shareLink;
		},
		userId(): number {
			return this.$store.state.User.id;
		},
	},
	created() {
		// set total replies, and total likes
		if (this.isFirstPost) {
			if (this.threadReplies) {
				this.totalReplies = this.threadReplies;
			}
		} else if (this.post && this.post.children) {
			this.totalReplies = this.post.children.length;
		}

		// if it's the first post, always show reply box
		if (this.isFirstPost) {
			if (!this.threadReplies) {
				this.showReply = true;
			} else {
				this.showReply = false;
			}
			//if first post and unsubscribe,unsubscribe this thread
			if (this.$route.params.unsubscribe === "unsubscribe") {
				if (this.$store.state.User.id) {
					if (
						this.$route.params.user_id == this.$store.state.User.id
					) {
						this.unsubscribeThread(true);
					} else {
						message.info(
							this.$t("unsubscribe_user_error") as string
						);
					}
				} else {
					this.showLoginModal();
				}
			}
		}
	},
	beforeDestroy(): void {
		// delete this.post;
		// delete this.threadTitle;
	},
	watch: {
		userId: {
			handler() {
				if (
					this.$route.params.unsubscribe === "unsubscribe" &&
					this.$store.state.User.id &&
					this.$route.params.user_id == this.$store.state.User.id
				) {
					this.unsubscribeThread(true);
				}
			},
		},
		onPostId: {
			handler() {
				if (this.onPostId > 0 && this.post.id == this.onPostId) {
					// this.replyAction();
					this.imageReplyAction();
					this.$store.commit("Attachment/setOnPostId", 0);
				}
			},
		},
		threadReplies: {
			handler() {
				if (this.isFirstPost) {
					if (!this.threadReplies) {
						this.showReply = true;
					} else {
						this.showReply = false;
					}
				}
			},
		},
		showReply: {
			handler() {
				this.$emit("show-reply", this.showReply);
			},
		},
	},
	methods: {
		menuVisibleHandler(visible: boolean) {
			this.showActionMenu = visible;
		},
		onCopy(): void {
			message.info(this.$t("link_copy") as string);
		},
		onError(): void {
			message.error(this.$t("link_copy_error") as string);
		},
		onShare(type: string): void {
			var url: string = this.shareLink;
			var text = this.$store.state.Thread.title;

			var left = (window.innerWidth - 550) / 2;
			if (left < 0) {
				left = 0;
			}
			var top = (window.innerHeight - 450) / 2;
			if (top < 0) {
				top = 0;
			}
			var popup_style =
				"left=" +
				left +
				",top=" +
				top +
				",width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0";

			if (type == "facebook") {
				window.open(
					"//www.facebook.com/sharer/sharer.php?u=" +
						encodeURIComponent(url) +
						"&text=" +
						encodeURIComponent(text),
					"",
					popup_style
				);
			} else if (type == "twitter") {
				window.open(
					"//twitter.com/share?url=" +
						encodeURIComponent(url) +
						"&text=" +
						encodeURIComponent(text),
					"",
					popup_style
				);
			}
		},
		onPin() {
			this.$store
				.dispatch("ThreadPin/pinStatus", {
					thread_id: this.post.thread_id,
				})
				.then((response: any) => {
					if (
						response &&
						response.response &&
						response.response.data &&
						response.response.data.data
					) {
						if (
							response.response.data.data.status === "0" ||
							this.$store.state.User.super_admin
						) {
							this.pinThread();
						} else {
							this.showPinConfirm = true;
						}
					}
				});
		},
		replyAction() {
			if (this.isFirstPost) {
				// this.showEdit = false;
				// this.showReply = !this.showReply;
				// this.setEditorFocus = !this.setEditorFocus;
				this.replyThread();
			} else {
				this.showEdit = false;
				this.showReply = !this.showReply;
				this.setEditorFocus = false;
				if (this.showReply) {
					this.setEditorFocus = true;
				}
			}
			return this.showReply;
		},
		imageReplyAction() {
			if (this.isFirstPost) {
				// this.showEdit = false;
				// this.showReply = !this.showReply;
				// this.setEditorFocus = !this.setEditorFocus;
				this.replyThread();
			} else {
				this.showEdit = false;
				this.showReply = true;
				this.setEditorFocus = true;
			}
			return this.showReply;
		},
		replyThread() {
			// if (this.isFirstPost) {
			//     this.showEdit = false;
			//     this.showReply = !this.showReply;
			//     this.setEditorFocus = !this.setEditorFocus;
			// }else{
			this.showEdit = false;
			this.showEditor();
			// }
		},
		onNewPost(postData: PostInterface) {
			if (this.isFirstPost) {
				this.clearReply = true;
				// the child component listening on the change, so we must reset it
				this.$nextTick(() => {
					this.clearReply = false;
					this.showReply = false;
				});
			} else {
				this.clearReply = true;
				// the child component listening on the change, so we must reset it
				this.$nextTick(() => {
					this.clearReply = false;
					this.showReply = false;
				});
			}
			this.$emit("new-post", postData);
		},
		likeAction() {
			if (
				this.liked ||
				!this.post ||
				!this.post.id ||
				this.likeActionDsiabled
			) {
				return;
			}

			this.likeActionDsiabled = true;

			const data = new FormData();

			data.append("post_id", this.post.id + "");

			this.$store
				.dispatch("Post/like", data)
				.then((data: LikeInterface | any) => {
					if (
						data &&
						data.response &&
						data.response.data &&
						data.response.data.code == 401
					) {
						this.likeActionDsiabled = false;
						message.error(this.$t("ban_message") as string);
					} else if (
						data &&
						data.response &&
						data.response.data &&
						data.response.data.code == 40003
					) {
						this.likeActionDsiabled = false;
						message.error(this.$t("join_error") as string);
					} else if (
						data &&
						data.response &&
						data.response.data &&
						data.response.data.code == 40011
					) {
						this.likeActionDsiabled = false;
					} else {
						//if user subscribe thread,change subscribe status
						if (data.is_subscribe) {
							this.$store.commit(
								"Subscribe/setSubscribe",
								this.post.thread_id
							);
						}
						this.post.liked = 1;
						this.unlikeActionDsiabled = false;
						this.$store.commit(
							"User/addGroup",
							this.$store.state.Group
						);
						this.post.likes.unshift({
							post_id: this.post.id,
							user_id: this.$store.state.User.id,
							is_ban: 0,
						});
					}
					// after unlike, user can like again
				});
		},
		unlikeAction() {
			if (
				!this.liked ||
				!this.post ||
				!this.post.id ||
				this.unlikeActionDsiabled
			) {
				return;
			}

			this.unlikeActionDsiabled = true;

			const data = new FormData();

			data.append("post_id", this.post.id + "");

			this.$store
				.dispatch("Post/unlike", data)
				.then((data: LikeInterface | any) => {
					if (
						data &&
						data.response &&
						data.response.data &&
						data.response.data.code == 401
					) {
						//code 401 is user be banned
						this.unlikeActionDsiabled = false;
						message.error(this.$t("ban_message") as string);
					} else if (
						data &&
						data.response &&
						data.response.data &&
						data.response.data.code == 40011
					) {
						//code 401 is user be banned
						this.unlikeActionDsiabled = false;
					} else {
						// after unlike, user can like again
						this.likeActionDsiabled = false;
						// remove like from list
						this.post.liked = 0;
						for (let i in this.post.likes) {
							if (
								this.post.likes[i].user_id ==
								this.$store.state.User.id
							) {
								this.post.likes.splice(parseInt(i), 1);
							}
						}
					}
				});
		},

		tipActionPost() {
			if (this.$store.state.User.id == this.post.user_id) {
				message.error(this.$t("tip_self_error") as string);
				return;
			}

			var modal = (this.$refs as any).EverpayComponents;
			modal.tipPost(this.post);
		},

		tipActionFirstPost() {
			if (this.$store.state.User.id == this.post.user_id) {
				message.error(this.$t("tip_self_error") as string);
				return;
			}
			var modal = (this.$refs as any).EverpayComponents;
			modal.tipFirstPost(this.thread);
		},

		subscribeThread() {
			if (!this.subscribeDisabled) {
				this.subscribeDisabled = true;
				this.$store
					.dispatch("Subscribe/subscribeThread", {
						thread_id: this.post.thread_id,
					})
					.then((response: any) => {
						if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.data &&
							response.response.data.data.success
						) {
							this.$store.commit(
								"Subscribe/setSubscribe",
								this.post.thread_id
							);
							this.$store.dispatch("User/getMe");
							this.$store.dispatch("Group/getStat");
							this.unSubscribeDisabled = false;
							message.info(this.$t("subscription_on") as string);
						} else if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.code == 401
						) {
							this.subscribeDisabled = false;
							message.error(this.$t("ban_message") as string);
						} else if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.code == 40003
						) {
							this.subscribeDisabled = false;
							message.error(this.$t("join_error") as string);
						}
					})
					.catch(() => {
						this.unSubscribeDisabled = false;
						//error
					});
			}
		},

		unsubscribeThread(flag = false) {
			if (!this.unSubscribeDisabled) {
				this.unSubscribeDisabled = true;
				this.$store
					.dispatch("Subscribe/unsubscribeThread", {
						thread_id: this.post.thread_id,
						user_id:
							flag && this.$route.params.user_id
								? this.$route.params.user_id
								: 0,
					})
					.then((response: any) => {
						if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.data &&
							response.response.data.data.success
						) {
							this.subscribeDisabled = false;
							this.$store.commit(
								"Subscribe/setUnSubscribe",
								this.post.thread_id
							);
							if (flag && this.$route.params.user_id) {
								message.info(
									this.$t("unsubscribe_message") as string,
									20
								);
							} else {
								message.info(
									this.$t("subscription_off") as string
								);
							}
						}
					})
					.catch(() => {
						this.subscribeDisabled = false;
						//error
					});
			}
		},

		unpinThread() {
			if (!this.unpinDisabled) {
				this.unpinDisabled = true;
				this.$store
					.dispatch("ThreadPin/unpin", {
						thread_id: this.post.thread_id,
					})
					.then((response: any) => {
						if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.data &&
							response.response.data.data.success
						) {
							this.pinDisabled = false;
							this.$store.commit(
								"ThreadPin/setUnpin",
								this.post.thread_id
							);
							message.success(this.$t("unpin_success") as string);
						} else if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.code &&
							response.response.data.code == 403
						) {
							this.unpinDisabled = false;
							message.error(this.$t("no_permission") as string);
						}
					})
					.catch(() => {
						this.unpinDisabled = false;
						//error
					});
			}
		},

		pinThread() {
			if (!this.pinDisabled) {
				this.pinDisabled = true;
				this.$store
					.dispatch("ThreadPin/pin", {
						thread_id: this.post.thread_id,
					})
					.then((response: any) => {
						if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.data &&
							response.response.data.data.success
						) {
							this.unpinDisabled = false;
							this.$store.commit(
								"ThreadPin/setPin",
								this.post.thread_id
							);
							this.$store.commit(
								"ThreadPin/setPinUser",
								this.$store.state.User.name
							);
							this.showPinConfirm = false;
							message.success(this.$t("pin_success") as string);
						} else if (
							response &&
							response.response &&
							response.response.data &&
							response.response.data.code &&
							response.response.data.code == 403
						) {
							this.pinDisabled = false;
							message.error(this.$t("no_permission") as string);
						}
					})
					.catch(() => {
						this.pinDisabled = false;
						//error
					});
			}
		},

		editAction() {
			if (!this.isFirstPost) {
				this.showReply = false;
			}

			this.showEdit = !this.showEdit;
			this.setEditorFocus = true;
			this.$nextTick(() => {
				this.setEditorFocus = false;
			});
		},

		flagAction() {
			this.$store.commit("Flag/setFlagPostId", this.post.id);
		},

		showFlagList() {
			this.$store.commit("Flag/setFlagPostListId", this.post.id);
		},

		onEditPost(postData: PostInterface) {
			this.showEdit = false;
			this.$emit("edit-post", postData);
		},

		onEditThreadTitle(title: string) {
			this.showEdit = false;
			this.$emit("edit-thread-title", title);
		},

		onEditThreadCategory(category_index_id: number) {
			this.showEdit = false;
			this.$emit("edit-thread-category", category_index_id);
		},

		deleteAction(): void {
			if (!this.post || !this.post.id) {
				return;
			}

			const data = new FormData();

			data.append("post_id", this.post.id + "");

			this.$store
				.dispatch("Post/delete", data)
				.then((postData: PostInterface | any) => {
					if (
						postData &&
						postData.response &&
						postData.response.data &&
						postData.response.data.code == 401
					) {
						message.error(this.$t("ban_message") as string);
						this.showDeleteConfirm = false;
					} else if (
						postData &&
						postData.response &&
						postData.response.data &&
						postData.response.data.code == 403
					) {
						message.error(this.$t("no_permission") as string);
						this.showDeleteConfirm = false;
					} else {
						this.showDeleteConfirm = false;
						if (
							postData &&
							(postData.deleted == 1 ||
								postData.deleted == 2 ||
								postData.deleted == 3)
						) {
							if (this.isFirstPost) {
								var threadList: any = [];
								var oldThreadList =
									this.$store.state.ThreadList.threadList;
								for (
									let index = 0;
									index < oldThreadList.length;
									index++
								) {
									if (
										oldThreadList[index].id !==
										postData.thread_id
									) {
										threadList = threadList.concat(
											oldThreadList[index]
										);
									}
								}
								this.$store.commit(
									"ThreadList/setThreadList",
									threadList
								);
								this.$router.push({
									name: "group",
									params: {
										group_name:
											this.$route.params.group_name,
									},
								} as unknown as RawLocation);
							} else {
								if (
									(this.isGroupOwner ||
										this.isSuperAdm ||
										this.isGroupAdm) &&
									this.post &&
									this.post.children &&
									this.post.children?.length > 0
								) {
									this.showDeleteAllConfirm = true;
									this.deletePost = postData;
								} else {
									this.onPostDelete(postData);
								}
							}
						}
					}
				});
		},

		deleteAllAction(): void {
			const data = new FormData();
			data.append("post_id", this.post.id + "");
			this.$store
				.dispatch("Post/deleteAll", data)
				.then((postData: PostInterface | any) => {
					if (
						postData &&
						postData.response &&
						postData.response.data &&
						postData.response.data.code == 403
					) {
						message.error(this.$t("no_permission") as string);
						this.showDeleteAllConfirm = false;
						this.onPostDelete(this.deletePost);
					} else {
						if (
							postData &&
							(postData.deleted == 1 ||
								postData.deleted == 2 ||
								postData.deleted == 3)
						) {
							location.reload(true);
						}
					}
				});
		},

		onPostDelete(post: PostInterface) {
			this.$emit("post-delete", post);
		},

		showLoginModal() {
			this.$store.commit("setShowLoginModal", 1);
		},

		onCloseReply(val: boolean): void {
			/**
			 * close editor if it's a post reply editor, we never close a thread reply editor
			 */
			if (val) {
				this.showReply = false;
			}
		},

		onLikeNumClicked() {
			this.$store.commit("Like/setLikeListPostId", this.post.id);
			this.$store.commit("Like/setActionTag", "like");
		},

		onTipNumClicked() {
			this.$store.commit("Like/setLikeListPostId", this.post.id);
			this.$store.commit("Like/setActionTag", "tip");
		},

		noRecmmend() {
			const data = new FormData();

			data.append("thread_id", this.post.thread_id + "");

			this.$store.dispatch("Thread/trending", data).then((response) => {
				if (response) {
					this.switchRecommend();
				}
			});
		},

		switchRecommend(): number {
			this.$emit("swicth-recommend", this.threadNoRecommend ? 0 : 1);
		},

		showEditor() {
			this.$emit("show-edit");
		},
	},
});
</script>

<style lang="scss" scoped>
.post-action {
	font-size: $font-size1;
	padding: var(--p4) 0;

	.show-more-action {
		width: 15px;
		height: 15px;
		display: block;

		&.menu-showed {
			display: block;
		}

		.ico {
			color: var(--font-color6);
		}
	}

	&.mobile {
		.actions {
			.item {
				padding: 0 20px 0 0;
			}
		}
	}

	.actions {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		&.first-post {
			.item {
				margin: 0 var(--p8) 0 0;

				&.mobile {
					padding: 0 var(--p4) 0 0;
					margin: 0;
					width: auto;
					.text {
						font-size: $font-size1;
					}

					.ico {
						font-size: $font-size0;
					}
				}

				.ico {
					font-size: $font-size4;
					margin-right: var(--p2);
				}

				.text {
					margin-top: 0.2rem;
					font-size: $font-size2;
				}

				.num {
					font-size: $font-size2;
				}
			}

			.show-more-action {
				.ico {
					font-size: $font-size4;
					width: $font-size4;
					height: $font-size4;
				}
			}
		}

		.item {
			@include button_font;
			margin: 0 var(--p8) 0 0;
			font-size: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;

			// &.mobile {
			//     padding: 0 var(--p10) 0 0;
			// }

			.ico {
				font-size: 0.9rem;
				color: var(--font-color6);
				vertical-align: middle;
			}

			.num {
				font-size: 0.9rem;
				// margin-top:2px;
				// vertical-align: 0.11rem;
				color: var(--font-color6);
			}

			.text {
				color: var(--font-color6);
				font-weight: 500;
				font-size: 0.9rem;
			}

			&:hover {
				.ico,
				.text {
					color: var(--font-color1);
				}
			}

			&.liked {
				.num,
				.text,
				.ico {
					color: var(--theme-color);
				}
			}

			.cancel,
			.confirm {
				font-weight: $title-weight;
				font-size: 1rem;

				&:last-child {
					margin-left: var(--p4);
				}
			}

			.cancel {
				color: var(--theme-color);
			}

			.confirm {
				color: $error-color;
			}
		}
	}

	.guest-editor {
		margin-top: var(--p6);

		&.mobile {
			margin-top: 24px;
		}
	}
}
.share-div {
	height: 25px;
	width: 430px;
	margin-top: 10px;
}

.share-with {
	font-size: $font-size2;
	text-align: right;
	display: inline-block;
	width: 100px;
	color: #8c97ad;
}

.share-link {
	font-size: $font-size2;
	margin-right: 15px;
}

.twitter-img {
	margin-left: 20px;
}

.share-img {
	height: 20px;
	margin-bottom: 5px;
}

// more action dropdown
.comment-action-menu {
	.item {
		display: flex;
		align-items: center;

		.ico {
			margin-right: var(--p3);
		}

		.text {
			display: inline-block;
			&::first-letter {
				text-transform: uppercase;
			}
		}
	}
}
.share-menu {
	.ant-dropdown-menu-item:hover {
		background-color: var(--navbar-bg);
	}
}
.question-mark {
	margin: 0 auto;
}

.ant-ban-image {
	text-align: center;
}
</style>
