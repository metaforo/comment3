<template>
	<div id="app">
		<a-layout>
			<GroupNavBar
				v-if="
					$route.params.group_name ||
					$route.name == '404' ||
					getCustomType ||
					$route.name == 'group404'
				"
			/>
			<router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
				<keep-alive :max="maxLength">
					<component :is="Component" />
				</keep-alive>
			</router-view>
			<router-view v-if="!$route.meta.keepAlive"></router-view>
			<UserProfile
				v-if="showProfile"
				v-on:close="
					() => {
						showProfile = false;
					}
				"
			/>
			<Messenger />
			<ProgressLine v-if="showProgress" />
		</a-layout>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Buffer } from "buffer";
import { useCookies } from "vue3-cookies";
import { message } from "ant-design-vue";
import { LANGUAGE_LIST, StorageLocal, switchDarkMode } from "@/helpers/Utils";
import { ResponseError } from "@/http/ResponseError";
import { bindEvent, removeEvent } from "@/helpers/Utils";
import GroupNavBar from "@/components/GroupNavBar.vue";
import UserProfile from "@/components/UserProfile.vue";
import Messenger from "@/components/Messenger.vue";
import ProgressLine from "@/components/ProgressLine.vue";

declare const Intercom: any;

export default defineComponent({
	setup() {
		const { cookies } = useCookies();
		return { cookies };
	},
	components: {
		UserProfile,
		GroupNavBar,
		Messenger,
		ProgressLine,
	},
	data() {
		return {
			maxLength: 2,
		};
	},
	computed: {
		showProgress: {
			get(): boolean {
				return this.$store.state.showProgressLine;
			},
		},
		getCustomType: {
			get(): boolean {
				return this.$store.getters.getCustomType;
			},
		},
		showProfile: {
			get(): boolean {
				return this.$store.state.Profile.show;
			},
			set(flag: boolean) {
				this.$store.commit("Profile/showProfile", flag);
			},
		},
		isDarkMode: {
			get(): boolean {
				return !this.$store.getters["User/darkMode"];
			},
		},
		userId: {
			get(): number {
				return this.$store.state.User.id;
			},
		},
	},
	watch: {
		userId: {
			handler() {
				// console.log(this.$store.state.User.id)
				if (this.$store.state.User.id > 0) {
					(window as any).intercomSettings = {
						api_base: "https://api-iam.intercom.io",
						app_id: "xjgjd91i",
						name: this.$store.state.User.name,
						user_id: this.$store.state.User.id, // Full name
						email: this.$store.state.User.email, // Email address
						user_hash: this.$store.state.User.intercom_secret,
					};
					// Intercom('update', {
					//   "id": this.$store.state.user.id,
					//   "name": this.$store.state.user.name,
					// });
					Intercom("update");
				}
			},
		},
	},
	// created() is a Lifecycle Hooks Called synchronously after the instance is created.
	// At this stage, the instance has finished processing the options which means the following have been set up:
	// data observation, computed properties, methods, watch/event callbacks.
	// However, the mounting phase has not been started, and the $el property will not be available yet.
	created() {
		//         // if (import.meta.env.NODE_ENV === 'development'){
		//         //     const t = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjEuNDE6ODEwMVwvYXBpXC9xcl9jb2RlX3NjYW5fbG9jYWwiLCJpYXQiOjE1ODkyNDkzOTksImV4cCI6MTU5NDQzMzM5OSwibmJmIjoxNTg5MjQ5Mzk5LCJqdGkiOiJyZkV3ZHplRklITUJjQm9LIiwic3ViIjo0NiwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.Cw0oSbuKqMU8HKVg4z_3mi23_xylTlwe3dP2kcZBMpY";
		//         //     if (!localStorage.getItem('bearer')){
		//         //         localStorage.setItem('bearer', t);
		//         //     }
		//         // }
		//         // console.log(this.isDarkMode)
		const darkModeDisabled: string[] = ["privacy", "eula", "terms"];
		if (
			this.isDarkMode &&
			darkModeDisabled.indexOf(this.$route.name as string) === -1
		) {
			switchDarkMode(true);
		} else {
			switchDarkMode(false);
		}
		if (!StorageLocal.getItem("bearer")) {
			if (this.cookies.get("bearer")) {
				StorageLocal.setItem("bearer", this.cookies.get("bearer"));
			}
		}
		// message.config({
		// 	duration: 3,
		// });
		const uri = window.location.search.substring(1);
		const params = new URLSearchParams(uri);
		// login for app -> mobile web browser
		if (params.get("bearer")) {
			StorageLocal.removeItem("bearer"); // this line probably unnecessary
			StorageLocal.setItem("bearer", params.get("bearer") as string);
		}
		if (StorageLocal.getItem("bearer")) {
			this.$store
				.dispatch("User/getMe")
				.then(() => {
					// if we updated version, force reload
					if (this.$store.state.User.api_version) {
						if (StorageLocal.getItem("api_version")) {
							if (
								parseInt(
									StorageLocal.getItem(
										"api_version"
									) as string
								) !=
								parseInt(this.$store.state.User.api_version)
							) {
								StorageLocal.setItem(
									"api_version",
									this.$store.state.User.api_version
								);
								window.location.reload(true);
							}
						} else {
							StorageLocal.setItem(
								"api_version",
								this.$store.state.User.api_version
							);
						}
					}
					if (this.$store.state.User.settings) {
						if (this.$store.state.User.settings.language) {
							const language: any =
								this.$store.state.User.settings.language;
							this.$root.$i18n.locale = language;
							StorageLocal.setItem(
								"language",
								language as string
							);
						}
					}
					if (this.$store.state.User.dark_mode == 0) {
						this.$store.commit(
							"User/setDarkMode",
							this.$store.state.User.dark_mode
						);
					}
				})
				.catch((error: ResponseError) => {
					StorageLocal.removeItem("bearer");
					// this.$store.dispatch('User/refresh');
				});
		} else {
			if (StorageLocal.getItem("language")) {
				var language: any = StorageLocal.getItem("language");
			} else {
				var language: any = (
					(navigator.languages && navigator.languages[0]) ||
					navigator.language
				).replace("-", "_");
				var flag = false;
				for (let i = 0; i < LANGUAGE_LIST.length; i++) {
					if (LANGUAGE_LIST[i].value === language) {
						flag = true;
					}
				}
				if (!flag) {
					language = "en";
				}
				StorageLocal.setItem("language", language as string);
			}
			this.$root.$i18n.locale = language;
		}
	},
	mounted() {
		bindEvent(window, "scroll", this.scroll, { passive: true });
		if (window.history && window.history.pushState) {
			// history.pushState(null, null, document.URL)
			bindEvent(window, "popstate", this.back, { passive: true });
			// window.addEventListener('popstate', this.back, false)
		}
	},
	updated(): void {
		// console.log('main', document.URL);
		this.$store.commit("setBack", false);
	},
	beforeDestroy() {
		removeEvent(window, "scroll", this.scroll, { passive: true });
		removeEvent(window, "popstate", this.back, { passive: true });
	},
	methods: {
		back() {
			this.$store.commit("setBack", true);
			// console.log('back', document.URL);
		},

		// @Watch('$route', {immediate: true, deep: true})

		scroll() {
			const pageHeight = document.documentElement.scrollHeight;
			const windowHeight = window.innerHeight;
			const scrollPosition =
				window.scrollY ||
				window.pageYOffset ||
				document.body.scrollTop +
					((document.documentElement &&
						document.documentElement.scrollTop) ||
						0);

			if (this.$route.name === "group") {
				this.$store.commit("setScrollPos", scrollPosition);
			}

			if (pageHeight <= windowHeight + scrollPosition + 5) {
				this.$store.commit("setScrollReachBottom", true);

				this.$nextTick(() => {
					this.$store.commit("setScrollReachBottom", false);
				});
			}
		},
	},
});
</script>
<style lang="scss">
/* some global stuff */
:root {
	--p1: 4px;
	--p1-5: 6px;
	--p2: 8px;
	--p3: 12px;
	--p4: 16px;
	--p5: 20px;
	--p6: 24px;
	--p7: 28px;
	--p8: 32px;
	--p9: 36px;
	--p10: 40px;
	--p11: 44px;
	--p12: 48px;
	--fold-line-top: 58px;
	--nested-margin-left: 48px;
}

