<template>
	<a-layout class="main-layout wide">
		<a-layout-content v-if="show404">
			<div class="category-empty">
				<img src="/img/no-data.png" alt="" />
				<p>{{ $t("topic_empty") }}</p>
			</div>
		</a-layout-content>
		<a-layout-content
			v-else-if="postShowStatus"
			class="main-content no-left"
			:style="{ minHeight: minHeight }"
		>
			<a-back-top />
			<Breadcrumb :category-id="threadCategoryId" />
			<ThreadContent v-if="thread && thread.id" :thread="thread" />
			<a-skeleton v-else active avatar :paragraph="{ rows: 3 }" />
			<section
				v-if="thread && thread.first_post && !thread.first_post.deleted"
				class="action-and-info"
			>
				<PostAction
					:hide-more="
						thread.snapshot_id ||
						thread.gallery_id > 0 ||
						thread.is_gallery
					"
					:tags="thread.tags"
					:post="thread.first_post"
					:user="thread.user"
					:thread-likes="thread.likes_count"
					:thread-replies="thread.posts_count"
					:isFirstPost="true"
					:thread-title="thread.title"
					:thread-no-recommend="thread.no_recommend"
					:thread="thread"
					:category-id="thread.category_index_id"
					:reply-placeholder="
						thread.posts && thread.posts.length
							? $t('share_thoughts')
							: $t('first_comment')
					"
					v-on:new-post="onNewPost"
					v-on:edit-post="onEditPost"
					v-on:edit-thread-title="onEditThreadTitle"
					v-on:edit-thread-category="onEditThreadCategory"
					v-on:post-delete="onPostDelete"
					v-on:swicth-recommend="onSwicthRecommend"
					v-on:show-edit="onShowEdit"
				/>
			</section>
			<section
				:class="[
					'post-list',
					{ 'loading-post': !thread || !thread.id },
				]"
			>
				<div class="page-title" v-if="thread && thread.posts_count">
					<PostInfo
						:posts-count="thread.posts_count"
						:likes-count="thread.likes_count"
						:is-first-post="true"
					/>
					<Sort
						v-if="userId"
						:selected-sort="threadSort"
						:sort-by-data="sortByData"
						:sort-by-type="1"
						v-on:sort-change="onSortChange"
					/>
				</div>
				<div
					v-if="enableLoadBefore"
					class="load-before"
					v-on:click="loadBefore"
				>
					<a>{{ $t("load_before") }}</a>
				</div>
				<a-skeleton
					active
					avatar
					:paragraph="{ rows: 1 }"
					:loading="loadingBefore || !thread || !thread.id"
				/>
				<PostTree
					v-if="thread && thread.posts"
					:posts="thread.posts"
					:depth="1"
				/>
				<div
					v-if="!disableLoadAfter && morePostCount > 0"
					class="load-before"
					v-on:click="onScrollReachBottom"
				>
					<a>{{ $tc("load_more", morePostCount) }}</a>
				</div>
				<a-skeleton
					active
					avatar
					:paragraph="{ rows: 1 }"
					:loading="loadingAfter || !thread || !thread.id"
				/>
				<NoMoreData
					v-if="
						noMoreData &&
						thread &&
						thread.posts &&
						thread.posts.length &&
						thread.posts.length > pageLength
					"
					:is-thread="true"
				/>
				<QuickReply
					v-if="
						$store.state.User.id &&
						loadedPage.length &&
						thread.posts &&
						thread.posts.length > 0
					"
					:clear-reply="clearTailReply"
					:is-thread="true"
					:scale="2"
					:post="thread.first_post"
					:set-editor-focus="setEditorFocus"
					:is-first-post="true"
					:placeholder="$t('write_reply')"
					v-on:new-post="onNewTailPost"
				/>
				<EditorTrigger
					v-if="
						!$store.state.User.id &&
						thread &&
						thread.posts &&
						thread.posts.length
					"
					:trigger-func="
						() => {
							$store.commit('setShowLoginModal', 1);
						}
					"
					:placeholder="$t('write_reply')"
				/>

				<div
					v-if="
						!loadingAfter &&
						noMoreData &&
						thread &&
						!thread.posts.length
					"
					class="category-empty"
				>
					<img src="/img/no-data.png" alt="" />
					<p>{{ $t("post_empty") }}</p>
				</div>
			</section>
		</a-layout-content>
		<a-layout-content
			v-else
			class="request-join"
			:style="{ marginTop: contentHeight }"
		>
			<div class="request-join-icon">
				<Icons type="shuangren" />
			</div>

			<div class="request-join-test">
				{{ $t("this_group_is_closed_to_public") }}
			</div>
		</a-layout-content>
		<ThreadSider
			v-if="isFollow == false && !$store.state.User.super_admin"
		/>
		<FlagPost v-if="showFlagPost" />
		<FlagPostListModal v-if="showFlagPostList" />
		<LikeListModal v-if="showLikeListModal" />
		<BlockUserModal v-if="showBlockUserModal" />
		<JoinRequest
			v-if="showJoinFlag"
			v-on:close-invite-member="showJoinFlag = false"
		/>
	</a-layout>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { Response } from "@/http/Response";
