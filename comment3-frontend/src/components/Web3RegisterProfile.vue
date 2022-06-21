<template>
	<a-modal
		v-model:visible="showWeb3Login"
		:width="modalWidth"
		:bodyStyle="modalHeight"
		:maskStyle="{ backgroundColor: 'rgba(0,0,0,0.75)' }"
		:closable="false"
		:footer="null"
		:centered="true"
		v-on:cancel="closeModal"
	>
		<div
			v-on:click="closeModal"
			:class="['modal-close-btn', { mobile: isMobile }]"
		>
			<Icons type="chacha" />
		</div>
		<section :class="['register-profile', { mobile: isMobile }]">
			<div class="wrapper">
				<div class="title">
					{{ $t("complete_profile") }}
				</div>

				<div class="carousel-row">
					<div class="label">{{ $t("upload_avatar") }}</div>
					<div class="carousel-box" ref="carousel">
						<div class="carousel-wrapper" ref="wrapper">
							<div
								:class="[
									'media-carousel-item carousel-item',
									{
										selected:
											avatarUpload && selectedAvatar == 0,
									},
								]"
							>
								<MediaInput
									v-on:file-uploaded="onAvatarUpload"
									v-on:file-cleared="onAvatarCleared"
									:clear-file="clearAvatar"
									:defaultMedia="'/img/avatar_camera.png'"
									:maxAllowedSize="5"
								/>
							</div>
							<div
								:class="[
									'carousel-item',
									{ selected: selectedAvatar == item },
								]"
								v-for="(item, index) in NfcCardList"
								:key="item"
								v-on:click="
									selectedAvatar == item
										? (selectedAvatar = -1)
										: (selectedAvatar = item)
								"
							>
								<img style="border-radius: 50%" :src="item" />
								<img
									class="Nfc-icon"
									src="/img/nft-icon.png"
									alt=""
								/>
								<div
									class="avatar-shadow"
									style="font-size: 10px"
								></div>
							</div>
							<div
								:class="[
									'carousel-item',
									{ selected: selectedAvatar == item },
								]"
								v-for="item in defaultAvatarTotal"
								:key="item"
								v-on:click="
									selectedAvatar == item
										? (selectedAvatar = -1)
										: (selectedAvatar = item)
								"
							>
								<img
									:src="
										defaultAvatarPath.replace('{i}', item)
									"
								/>
								<div class="avatar-shadow"></div>
							</div>
						</div>
					</div>
					<div
						v-if="leftArrowShow && isMobile == false"
						class="carousel-left-btn"
						v-on:click="scrollLeft"
					>
						<left-outlined />
					</div>
					<div
						v-if="isMobile == false"
						class="carousel-right-btn"
						v-on:click="scrollRight"
					>
						<right-outlined />
					</div>
				</div>

				<div>
					<div :class="['label', 'set-name']">
						{{ $t("set_name") }}
					</div>
					<a-input
						:placeholder="
							$t('username_limit', {
								min: usernameMinLength,
								max: usernameMaxLength,
							})
						"
						size="large"
						v-model.lazy="username"
					/>
				</div>

				<!--            <div>-->
				<!--                <div-->
				<!--                    class="label"-->
				<!--                >{{$t('set_password')}}</div>-->
				<!--                <a-input-->
				<!--                    :placeholder="$t('password_limit', {min: passwordMinLength})"-->
				<!--                    size="large"-->
				<!--                    type="password"-->
				<!--                    v-on:pressEnter="checkProfileData"-->
				<!--                    v-model.lazy="password"-->
				<!--                />-->
				<!--            </div>-->

				<a-button
					type="primary"
					size="large"
					v-on:click="checkProfileData"
					>{{ $t("continue") }}
				</a-button>
			</div>
		</section>
	</a-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { RawLocation } from "vue-router";