@media #{$mobile-device-break-point} {
	:root {
		--p1: 2px;
		--p1-5: 3px;
		--p2: 4px;
		--p3: 6px;
		--p4: 8px;
		--p5: 10px;
		--p6: 12px;
		--p7: 14px;
		--p8: 16px;
		--p9: 18px;
		--p10: 20px;
		--p11: 22px;
		--p12: 24px;
		--fold-line-top: 50px;
		--nested-margin-left: 48px;
	}
}

html,
body {
	margin: 0;
	padding: 0;
}

html {
	font-size: $root-size;
}

html * {
	font-family: Roboto;
}

body {
	line-height: 1;
	font-size: $root-size;
	font-family: Roboto;
	background-color: var(--body-bg);
	color: var(--font-color1);
	// disable select for everything, enable it for post content and some text later
	// user-select: none;
	&.no-scroll {
		overflow: hidden;
	}
}

.ant-popover-inner {
	background-color: var(--navbar-bg);
}

ul {
	list-style: none;
	margin-bottom: 0 !important;
	padding-inline-start: 0; /* override user agent */
}

a:focus {
	text-decoration: none;
}

.fl {
	float: left;
}

.fr {
	float: right;
}

.ant-layout {
	background-color: var(--body-bg);
}

/* override some ant vue design styles, which can not be alter by passing modifyVars to less loader */
.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
	border-right-width: 0 !important;
}

