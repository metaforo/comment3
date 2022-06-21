<template>
	<Web3RegisterProfile
		v-if="showWeb3Login"
		:web3PublicKey="web3PublicKey"
		:login_type="login_type"
		v-on:close-modal="closeModal()"
	/>
	<Web3Sign
		v-else
		:content="signText"
		:onSign="onSign"
		:editSign="''"
		:login-type="login_type"
		:web3PublicKey="this.web3PublicKey"
		v-on:on-sign-change="onSignChange"
		ref="web3Sign"
	/>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ResponseError } from "@/http/ResponseError";
import {
	AR_KEY,
	LEDGER_KEY,
	LOGIN_TYPE_AR,
	LOGIN_TYPE_LEDGER,
	LOGIN_TYPE_METAMASK,
	LOGIN_TYPE_PHANTOM,
	LOGIN_TYPE_WALLET,
	PHANTOM_KEY,
	SIGN_TYPE_LOGIN,
	SIGN_TYPE_POLL,
	StorageLocal,
} from "@/helpers/Utils";
import Web3RegisterProfile from "@/components/Web3RegisterProfile.vue";
import Web3Sign from "@/components/Web3Sign.vue";
import { DeltaInterface, postSignInterface } from "@/helpers/Interfaces";
import { message } from "ant-design-vue";