import { RawLocation, Route } from "vue-router";
import {
	NAV_BAR_HEIGHT,
	SORT_BY_GROUP,
	SORT_BY_THREAD,
	bindEvent,
	removeEvent,
	StorageLocal,
	windowHeight,
} from "@/helpers/Utils";
import {
	LikeInterface,
	PostInterface,
	ThreadInterface,
} from "@/helpers/Interfaces";
import BlockUserModal from "@/components/BlockUserModal.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import EditorTrigger from "@/components/EditorTrigger.vue";
import FlagPostListModal from "@/components/FlagPostListModal.vue";
import FlagPost from "@/components/FlagPost.vue";
import JoinRequest from "@/components/JoinRequest.vue";
import LikeListModal from "@/components/LikeListModal.vue";
import NoMoreData from "@/components/NoMoreData.vue";
import PostAction from "@/components/PostAction.vue";
import PostInfo from "@/components/PostInfo.vue";
import PostTree from "@/components/PostTree.vue";
import QuickReply from "@/components/QuickReply.vue";
import Sort from "@/components/Sort.vue";
import ThreadSider from "@/components/ThreadSider.vue";
import ThreadContent from "@/components/ThreadContent.vue";
import { message } from "ant-design-vue";

export default defineComponent({
	components: {
		EditorTrigger,
		PostTree,
		PostAction,
		ThreadContent,
		ThreadSider,
		Sort,
		PostInfo,
		Breadcrumb,
		QuickReply,
		NoMoreData,
		FlagPost,
		FlagPostListModal,
		LikeListModal,
		BlockUserModal,
		JoinRequest,
	},

	data() {
		return {
			thread: {},
			enableLoadBefore: false,
			loadingBefore: false,
			enableLoadAfter: false,
			loadingAfter: false,
			disableLoadAfter: true,
			noMoreData: false,
			show404: false,
			previousThreadId: -1000,
			firstPageSize: 0,
			postShowStatus: true,
			showJoinFlag: false,
			setEditorFocus: false,
			threadSort: this.userId ? SORT_BY_GROUP[0] : SORT_BY_GROUP[1],
			contentHeight: (windowHeight() - NAV_BAR_HEIGHT - 230) / 2 + "px",
			minHeight: windowHeight() - NAV_BAR_HEIGHT + "px",
			page: 1,
			morePostCount: 0,
			snapshot: null,
			clearTailReply: false,
			pageLength: 10,
		};
	},
	watch: {
		userId: {
			handler() {
				if (
					this.$store.getters["GroupExtensions/getFeatureStatus"](
						"GroupLevelPermission"
					) &&
					this.groupVisibility == 3
				) {
					location.reload();
				}
			},
		},
		newPostNotification: {
			handler(postData: PostInterface) {
				// dynamically add new post to post tree, when parent_id = -1
				if (
					postData &&
					postData.thread_id == this.thread.id && // todo add group_id
					postData.id &&
					postData.parent_id === -1
				) {
					this.onNewPost(postData);

					this.$nextTick(() => {
						this.$store.commit("Post/clearNewPost");
					});
				}
			},
		},
		$route: {
			handler() {
				// console.log('thread',this.$route.name);
				if (this.$route.name != "thread") {
					return;
				}
				// we click on user profile post, there is a bug we can't just close profile before redirecting
				this.$store.commit("Profile/showProfile", false);
				if (this.userId) {
					var threadsSort = StorageLocal.getItem(
						"threadSort:" + this.$store.state.Group.id
					) as string;
					if (threadsSort) {
						this.threadSort = threadsSort;
					}
				}
				// if the same thread, same sort loaded the same page, we don't load it again
				// if (this.sortBy === this.previousSort && this.loadedPage.indexOf(this.page) !== -1
				//     && this.previousThreadId == this.threadId) {
				//     this.loadingAfter = false;
				//     return;
				// }
				// // already loaded something
				//  else {
				//     // when there is no page loaded yet
				//     // in this case, impossible to have load before
				//     if (this.loadingAfter) {
				//         return;
				//     }
				// }

				// this.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1;
				// becasue we removed page parameter from the router, so when route update, the page is always 1
				this.page = 1;
				this.threadSort = this.$route.params.sort
					? this.$route.params.sort
					: this.threadSort;
				const param = {
					thread_id: this.threadId,
					sort: this.threadSort,
					page: this.page,
					post_id: this.postId,
					thread_slug: this.$route.params.thread_slug,
					snapshot_id: this.snapshotId,
					gallery_id: this.galleryId,
				};
				if (this.previousThreadId != this.threadId) {
					this.thread = {} as ThreadInterface;
				}
				this.previousThreadId = this.threadId;
				// if refresh on page > 1, force to page 1, because we don't have scroll reach top event
				// if (this.page > 1 && (!this.thread.posts || !this.thread.posts.length || this.sortBy !== this.previousSort)) {
				// when switch sort, we need to reset the page to 1
				// if (this.page > 1 && this.previousSort && this.sortBy !== this.previousSort) {
				//     param.page = 1;
				//     this.loadingAfter = false;
				//     this.disableLoadAfter = false;
				//     this.noMoreData = false;
				//     this.$router.push({
				//         name: 'thread',
				//         params: param,
				//     } as unknown as RawLocation);
				//     // must stop here
				//     return;
				// }
				this.disableLoadAfter = true;
				this.getThread(param);
			},
			immediate: true,
		},
	},
	computed: {
		groupName(): string {
			return this.$store.state.Group.name;
		},

		// getCustomType(): boolean {
		// 	return this.$store.getters.getCustomType;
		// },

		userId(): number {
			return this.$store.state.User.id;
		},

		groupJoining(): number {
			if (
				this.$store.getters["GroupExtensions/getFeatureStatus"](
					"GroupLevelPermission"
				)
			) {
				return this.$store.state.Group.joining;
			} else {
				return 1;
			}
		},

		groupVisibility(): number {
			if (
				this.$store.getters["GroupExtensions/getFeatureStatus"](
					"GroupLevelPermission"
				)
			) {
				return this.$store.state.Group.visibility;
			} else {
				return 1;
			}
		},

		threadId(): number {
			const slug = String(this.$route.params.thread_slug).match(
				/-?(\d+)$/
			);
			if (slug) {
				return parseInt(slug[1]);
			} else {
				return 0;
			}
		},

		snapshotId(): string {
			const slug = String(this.$route.params.thread_slug).match(
				/-?(\w+)$/
			);
			if (slug) {
				return slug[1];
			}
			return "";
		},

		galleryId(): number {
			const slug = String(this.$route.params.thread_slug).match(
				/gallery-id-?(\d+)$/
			);
			if (slug) {
				return parseInt(slug[1]);
			}
			return 0;
		},

		threadCategoryId: {
			get(): number {
				return this.categoryStatus ? this.thread.category_index_id : 0;
			},
		},

		categoryStatus(): boolean {
			return true;
		},

		isFollow(): boolean {
			return this.$store.getters["User/isFollow"](
				this.$store.state.Group.id
			);
		},

		sortBy(): string {
			return this.$route.params.sort
				? this.$route.params.sort
				: SORT_BY_GROUP[1];
		},

		sortByData(): string[] {
			return SORT_BY_THREAD;
		},

		previousSort: {
			set(sort: string) {
				this.$store.commit("Thread/setSort", sort);
			},
			get() {
				return this.$store.state.Thread.sort;
			},
		},

		// get page(): number {
		//     return this.$route.params.page ? parseInt(this.$route.params.page) : 1;
		// }

		postId(): number {
			return this.$route.params.post_id
				? parseInt(this.$route.params.post_id)
				: 0;
		},

		loadedPage(): number[] {
			return this.$store.state.Thread.loadedPage;
		},

		scrollReachBottom() {
			return this.$store.state.scrollReachBottom;
		},

		newPostNotification(): PostInterface {
			return this.$store.state.Post.new_post;
		},
		// show/hide flag post popup
		showFlagPost(): number {
			return this.$store.state.Flag.flagPostId;
		},
		// show/hide flag post list popup
		showFlagPostList(): number {
			return this.$store.state.Flag.flagPostListId;
		},
		// show liked usre list of a post
		showLikeListModal(): number {
			return this.$store.state.Like.likeListPostId;
		},
		// show block user popup
		showBlockUserModal(): number {
			return this.$store.state.Flag.blockUser;
		},
	},
	created() {
		window.scrollTo(0, 0);
		const link = document.getElementById(
			"apple-icon"
		) as HTMLAnchorElement | null;
		if (link != null) {
			link.href = this.$store.state.Group.logo
				? this.$store.state.Group.logo
				: "https://metaforo.io/img/default_group_icon.png";
		}
	},
	beforeDestroy() {
		this.thread = {} as ThreadInterface;
		this.snapshot = null;
		this.$store.commit("Thread/clearLoadedPage");
	},
	methods: {
		callSnapshotApi(id: string) {
			this.$store
				.dispatch("Snapshot/getProposalById", id)
				.then((response: any) => {
					if (response) {
						this.snapshot = response;
					}
				});
		},
		onShowJoin() {
			if (this.$store.state.User.id && this.$store.state.User.activate) {
				if (
					this.$store.state.Group.pending_user.indexOf(
						this.$store.state.User.id
					) != -1
				) {
					message.info(this.$t("pending_message") as string);
					return;
				}
				this.showJoinFlag = true;
			} else {
				this.$store.commit("setShowLoginModal", 1);
			}
		},
		onFollow() {
			if (this.$store.state.User.id && this.$store.state.User.activate) {
				this.$store
					.dispatch("Group/follow")
					.then((response: { success: number }) => {
						if (response.success) {
							location.reload();
						}
					});
			} else {
				this.$store.commit("setShowLoginModal", 1);
			}
		},
		getThread(param: any) {
			if (this.loadedPage.length) {
				// load after
				if (this.page > this.loadedPage[this.loadedPage.length - 1]) {
					// when there is no page loaded yet
					if (this.loadingAfter) {
						return;
					}
					// show skeleton
					this.loadingAfter = true;
					// disable load when nothing to load
					this.disableLoadAfter = true;
					// load before
				} else if (this.page < this.loadedPage[0]) {
					this.enableLoadBefore = false;
					this.loadingBefore = true;
				}
			}

			if (param.snapshot_id) {
				param.thread_id = param.snapshot_id;
			}

			if (param.gallery_id) {
				param.thread_id = "gallery_id-" + param.gallery_id;
			}

			this.$store
				.dispatch("Thread/load", param)
				.then((response: Response) => {
					if (response!.response?.data.code == "40003") {
						this.postShowStatus = false;
						return;
					}
					if (
						response &&
						response.response &&
						response.response.data &&
						response.response.data.code == "40011"
					) {
						this.postShowStatus = false;
						// message.error(response.response.data.description, 5);
						return;
					}
					this.postShowStatus = true;
					// hide skeleton
					this.loadingAfter = false;
					this.loadingBefore = false;

					// if http status is not 200
					if (response.getStatus() != 200) {
						this.noMoreData = true;
						message.info(this.$t("network_error") as string);
						return;
					}
					if (response.getCode() == "404") {
						this.noMoreData = true;
						// message.info(this.$t('thread_not_exists') as string);
						this.show404 = true;
						return;
					}
					const responseData: {
						thread: ThreadInterface;
						page?: number;
					} = response.getData();
					const threadData = responseData.thread;
					this.morePostCount = threadData.morePostCount
						? threadData.morePostCount
						: 0;
					// if we already fetched the thread before. only load the posts for next page or for new sort
					if (this.thread.id) {
						// console.log('a', this.previousSort, this.threadSort, this.page);
						if (
							this.page > 1 &&
							this.previousSort &&
							this.threadSort === this.previousSort
						) {
							if (
								this.page >
								this.loadedPage[this.loadedPage.length - 1]
							) {
								this.thread.posts = (
									this.thread.posts as any[]
								).concat(threadData.posts);
							} else if (this.page < this.loadedPage[0]) {
								this.thread.posts = threadData.posts.concat(
									this.thread.posts
								);

								if (this.page > 1) {
									this.enableLoadBefore = true;
								}
							}
						} else {
							// console.log('c');
							// clear loaded page history
							this.$store.commit("Thread/clearLoadedPage");
							this.thread.posts = threadData.posts;
						}
					} else {
						// console.log('b');
						// thread not loaded before, simply assign object
						this.thread = threadData;
						// if we load a page > 1 initially, we must enable load before
						if (this.page > 1) {
							this.enableLoadBefore = true;
						}
					}
					this.setPostAttach();
					//update post count
					this.thread.posts_count = threadData.posts_count;

					//commit thread title
					this.$store.commit("Thread/setTitle", threadData.title);

					//commit thread is pin
					this.$store.commit("Thread/setPin", threadData.is_pin);

					// got data, we can scroll now
					if (
						threadData.posts &&
						threadData.posts.length >= this.pageLength
					) {
						this.disableLoadAfter = false;
						this.noMoreData = false;
					} else {
						// no new post coming, no moew data
						this.noMoreData = true;
					}
					// run these two lines at the end
					this.previousSort = this.threadSort;
					if (responseData.page) {
						// the page corrected by server, push it to the url,
						// it should not load agian, because it should be intercepted by loaded page check
						this.$store.commit(
							"Thread/addLoadedPage",
							responseData.page
						);
						// param.page = responseData.page;

						this.page = parseInt(
							responseData.page as unknown as string
						);
						// StorageLocal.setItem('threadPage:' + this.$store.state.Group.id, responseData.page);
						// console.log('responseData.page', responseData.page);
						// this.$router.push({
						//     name: 'thread',
						//     params: Object.assign({group_name: this.groupName}, param),
						//     hash: '#' + param.post_id,
						// } as unknown as RawLocation);
						// this should only happen when first load a thread
						if (responseData.page > 1) {
							this.enableLoadBefore = true;
						}

						return;
					} else {
						this.$store.commit("Thread/addLoadedPage", param.page);
					}
				});
		},

		loadBefore() {
			if (this.loadingBefore) {
				return;
			}

			this.page = this.page - 1;
			const param = {
				thread_id: this.threadId,
				sort: this.threadSort,
				page: this.page,
				post_id: 0,
				thread_slug: this.$route.params.thread_slug,
				snapshot_id: this.snapshotId,
			};

			this.enableLoadBefore = true;

			this.getThread(param);

			// this.$router.push({
			//     name: 'thread',
			//     params: Object.assign({group_name: this.groupName}, param)
			// } as unknown as RawLocation);
		},

		onScrollReachBottom(val: boolean): void {
			if (
				this.disableLoadAfter ||
				!this.loadedPage.length ||
				this.noMoreData ||
				!val
			) {
				// this.loadingAfter = false;
				return;
			}

			// console.log(this.page);

			this.disableLoadAfter = true;
			this.page = this.page + 1;
			const param = {
				thread_id: this.threadId,
				sort: this.threadSort,
				page: this.page,
				post_id: 0,
				thread_slug: this.$route.params.thread_slug,
				snapshot_id: this.snapshotId,
			};

			this.getThread(param);
		},

		onSortChange(sortBy: string) {
			// show skeleton
			this.thread.posts = [];
			this.loadingAfter = true;
			this.disableLoadAfter = true;
			if (this.userId) {
				StorageLocal.setItem(
					"threadSort:" + this.$store.state.Group.id,
					sortBy
				);
			}
			// disable load when nothing to load

			this.threadSort = sortBy;
			this.page = 1;
			const param = {
				thread_id: this.threadId,
				sort: this.threadSort,
				page: this.page,
				post_id: this.postId,
				thread_slug: this.$route.params.thread_slug,
				snapshot_id: this.snapshotId,
			};
			this.getThread(param);
		},

		onNewPost(postData: PostInterface): void {
			if (postData.parent_id === -1) {
				postData.children = [];
				this.thread.posts.unshift(postData);
				this.setPostAttach();
			}
			this.thread.posts_count = this.thread.posts_count + 1;
		},

		onNewTailPost(postData: PostInterface): void {
			this.thread.posts.push(postData);
			this.setPostAttach();
			this.clearTailReply = true;
			// the child component listening on the change, so we must reset it
			this.$nextTick(() => {
				this.clearTailReply = false;
			});
		},

		onEditPost(postData: PostInterface): void {
			this.thread.first_post.content = postData.content;

			if (postData.attached_files) {
				this.thread.first_post.attached_files = postData.attached_files;
			}

			if (postData.attachments) {
				this.thread.first_post.attachments = postData.attachments;
			}
			this.setPostAttach();
		},

		setPostAttach() {
			this.$store.commit("Thread/setPosts", this.thread.posts);
			this.$store.commit("Thread/setFirstPosts", this.thread.first_post);
			// console.log(this.thread.posts);return;
			this.$store.commit(
				"Attachment/addAttach",
				this.getPostAttach(
					this.thread.first_post,
					this.$store.state.Thread.posts
				)
			);
			// console.log(this.thread.first_post);
			this.$store.commit(
				"Attachment/addAttachImg",
				this.getPostAttachImg(
					this.thread.first_post,
					this.$store.state.Thread.posts
				)
			);
		},

		getPostAttach(first_post: any, posts: any) {
			let attach: any[] = [];
			if (first_post && first_post.attachments) {
				attach = first_post.attachments;
			}
			for (let post in posts) {
				if (posts[post].attachments) {
					attach = attach.concat(posts[post].attachments);
				}

				if (posts[post].children) {
					attach = attach.concat(
						this.getPostAttach([], posts[post].children)
					);
				}
			}
			return attach;
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
		onEditThreadTitle(title: string): void {
			this.thread.title = title;
		},
		onEditThreadCategory(category_index_id: number): void {
			this.thread.category_index_id = category_index_id;
		},
		onPostDelete(post: PostInterface): void {
			if (post.id === this.thread.first_post.id) {
				this.thread.first_post.deleted = 1;

				if (
					parseInt(post.deleted_by as unknown as string) !=
					post.user_id
				) {
					this.thread.first_post.deleted_by = this.$store.state.User;
				}
			}
		},
		onSwicthRecommend(no_recommend: number) {
			if (no_recommend) {
				message.success(
					this.$t("hide_from_trending_notification") as string
				);
			} else {
				message.success(
					this.$t("show_in_trending_notification") as string
				);
			}

			this.thread.no_recommend = no_recommend;
		},
		onShowEdit() {
			this.setEditorFocus = false;

			this.$nextTick(() => {
				this.setEditorFocus = true;
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.action-and-info {
	padding: var(--p2) var(--p6) var(--p2);
	&.mobile-action-and-info {
		padding: var(--p2) var(--p8) var(--p2);
	}
}

.category-empty {
	@include no_data;
}

iframe {
	display: none;
}

.post-list {
	padding: 0 var(--p6) var(--p6);
	border-top: $border-width $border-style var(--border-color5);

	&.mobile-post-list {
		padding: 0 var(--p8) var(--p6);
	}

	.page-title {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.sort {
			padding-bottom: 0;
			font-size: $font-size1 - 0.1;
		}
	}

	.load-before {
		padding: var(--p4) 0 0;

		a {
			@include load_more;
		}
	}

	.ant-skeleton {
		margin-top: var(--p4);
	}
	&.loading-post {
		margin-top: var(--p6);
	}
}

.editor-trigger-section {
	margin-top: var(--p4);
}

.ant-skeleton {
	padding: 0 var(--p6);
}
.request-join {
	text-align: center;
	//margin-top: 30%;
	.request-join-icon {
		.ico {
			font-size: 2.5rem;
		}
		margin-bottom: 10px;
	}
	.request-join-test {
		font-size: 1.1rem;
		margin-bottom: var(--p6);
	}
	.request-button {
		margin: auto;
		height: 40px;
		padding-left: 25px;
		padding-right: 25px;
	}
	.follow {
		width: 240px;
		font-weight: 500;
		height: 40px;
		display: inline-block;
	}
}
.ant-back-top {
	bottom: 30px;
}
</style>