.ant-modal-content {
	background-color: var(--body-bg);
}
.ant-dropdown-menu {
	background-color: var(--navbar-bg);
	box-shadow: $box-shadow;
}

.ant-back-top {
	position: fixed;
	right: 30px;
	.ant-back-top-content {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		.ant-back-top-icon {
			margin: 17px auto;
		}
	}
}

.ant-dropdown-menu-item {
	color: var(--font-color2);
}

.ant-dropdown-menu-item-active {
	color: var(--theme-color);
}
.ant-dropdown-menu-item:hover {
	background-color: var(--hover-bg);
}

.ant-btn-primary {
	//background-color: var(--theme-color);
	//border-color: var(--theme-color);
	font-size: $font-size14px;
}

.ant-breadcrumb > span:last-child a {
	color: var(--font-color1);
}

.ant-card-bordered,
.ant-menu {
	border: 0;
}

.ant-card-body {
	padding: var(--p6);
}

.ant-card-meta-title {
	color: var(--font-color1);
	font-weight: $title-weight;
}

.ant-skeleton-content .ant-skeleton-title,
.ant-skeleton-content .ant-skeleton-paragraph > li,
.ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title,
.ant-skeleton.ant-skeleton-active
	.ant-skeleton-content
	.ant-skeleton-paragraph
	> li {
	background: linear-gradient(
		90deg,
		var(--skeleton-color1) 25%,
		var(--skeleton-color2) 37%,
		var(--skeleton-color1) 63%
	);
}

.ant-skeleton.ant-skeleton-active .ant-skeleton-avatar,
.ant-skeleton-header .ant-skeleton-avatar {
	background: var(--skeleton-color2);
}