export default defineComponent({
	components: {
		Web3RegisterProfile,
		Web3Sign,
	},
	data() {
		return {
			isMobile: false,
			modalWidth: 660,
			modalHeight: { height: "600px" },
			showWeb3Login: false,
			web3PublicKey: "",
			signText: "",
			onSign: false,
			web3Provider: "",
			sign: "",
			web: "",
			login_type: LOGIN_TYPE_METAMASK,
		};
	},
	computed: {
		showLoginModal: {
			set(flag) {
				this.$store.commit("setShowLoginModal", flag);
			},
			get() {
				return this.$store.state.showLoginModal;
			},
		},
		provider(): any {
			return this.$store.getters.getProvider;
		},
	},
	created() {
		this.outMetamask();
	},
	methods: {
		closeModal() {
			this.showWeb3Login = false;
			this.$emit("close-modal");
		},
		showWeb3Modal(val = false, isChangeKey = false) {
			if (!this.showLoginModal) {
				return;
			}
			if (this.showLoginModal == 3) {
				this.login_type = LOGIN_TYPE_METAMASK;
				if (
					typeof (window as any).ethereum !== "undefined" &&
					(window as any).ethereum.isMetaMask
				) {
					if (!isChangeKey) {
						this.getChainId();
					}
					const account = this.getAccount();
					account
						.then((val) => {
							this.web3PublicKey = val;
							this.$store.commit("User/setPublicKey", val);
							this.loginSign();
						})
						.catch((e) => {
							message.error(
								"Please connect to your Ethereum wallet to continue"
							);
						});
					this.showLoginModal = 0;
					return;
				} else {
					this.showLoginModal = 0;
					message.error("Please download metamask first");
				}
			}
			if (this.showLoginModal == 4) {
				return this.showMobileLoginModal();
			}
			if (this.showLoginModal == 5 || this.showLoginModal == 6) {
				return this.solanaLoginModal();
			}
			if (this.showLoginModal == 7) {
				return this.arLoginModal();
			}
		},

		arLoginModal() {
			if (typeof (window as any).arweaveWallet !== "undefined") {
				const account = this.getArAccount();
				let that = this;
				account
					.then(() => {
						const address = that.getArPublicKey();
						address
							.then((v) => {
								console.log(v);
								this.web3PublicKey = v;
								this.login_type = LOGIN_TYPE_AR;
								this.loginSign();

								// that.loginWithPublicKey();
								this.showLoginModal = 0;
							})
							.catch((e) => {
								this.showLoginModal = 0;
								message.error(
									"Please connect to your ArConnect wallet to continue"
								);
							});
					})
					.catch((e) => {
						this.showLoginModal = 0;
						message.error(
							"Please connect to your ArConnect wallet to continue"
						);
					});
			} else {
				this.showLoginModal = 0;
				// this.login_type = LOGIN_TYPE_PHANTOM;
				message.error("Please download ArConnect wallet first");
			}
		},
		solanaLoginModal() {
			if (typeof (window as any).solana !== "undefined") {
				if (this.showLoginModal == 5) {
					this.login_type = LOGIN_TYPE_PHANTOM;
				} else {
					this.login_type = LOGIN_TYPE_LEDGER;
				}

				this.getSolanaAccount()
					.then((val) => {
						this.web3PublicKey = val;
						this.$store.commit("User/setSolanaKey", val);
						this.loginSign();
						this.showLoginModal = 0;
						// this.loginWithPublicKey(val)
					})
					.catch(() => {
						message.error(
							"Please connect to your Phantom to continue"
						);
						this.showLoginModal = 0;
					});
			} else {
				this.showLoginModal = 0;
				// this.login_type = LOGIN_TYPE_PHANTOM;
				message.error("Please download phantom first");
			}
		},
		async getSolanaAccount() {
			const resp = await (window as any).solana.connect();
			// console.log(resp.publicKey.toString());
			const account = resp.publicKey.toString();
			return account;
		},
		showMobileLoginModal() {
			// console.log(this.provider);
			this.login_type = LOGIN_TYPE_WALLET;
			this.provider
				.enable()
				.then(() => {})
				.catch((error: ResponseError) => {
					this.$store.commit("setProvider");
					this.showLoginModal = 0;
				});
			this.provider.on("accountsChanged", (accounts: any) => {
				this.$store.commit("User/setPublicKey", accounts[0]);
				this.web3PublicKey = accounts[0];
				this.loginSign();

				this.showLoginModal = 0;
			});
		},
		loginMobileWithPublicKey() {
			const data = new FormData();
			data.append("web3_public_key", this.web3PublicKey);
			data.append("sign", this.sign.sign);
			data.append("signMsg", this.sign.signMsg);
			if (this.login_type == LOGIN_TYPE_PHANTOM) {
				data.append("type", PHANTOM_KEY + "");
			} else if (this.login_type == LOGIN_TYPE_LEDGER) {
				data.append("type", LEDGER_KEY + "");
			} else if (this.login_type == LOGIN_TYPE_AR) {
				data.append("type", AR_KEY + "");
			}
			this.$store
				.dispatch("User/checkPublicKey", data)
				.then((data: { token: string } | any) => {
					if (data && data.token) {
						// StorageLocal.setItem('bearer', data.token);
						this.$store.commit("setBearer", {
							bearer: data.token,
							login_type: LOGIN_TYPE_WALLET,
						});
						this.$store
							.dispatch("User/getMe")
							.then(() => {})
							.catch((error: ResponseError) => {
								StorageLocal.removeItem("bearer");
								this.provider.close();
								message.error(
									this.$t("login_failed") as string
								);
							});
					} else {
						const code = data.getCode();
						if (code == 41004) {
							this.onSign = false;
							message.error(this.$t("login_failed") as string);
						} else {
							this.showWeb3Login = true;
						}
					}
				})
				.catch((error: ResponseError) => {
					this.provider.close();
					message.error(this.$t("login_failed") as string);
				});
		},
		loginSign() {
			(this.$refs.web3Sign as any).setSignTitle(SIGN_TYPE_LOGIN);
			this.onSign = true;
			this.$nextTick(() => {
				this.onSign = false;
			});
		},
		loginWithPublicKey(isChangeKey = false) {
			const data = new FormData();
			data.append("web3_public_key", this.web3PublicKey);
			data.append("sign", this.sign.sign);
			data.append("signMsg", this.sign.signMsg);
			if (this.login_type == LOGIN_TYPE_PHANTOM) {
				data.append("type", PHANTOM_KEY + "");
			}
			this.$store
				.dispatch("User/checkPublicKey", data)
				.then((data: { token: string } | any) => {
					if (typeof isChangeKey == "boolean" && isChangeKey) {
						window.location.reload(true);
					}
					if (data && data.token) {
						if (!StorageLocal.getItem("bearer")) {
							this.outMetamask();
						}
						// StorageLocal.setItem('bearer', data.token);
						this.$store.commit("setBearer", {
							bearer: data.token,
							login_type: this.login_type,
						});
						if (this.$store.state.Group.can_join_group != 1) {
							window.location.reload(true);
						} else {
							this.$store
								.dispatch("User/getMe")
								.then(() => {})
								.catch((error: ResponseError) => {
									StorageLocal.removeItem("bearer");
									message.error(
										this.$t("login_failed") as string
									);
								});
						}
					} else {
						const code = data.getCode();
						if (code == 41004) {
							this.onSign = false;
							message.error(this.$t("login_failed") as string);
						} else {
							this.showWeb3Login = true;
						}
					}
				});
		},
		async getAccount() {
			const accounts = await (window as any).ethereum?.request({
				method: "eth_requestAccounts",
			});
			const account = accounts[0];
			return account;
		},

		async getArAccount() {
			const accounts = await (window as any).arweaveWallet.connect([
				"ACCESS_ADDRESS",
				"SIGNATURE",
				"ACCESS_PUBLIC_KEY",
			]);
			return accounts;
		},
		async getArPublicKey() {
			const accounts = await (
				window as any
			).arweaveWallet.getActivePublicKey();
			return accounts;
		},
		async getChainId() {
			const chainId = await (window as any).ethereum?.request({
				method: "eth_chainId",
			});
			const chain: number = parseInt(chainId, 16);
			if (chain != 1) {
				this.onChainChanged(chain);
			}
		},
		onChainChanged(chanin: number): number {
			this.$emit("on-chanin-change", chanin);
		},
		outMetamask(): void {
			// const login_type = localStorage.getItem('login_type');
			// if (login_type && login_type == '1') {
			//     let that = this;
			//     (window as any).ethereum.on('accountsChanged', function (e:any) {
			//         if (that.$store.state.User.web3_public_key != e[0] && StorageLocal.getItem('bearer')) {
			//             StorageLocal.removeItem('bearer');
			//             document.cookie = "dm=0;path=/";
			//             that.showWeb3Modal(true, true);
			//             //
			//         }
			//     });
			//     (window as any).ethereum.on('chainChanged', function (chanin:any) {
			//         chanin = parseInt(chanin,16);
			//         if (chanin != 1) {
			//             that.onChainChanged(chanin);
			//         }
			//
			//     });
			// }
		},
		onSignChange(sign: postSignInterface | any) {
			if (sign) {
				this.sign = sign;
				if (this.login_type == LOGIN_TYPE_METAMASK) {
					this.loginWithPublicKey();
				} else if (this.login_type == LOGIN_TYPE_WALLET) {
					this.loginMobileWithPublicKey();
				} else if (
					this.login_type == LOGIN_TYPE_PHANTOM ||
					this.login_type == LOGIN_TYPE_LEDGER
				) {
					this.loginWithPublicKey();
				} else if (this.login_type == LOGIN_TYPE_AR) {
					this.loginWithPublicKey();
				}
			}
			// console.log('on-sign-change:'+ sign);
		},
	},
});
</script>
<style lang="scss" scoped>
.login-back-btn {
	position: absolute;
	z-index: 9;
	cursor: pointer;
	top: 60px;
}
</style>