import {
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
	USERNAME_MIN_LENGTH,
	USRENAME_MAX_LENGTH,
	DEFAULT_AVATAR_PATH,
	DEFAULT_AVATAR_TOTAL,
	StorageLocal,
	LOGIN_TYPE_METAMASK,
	LOGIN_TYPE_PHANTOM,
	PHANTOM_KEY,
	WEB3_KEY,
	LEDGER_KEY,
	LOGIN_TYPE_LEDGER,
	LOGIN_TYPE_AR,
	AR_KEY,
} from "@/helpers/Utils";
import { UploadedImageUrl } from "@/helpers/Interfaces";
import { ResponseError } from "@/http/ResponseError";
import MediaInput from "@/components/MediaInput.vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

export default defineComponent({
	components: {
		MediaInput,
		LeftOutlined,
		RightOutlined,
	},
	props: {
		web3PublicKey: String,
		login_type: Number,
	},
	data() {
		return {
			modalWidth: 660,
			modalHeight: { height: "600px" },
			showWeb3Login: true,

			isMobile: false,

			email: "",
			token: "",
			go_back: "",

			username: "",
			password: "",

			defaultAvatarPath: DEFAULT_AVATAR_PATH,
			defaultAvatarTotal: DEFAULT_AVATAR_TOTAL,

			NfcCardList: [],
			leftArrowShow: false,
			selectedAvatar: -1,
			avatarUpload: null,
			clearAvatar: false,

			usernameMinLength: USERNAME_MIN_LENGTH,
			usernameMaxLength: USRENAME_MAX_LENGTH,
		};
	},
	created() {
		// server send a link which include a token and email address to user's email
		this.$store
			.dispatch("Web3/loadCard", {
				public_key: this.$store.state.User.web3_public_key,
			})
			.then((res: any) => {
				if (res && res.assets && res.assets.length > 0) {
					for (let i = 0; i < res.assets.length; i++) {
						this.NfcCardList.push(res.assets[i].image_preview_url);
						// console.log(res.assets[i].image_preview_url);
					}
				}
				this.$store.commit("Web3/setNfcCard", this.NfcCardList);
				// console.log(this.$store.state.Web3.NfcCard);
			});
	},
	watch: {
		selectedAvatar(val: number) {
			if (val > 0 && this.avatarUpload) {
				this.onClearAvatar();
			}
		},
	},
	methods: {
		/**
		 * when file uploaded, get the file object
		 * @param fileObject
		 */
		onAvatarUpload(fileObject: string | Blob): void {
			this.avatarUpload = fileObject;
			this.selectedAvatar = 0;
		},

		/**
		 * trigger child component clear file watch
		 */
		onClearAvatar(): void {
			this.clearAvatar = true;
		},

		/**
		 * after child component finished clear file, restore the flag and clear property
		 * @param flag
		 */
		onAvatarCleared(flag: boolean): void {
			if (flag) {
				if (this.avatarUpload) {
					this.avatarUpload = null;
				}
				this.clearAvatar = false;
			}
		},

		// THis is the button clicked handler when users are choosing their avatars
		scrollLeft() {
			this.$refs.carousel.scrollLeft -= 86; // avatar size + margin
			if (this.$refs.carousel.scrollLeft <= 0) {
				this.leftArrowShow = false;
			}
		},

		// same as above.
		scrollRight() {
			const boxWidth = this.$refs.carousel.getBoundingClientRect().width;
			const wrapperWidth =
				this.$refs.wrapper.getBoundingClientRect().width;

			if (this.$refs.carousel.scrollLeft >= wrapperWidth - boxWidth) {
				return;
			}

			this.$refs.carousel.scrollLeft += 86; // avatar size + margin
			this.leftArrowShow = true;
		},

		/**
		 * In step 2 setup profile, users input their username and password, then register
		 * Dismiss modal if succeed
		 */
		checkProfileData() {
			if (!this.avatarUpload && this.selectedAvatar < 1) {
				message.error(this.$t("upload_avatar_error") as string);
				return;
			}

			if (
				!this.username ||
				this.username.length < this.usernameMinLength ||
				this.username.length > this.usernameMaxLength
			) {
				message.error(
					this.$t("username_error", {
						min: this.usernameMinLength,
						max: this.usernameMaxLength,
					}) as string
				);
				return;
			}

			// if (!this.password || this.password.length < this.passwordMinLength || this.password.length > this.passwordMaxLength) {
			//     message.error(this.$t('password_error', {min: this.passwordMinLength, max: this.passwordMaxLength}) as string);
			//     return;
			// }

			// if (!this.token) {
			//     message.error(this.$t('confirm_expired') as string);
			//     return;
			// }

			this.register();
		},
		async register() {
			const data = new FormData();

			// data.append('email', this.email);
			data.append("password", "");
			data.append("name", this.username);
			// data.append('token', this.token);
			data.append("web3_public_key", this.web3PublicKey);
			if (this.selectedAvatar > 0) {
				const photoUrl =
					import.meta.env.VITE_APP_DOMAIN +
					this.defaultAvatarPath.replace(
						"{i}",
						this.selectedAvatar + ""
					);
				data.append("photo_url", photoUrl);
			} else if (this.avatarUpload) {
				const uploadedAvatarUrl: UploadedImageUrl =
					await this.$store.dispatch("Profile/uploadAvatar", {
						dataUrl: this.avatarUpload,
					});
				data.append("photo_url", uploadedAvatarUrl.thumb_url);
			} else if (
				this.selectedAvatar.indexOf("https") == 0 ||
				this.selectedAvatar.indexOf("http") == 0
			) {
				data.append("photo_url", this.selectedAvatar);
			} else {
				data.append("photo_url", "");
			}
			if (this.NfcCardList.indexOf(this.selectedAvatar) != -1) {
				data.append("is_nfc", "1");
			} else {
				data.append("is_nfc", "0");
			}

			if (this.login_type == LOGIN_TYPE_PHANTOM) {
				data.append("type", PHANTOM_KEY + "");
			} else if (this.login_type == LOGIN_TYPE_LEDGER) {
				data.append("type", LEDGER_KEY + "");
			} else if (this.login_type == LOGIN_TYPE_AR) {
				data.append("type", AR_KEY + "");
			} else {
				data.append("type", WEB3_KEY + "");
			}
			const refer = localStorage.getItem("referral");
			data.append("referral", refer + "");

			this.$store.commit("setShowProgressLine", true);
			this.$store
				.dispatch("User/registerWithWeb3", data)
				.then((data: { token: string } | any) => {
					if (data && data.token) {
						localStorage.removeItem("referral");
						// StorageLocal.setItem('bearer', data.token);
						this.$store.commit("setBearer", {
							bearer: data.token,
							login_type: this.login_type,
						});
						this.$store
							.dispatch("User/getMe")
							.then(() => {
								this.closeModal();
							})
							.catch((error: ResponseError) => {
								StorageLocal.removeItem("bearer");
								message.error(
									this.$t("login_failed") as string
								);
							});
					} else {
						if (data && data.response && data.response.data) {
							if (data.response.data.description) {
								message.error(data.response.data.description);
							} else {
								message.error(
									this.$t("network_error") as string
								);
							}
						} else {
							message.error(this.$t("network_error") as string);
						}
					}
				})
				.catch((error: ResponseError) => {
					const response = error.getResponse();
					if (response && response.getStatus() == 422) {
						const errors = response.getValidationErrors();

						if (errors) {
							for (let i in errors) {
								message.error(errors[i] as string);
							}

							if (errors.name) {
								// username taken, do not close
								return;
							}
						}
						this.$router.push({
							name: "homegroups",
						} as unknown as RawLocation);
						return;
					}
				})
				.finally(() => {
					this.$store.commit("setShowProgressLine", false);
				});
		},
		onClose() {
			this.$emit("close");
		},
		closeModal() {
			this.showWeb3Login = false;

			this.$emit("close-modal");
		},
	},
});
</script>
<style lang="scss" scoped>
.register-profile {
	// .wrapper {
	padding-left: 22%;
	padding-right: 22%;
	margin: 0;
	// }
	.title {
		@include title_font;
		margin-top: 6px;
		margin-right: auto;
		margin-left: auto;
		align-content: center;
		width: fit-content;
	}

	.label {
		@include secondary_title_font();
		margin-top: 30px;
		margin-bottom: 10px;
		padding: 0;
		user-select: none;
		font-weight: 500;
	}

	.carousel-row {
		position: relative;

		.label {
			margin-top: 38px;
		}

		.carousel-box {
			height: 100px;
			overflow: hidden;
			width: 348px;

			/* Hide scrollbar for Chrome, Safari and Opera */
			&::-webkit-scrollbar {
				display: none;
			}

			$avatar-size: 70px;
			$avatar-margin: 16px;

			.carousel-wrapper {
				display: flex;
				width: ($avatar-size + $avatar-margin) * 25 - $avatar-margin;

				.carousel-item {
					margin-right: var(--p4);
					cursor: pointer;
					text-align: right;

					.media-holder {
						float: none;
						width: $avatar-size;
						height: $avatar-size;
						border-radius: 50%;
						overflow: hidden;
						margin-top: calc(var(--p4) + 6px);
					}

					img {
						z-index: 2;
						position: relative;
						top: calc(var(--p4) + 6px);
						transition: all 0.3s;
						width: $avatar-size;
						height: $avatar-size;
					}
					.Nfc-icon {
						font-size: 10px;
						display: inline-block;
						transition: all 0.3s;
						border-radius: 2px;
						width: 25px;
						height: 14px;
						top: 10px;
					}

					.avatar-shadow {
						display: block;
						width: 28px;
						height: 6px;
						border-radius: 50%;
						background-color: var(--avatar-shadow-color);
						margin: var(--p4) auto 0;
						position: relative;
						bottom: 0;
					}

					&.selected {
						img {
							position: relative;
							top: 0;
							transition: all 0.3s;
						}
						.Nfc-icon {
							font-size: 10px;
							top: -12px;
							transition: all 0.3s;
							display: inline-block;
						}
						.avatar-shadow {
							display: block;
							position: relative;
							bottom: 0;
							display: block;
							width: 14px;
							height: 3px;
							background-color: var(--avatar-shadow-color);
							transition: all 0.2s;
						}
					}
				}
			}
		}
		.carousel-left-btn,
		.carousel-right-btn {
			position: absolute;
			top: calc(50% + 1rem);
			cursor: pointer;
			user-select: none;
			-moz-user-select: none;
			-webkit-user-select: none;
			i {
				color: var(--font-color6);
			}
		}

		.carousel-left-btn {
			left: -40px;
		}

		.carousel-right-btn {
			right: -40px;
		}
	}

	.ant-btn,
	.ant-input {
		height: $modal-input-height;
	}

	.ant-btn {
		margin-top: var(--p7);
		width: 100%;
		font-size: 1rem;
	}

	&.mobile {
		padding-left: 0;
		padding-right: 0;

		.label {
			margin-top: 16px;

			&.set-name {
				margin-top: -12px;
			}
		}

		.carousel-row {
			.label {
				margin-top: 24px;
			}

			.carousel-box {
				height: 100px;
				width: 100%;
				overflow-y: hidden;
				overflow-x: scroll;

				$avatar-size: 50px;
				$avatar-margin: 8px;

				.carousel-wrapper {
					width: ($avatar-size + $avatar-margin) * 25 - $avatar-margin;
				}

				.carousel-item {
					.media-holder {
						width: $avatar-size;
						height: $avatar-size;
					}

					img {
						width: $avatar-size;
						height: $avatar-size;
					}
				}
			}
		}
	}
}
</style>