.ant-menu-inline .ant-menu-submenu-title {
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.ant-list-split .ant-list-item {
	padding: var(--p9) var(--p6);
	border: 0;
}

.ant-list-vertical .ant-list-item-content {
	margin-bottom: 0 !important;
}

.ant-list-item {
	position: relative;
}

.no-sub .ant-menu-submenu-arrow {
	display: none;
}

.ant-input {
	@include placeholder_font;
	opacity: 1;
	background-color: var(--navbar-bg);
	border-color: var(--border-color2);
	color: var(--font-color1);
}

// these 4 lines are not necessary
// .ant-input::-webkit-input-placeholder { /* WebKit, Blink, Edge */    color:    var(--desc-color); }
// .ant-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */   color:   var(--desc-color); }
// .ant-input::-moz-placeholder { /* Mozilla Firefox 19+ */   color:    var(--desc-color); }
// .ant-input:-ms-input-placeholder { /* Internet Explorer 10-11 */   color:    var(--desc-color); }

.ant-checkbox-inner {
	background-color: var(--border-color2);
}

.ant-input-group-addon {
	background-color: var(--home-bg);
	border-color: var(--home-bg);
}

.ant-btn-disabled.ant-btn,
.ant-btn-primary-disabled.ant-btn,
.ant-btn-primary.ant-btn.disabled,
.ant-btn-primary.ant-btn[disabled] {
	color: var(--btn-disabled);
	background-color: var(--btn-disabled-bg);
	border-color: var(--btn-disabled-border);
}
.ant-radio-wrapper {
	color: var(--font-color1);
}

.ant-radio-disabled + span {
	color: var(--font-color1);
}

.ant-input-lg {
	font-size: $font-size1;
}

.ant-checkbox-inner {
	border-color: #606878;
}

.ant-layout-header {
	line-height: initial;
	box-shadow: 0 2px 4px 0 var(--box-shadow-color);
}

// self-defined global style
.main-layout {
	max-width: 100%;
	margin: 0 auto;
}

.ant-tabs-bar {
	border-bottom-color: var(--border-color2);
	margin-bottom: 0;
}

//change table font-size
.ant-table thead {
	font-size: $font-size2;
}

//change tabs font-size and font weight
.ant-tabs-nav-wrap {
	font-size: $font-size3;
	font-weight: 500;
	color: var(--font-color6);
	.ant-tabs-tab-active {
		font-weight: 500;
	}
	.ant-tabs-tab {
		padding-left: 0;
		padding-right: 0;
	}
}

.ant-modal-header {
	background-color: var(--body-bg);
	border-color: var(--border-color5);
	.ant-modal-title {
		color: var(--font-color1);
	}
}

.ant-table-thead > tr > th {
	background-color: var(--body-bg);
	color: var(--font-color1);
}

.ant-table-placeholder {
	background-color: var(--body-bg);
	color: var(--font-color1);
	border-color: var(--border-color5);
	border-top: 0;
}

.ant-empty-normal {
	color: var(--font-color1);
}

.ant-switch:not(.ant-switch-checked) {
	background-color: #cccccc;
}

.main-content {
	margin: 0 auto;
	position: relative;
	max-width: 100%;
}

.main-content,
.left-sider {
	border-right: $border-width $border-style var(--border-color5);
}

svg:not(:root) {
	overflow: visible;
}

/* globally used elements start */
.modal-close-btn {
	position: absolute;
	right: -28px;
	width: 18px;
	top: 2px;
	cursor: pointer;
	line-height: 0;

	.ico {
		color: #ffffff !important;
	}

	&.mobile {
		right: 0px;
		top: -28px;
	}
}

.confirm-message {
	@include title_font;
	text-align: center;
	padding: var(--p6);
}

/* globally used elements end */

@media (min-width: 1400px) {
	.main-layout {
		width: $total-width1;

		.main-content {
			width: $mid-width1;

			&.no-left {
				width: $mid-width1 + $left-width1;
			}
		}

		&.wide {
			width: $total-width1 + $wide-diff;

			.main-content {
				width: $mid-width1 + $wide-diff;
			}
		}
	}

	.left-sider {
		width: $left-width1 !important;
		max-width: $left-width1 !important;
		min-width: $left-width1 !important;
	}
}

@media (min-width: 1000px) and (max-width: 1400px) {
	.main-layout {
		width: $total-width2;

		.main-content {
			width: $mid-width2;

			&.no-left {
				width: $mid-width2 + $left-width2;
			}
		}

		&.wide {
			width: $total-width2 + $wide-diff;

			.main-content {
				width: $mid-width2 + $wide-diff;
			}
		}
	}

	.left-sider {
		width: $left-width2 !important;
		max-width: $left-width2 !important;
		min-width: $left-width2 !important;
	}
}

@media (max-width: 1000px) {
	.main-content {
		width: $mid-width2;
		flex: auto;

		&.no-left {
			width: $mid-width2 + $left-width2;
		}

		&.wide {
			width: $total-width2 + $wide-diff;

			.main-content {
				width: $mid-width2 + $wide-diff;
			}
		}
	}

	.left-sider {
		display: none;
	}
}

.poll_card .ant-card-hoverable {
	border: 1px;
	border-color: var(--border-color2);
}

//.height-unset-i{
//    height: unset!important;
//}
</style>
