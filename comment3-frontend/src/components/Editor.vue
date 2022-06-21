<template>
	<div
		:class="['editor-box', { focus: hasFocus }, { mobile: isMobile }]"
		v-on:keyup.enter="(e) => prepareData(e)"
		ref="editorContentDiv"
	>
		<VueScrollBar
			v-if="!isThreadEditor"
			:scroll-to="scrollPos"
			:pasting="pasting"
			:min-height="isThreadEditor && minHeight ? minHeight : 0"
			:max-height="maxHeight ? maxHeight : 0"
			v-on:click-scroll-wrap="onClickContainer"
			v-on:reset-pasting="pasting = false"
		>
			<div id="confined_box">
				<div ref="editorDiv" v-on:click.self="onClickContainer"></div>
			</div>
		</VueScrollBar>
		<div
			v-else
			id="confined_box"
			:style="{
				minHeight: isThreadEditor && minHeight ? minHeight + 'px' : 0,
			}"
		>
			<div ref="editorDiv" v-on:click.self="onClickContainer"></div>
		</div>
		<section>
			<div
				v-for="(attach, index) in attached_files"
				:key="index"
				class="attach-block"
			>
				<div class="name-size">
					<span>{{ attach.fileObj.name }}</span>
					<span>({{ sizeDisplay(attach.fileObj.size) }})</span>
					<span v-if="attach.progress">{{
						attach.progress >= 100
							? $t("uploaded")
							: attach.progress + "%"
					}}</span>
				</div>
				<span v-on:click="removeAttachedFiles(index)">
					<Icons type="chacha" />
				</span>
			</div>

			<div v-if="sign && sign.sign != ''" class="attach-block">
				<div class="name-size">
					<span>Signed：{{ sign.sign }}</span>
				</div>
				<span v-on:click="removeSign()">
					<Icons type="chacha" />
				</span>
			</div>
			<!--     draw       -->
			<div
				v-if="lottery"
				class="attach-block"
				style="display: flex; align-items: center"
			>
				<div style="display: flex; overflow: hidden">
					<div class="attach-poll align-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							viewBox="0 0 30 30"
						>
							<path
								d="M11.2,1.6c2,0,3.7,0.9,4.9,2.3c1.3-1.5,3.1-2.3,5.1-2.3h1.2c3.1,0,5.6,2.5,5.6,5.6c0,0,0,0,0,0V8h0.8c1.8,0,3.2,1.4,3.2,3.2c0,0,0,0,0,0v3.2c0,1.5-1,2.7-2.4,3.1c0,0,0,0.1,0,0.1v9.6c0,1.8-1.4,3.2-3.2,3.2c0,0,0,0,0,0H5.6c-1.8,0-3.2-1.4-3.2-3.2c0,0,0,0,0,0v-9.6l0-0.1C1,17.1,0,15.9,0,14.4v-3.2C0,9.4,1.4,8,3.2,8c0,0,0,0,0,0H4V7.2c0-3.1,2.5-5.6,5.6-5.6c0,0,0,0,0,0H11.2z M14.4,17.6H5.6v9.6h8.8V17.6z M26.4,17.6h-8.8v9.6h8.8V17.6z M4.9,11.2H3.2v3.2h11.2v-3.2H4.9C4.9,11.2,4.9,11.2,4.9,11.2z M28.8,11.2h-1.7v0l-9.5,0v3.2h11.2L28.8,11.2L28.8,11.2z M11.2,4.8H9.6C8.4,4.8,7.3,5.7,7.2,7l0,0.2V8h7.2l0-0.2c-0.1-1.6-1.4-2.8-3-3L11.2,4.8z M22.4,4.8h-1.2c-1.8,0-3.3,1.3-3.6,3.1l0,0.1h7.2V7.2c0-1.2-0.9-2.3-2.2-2.4C22.6,4.8,22.4,4.8,22.4,4.8z"
							/>
						</svg>
					</div>
					<div class="poll_title" v-if="lottery.name">
						{{ lottery.name }}
					</div>
				</div>

				<div class="poll_block_right">
					<span v-on:click="drawEdit()" class="poll_edit">Edit</span>
					<div v-on:click="removeDraw()">
						<Icons type="chacha" />
					</div>
				</div>
			</div>

			<div
				v-if="polls != null && polls.length > 0"
				v-for="(poll, index) in polls"
				:key="index"
				class="attach-block"
				style="display: flex"
			>
				<div style="display: flex; overflow: hidden; width: 100%">
					<span v-if="poll.chartType == 1" class="attach-poll">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							viewBox="0 0 36 36"
						>
							<path
								class="cls-1"
								d="M6,10a1.8,1.8,0,0,1,2,1.5V24.491a2.082,2.082,0,0,1-4,0V11.5A1.8,1.8,0,0,1,6,10Zm8-8a1.8,1.8,0,0,1,2,1.5V24.491a2.082,2.082,0,0,1-4,0V3.5A1.8,1.8,0,0,1,14,2Zm8,3a1.8,1.8,0,0,1,2,1.5V24.491a2.082,2.082,0,0,1-4,0V6.5A1.8,1.8,0,0,1,21.992,5Zm8,10.993a1.8,1.8,0,0,1,2,1.5v7a2.082,2.082,0,0,1-4,0v-7A1.8,1.8,0,0,1,29.989,16ZM3.411,29.988H32.576a2.121,2.121,0,0,1,0,4H3.411A2.121,2.121,0,0,1,3.411,29.988Z"
							/>
						</svg>
					</span>
					<span v-if="poll.chartType == 2" class="attach-poll">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							viewBox="0 0 32 32"
						>
							<path
								d="M874.749,3581.58l12.671-7.26a15.958,15.958,0,0,0-12.671-7.32v14.58ZM873.991,3599a16.028,16.028,0,0,0,10.318-3.78l-11.334-11.08a1.192,1.192,0,0,1-.387-1v-16.09a16.006,16.006,0,0,0,1.4,31.95h0Zm11.914-5.34a15.974,15.974,0,0,0,2.58-17.47l-12.817,7.37Z"
								transform="translate(-858 -3567)"
							/>
						</svg>
					</span>
					<span v-if="poll.chartType == 3" class="attach-poll">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="31.969"
							height="30"
							viewBox="0 0 31.969 30"
						>
							<path
								d="M889.931,3663.35a1.477,1.477,0,0,0-1.2-.99l-9.239-1.32-4.133-8.23a1.506,1.506,0,0,0-2.671,0l-4.133,8.23-9.24,1.32a1.473,1.473,0,0,0-1.2.99,1.446,1.446,0,0,0,.377,1.5l6.686,6.4-1.578,9.04a1.449,1.449,0,0,0,.592,1.43,1.507,1.507,0,0,0,1.57.11l8.265-4.27,8.264,4.27a1.538,1.538,0,0,0,.692.17,1.476,1.476,0,0,0,.876-0.28,1.451,1.451,0,0,0,.592-1.43l-1.578-9.04,6.686-6.4A1.45,1.45,0,0,0,889.931,3663.35Z"
								transform="translate(-858.031 -3652)"
							/>
						</svg>
					</span>

					<span class="poll_title_block" v-if="poll.title">
						<span class="poll_title"> {{ poll.title }} </span>
					</span>
					<span class="poll_title_block" v-if="!poll.title">
						<span class="poll_title" v-if="poll.chartType != 3">
							Poll
						</span>
						<span class="poll_title" v-if="poll.chartType == 3">
							Rating
						</span>
					</span>
				</div>

				<div class="poll_block_right">
					<span v-on:click="pollEdit(index)" class="poll_edit"
						>Edit</span
					>
					<div v-on:click="removePoll(index)">
						<Icons type="chacha" />
					</div>
				</div>
			</div>
		</section>
		<div class="divider"></div>
		<div class="toolbar-box">
			<a-button
				type="primary"
				class="send"
				:disabled="sendDisabled"
				v-on:click="prepareData"
				>{{ sendBtnText }}
			</a-button>
			<div ref="toolbarDiv" v-on:click.self="onClickContainer">
				<button
					v-show="showButton"
					:disabled="disableImageInsert && !isThreadEditor"
					:class="[
						'ql-image',
						{ disabled: disableImageInsert && !isThreadEditor },
					]"
					:title="'Image'"
				></button>
				<button
					v-show="showButton"
					class="ql-bold"
					:title="'Bold'"
				></button>
				<button
					v-show="showButton"
					class="ql-italic"
					:title="'Italic'"
				></button>
				<button
					v-show="showButton"
					class="ql-underline"
					:title="'Underline'"
				></button>
				<button
					v-show="showButton"
					v-if="showAttachedFiles"
					:class="['ql-attach', { disabled: disableAttachFiles }]"
					:title="'attachment'"
				>
					<svg viewBox="0 0 24 24" version="1.1">
						<g
							stroke="none"
							stroke-width="1"
							fill="none"
							fill-rule="evenodd"
						>
							<g fill-rule="nonzero">
								<path
									d="M8.11339412,23.9703402 C5.98279789,23.9837221 3.92821261,23.1792643 2.37325744,21.7226453 C0.859805966,20.3157498 0,18.3425544 0,16.2761831 C0,14.2098118 0.859805966,12.2366163 2.37325744,10.8297208 L12.139431,1.56549085 C14.4835755,-0.521830283 18.0196692,-0.521830283 20.3638137,1.56549085 C21.4497875,2.57234685 22.0669941,3.98625439 22.0669941,5.46716558 C22.0669941,6.94807677 21.4497875,8.36198432 20.3638137,9.36884031 L10.5976402,18.636067 C9.17975735,19.892463 7.04703089,19.892463 5.62914808,18.636067 C4.9730432,18.0276006 4.60016543,17.1732517 4.60016543,16.2784306 C4.60016543,15.3836094 4.9730432,14.5292605 5.62914808,13.9207942 L15.3953216,4.65206915 C15.878191,4.2038057 16.6250537,4.2038057 17.1079231,4.65206915 C17.3340044,4.86161209 17.4625028,5.15591413 17.4625028,5.46416889 C17.4625028,5.77242366 17.3340044,6.0667257 17.1079231,6.27626864 L7.34174954,15.546492 C7.13811605,15.7348044 7.02233543,15.999573 7.02233543,16.2769322 C7.02233543,16.5542915 7.13811605,16.8190601 7.34174954,17.0073725 C7.77610853,17.4118182 8.44918137,17.4118182 8.88354036,17.0073725 L18.6497139,7.74464085 C19.2822917,7.15617998 19.6416249,6.33113368 19.6416249,5.46716558 C19.6416249,4.60319748 19.2822917,3.77815119 18.6497139,3.18969031 C17.2969099,1.9371026 15.2078331,1.9371026 13.8550291,3.18969031 L4.08885559,12.4554186 C3.02730999,13.442464 2.42425881,14.8266529 2.42425881,16.2761831 C2.42425881,17.7257132 3.02730999,19.1099021 4.08885559,20.0969475 C6.36010056,22.2035633 9.87118271,22.2035633 12.1424277,20.0969475 L21.9086012,10.8312192 C22.3911839,10.3822262 23.1386199,10.3822262 23.6212027,10.8312192 C23.847284,11.0407621 23.9757824,11.3350642 23.9757824,11.6433189 C23.9757824,11.9515737 23.847284,12.2458757 23.6212027,12.4554186 L13.8550291,21.7226453 C12.2998641,23.1798857 10.2445639,23.9844134 8.11339412,23.9703402 Z"
								></path>
							</g>
						</g>
					</svg>
				</button>
				<button
					ref="linkButton"
					v-show="showButton"
					class="ql-link disabled"
					:disabled="disableEmoji"
					v-on:click="linkPopPosition"
					:title="'Link'"
				></button>
				<button
					v-show="showButton"
					:class="['ql-emoji', { disabled: disableEmoji }]"
					:disabled="disableEmoji"
					:title="'Emoji'"
				></button>
				<button
					v-show="showButton"
					v-if="isThreadEditor"
					class="ql-list"
					value="ordered"
					:title="'Ordered List'"
				></button>
				<button
					v-show="showButton"
					v-if="isThreadEditor"
					class="ql-list"
					value="bullet"
					:title="'Bullet List'"
				></button>
				<button
					v-show="showButton"
					v-if="isThreadEditor && null == defaultPost"
					class="q-poll"
					value="bullet"
					v-on:click="buildPoll"
					:title="'Poll'"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="36"
						height="36"
						viewBox="0 0 36 36"
					>
						<path
							d="M6,10a1.8,1.8,0,0,1,2,1.5V24.491a2.082,2.082,0,0,1-4,0V11.5A1.8,1.8,0,0,1,6,10Zm8-8a1.8,1.8,0,0,1,2,1.5V24.491a2.082,2.082,0,0,1-4,0V3.5A1.8,1.8,0,0,1,14,2Zm8,3a1.8,1.8,0,0,1,2,1.5V24.491a2.082,2.082,0,0,1-4,0V6.5A1.8,1.8,0,0,1,21.992,5Zm8,10.993a1.8,1.8,0,0,1,2,1.5v7a2.082,2.082,0,0,1-4,0v-7A1.8,1.8,0,0,1,29.989,16ZM3.411,29.988H32.576a2.121,2.121,0,0,1,0,4H3.411A2.121,2.121,0,0,1,3.411,29.988Z"
						/>
					</svg>
				</button>
				<button
					v-show="showButton"
					v-if="
						isThreadEditor &&
						null == defaultPost &&
						isAdmin &&
						this.$store.getters['Group/showDraw']
					"
					class="q-poll padding_t_4"
					v-on:click="buildDraw"
					:title="'Draw'"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="36"
						height="36"
						viewBox="0 0 36 36"
					>
						<path
							d="M11.2,1.6c2,0,3.7,0.9,4.9,2.3c1.3-1.5,3.1-2.3,5.1-2.3h1.2c3.1,0,5.6,2.5,5.6,5.6c0,0,0,0,0,0V8h0.8c1.8,0,3.2,1.4,3.2,3.2c0,0,0,0,0,0v3.2c0,1.5-1,2.7-2.4,3.1c0,0,0,0.1,0,0.1v9.6c0,1.8-1.4,3.2-3.2,3.2c0,0,0,0,0,0H5.6c-1.8,0-3.2-1.4-3.2-3.2c0,0,0,0,0,0v-9.6l0-0.1C1,17.1,0,15.9,0,14.4v-3.2C0,9.4,1.4,8,3.2,8c0,0,0,0,0,0H4V7.2c0-3.1,2.5-5.6,5.6-5.6c0,0,0,0,0,0H11.2z M14.4,17.6H5.6v9.6h8.8V17.6z M26.4,17.6h-8.8v9.6h8.8V17.6z M4.9,11.2H3.2v3.2h11.2v-3.2H4.9C4.9,11.2,4.9,11.2,4.9,11.2z M28.8,11.2h-1.7v0l-9.5,0v3.2h11.2L28.8,11.2L28.8,11.2z M11.2,4.8H9.6C8.4,4.8,7.3,5.7,7.2,7l0,0.2V8h7.2l0-0.2c-0.1-1.6-1.4-2.8-3-3L11.2,4.8z M22.4,4.8h-1.2c-1.8,0-3.3,1.3-3.6,3.1l0,0.1h7.2V7.2c0-1.2-0.9-2.3-2.2-2.4C22.6,4.8,22.4,4.8,22.4,4.8z"
						/>
					</svg>
				</button>
				<button
					v-show="showButton"
					v-if="
						!this.sendDisabled &&
						!this.disableSign &&
						!isMobile &&
						web3PublicKey
					"
					v-on:click="signContent"
					class="q-poll"
					:title="'Sign'"
				>
					<img class="sign-icon" src="/img/sign.svg" alt="" />
				</button>

				<!-- <button class="ql-video"></button> -->
				<!--                            <select class="ql-size"></select>-->
				<!--            <button class="ql-strike"></button>-->
				<!--            <select class="ql-color"></select>-->
				<!--            <select class="ql-background"></select>-->
				<!--            <select class="ql-font"></select>-->
				<!--            <button class="ql-script" value="sub"></button>-->
				<!--            <button class="ql-script" value="super"></button>-->
				<!--            <button class="ql-header" value="1"></button>-->
				<!--            <button class="ql-header" value="2"></button>-->
				<!--                            <button class="ql-blockquote"></button>-->
				<!--            <button class="ql-code-block"></button>-->
				<!--            <button class="ql-indent" value="-1"></button>-->
				<!--            <button class="ql-indent" value="+1"></button>-->
				<!--            <button class="ql-direction" value="rtl"></button>-->
				<!--            <select class="ql-align"></select>-->
				<!--            <button class="ql-formula"></button>-->
				<!--            <button class="ql-clean"></button>-->
				<button
					v-if="!this.sendDisabled"
					v-on:click="onClearContent"
					class="editor-reset"
					:title="'Clear'"
				>
					<Icons type="shanchu" />
				</button>
			</div>
			<input
				class="image-selector"
				ref="imageSelector"
				type="file"
				multiple="multiple"
				accept="image/*"
				v-on:change="onSelectImage"
				v-on:click="clickImage"
			/>
			<input
				class="attach-selector"
				ref="attachSelector"
				type="file"
				multiple="multiple"
				v-on:change="onSelectAttach"
				v-on:click="checkTier"
			/>
		</div>
		<div v-if="loadingMask" class="loading-mask">
			<div v-if="imageUploadPseudoPercentage" class="progress">
				{{ uploading }}{{ imageUploadingProgress }}&nbsp;{{
					imageUploadPseudoPercentage
				}}%
			</div>
			<div v-else class="progress">{{ imageUploadingProgress }}</div>
			<div class="progress"></div>
		</div>
		<ConfirmModal
			v-if="showSubcriptionModal"
			:reverse-button="false"
			:yes-text="isGroupOwner ? $t('learn_more') : $t('ok')"
			:no-text="$t('ok')"
			:one-button="!isGroupOwner"
			v-on:confirm="showSubcription"
			v-on:cancel="cancelShowAttchTips"
		>
			<div class="confirm-message">
				{{
					!isGroupOwner
						? $t("file_attachment_limit")
						: $t("owner_file_attachment_limit")
				}}
			</div>
		</ConfirmModal>
		<ConfirmModal
			v-if="showAdminMessage"
			:reverse-button="false"
			:yes-text="isGroupOwner ? $t('learn_more') : $t('ok')"
			:no-text="$t('ok')"
			:one-button="!isGroupOwner"
			v-on:confirm="showSubcription"
			v-on:cancel="showAdminMessage = false"
		>
			<div class="confirm-message">
				{{ !isGroupOwner ? $t("only_2m_member") : $t("only_2m_admin") }}
			</div>
		</ConfirmModal>
		<ConfirmModal
			v-if="showImageMessage"
			:reverse-button="false"
			:yes-text="isGroupOwner ? $t('learn_more') : $t('ok')"
			:no-text="$t('ok')"
			:one-button="!isGroupOwner"
			v-on:confirm="showSubcription"
			v-on:cancel="showImageMessage = false"
		>
			<div class="confirm-message">
				{{
					!isGroupOwner
						? $t("image_message_member")
						: $t("image_message_admin")
				}}
			</div>
		</ConfirmModal>
		<!--    <GroupManage-->
		<!--        v-if="showManageGroup"-->
		<!--        v-on:close-create-group="showManageGroup = false"-->
		<!--        :default-key="defaultKey"-->
		<!--    />-->

		<Web3Sign
			:content="signText"
			:onSign="this.onSign"
			:editSign="
				this.defaultPost && this.defaultPost.sign
					? this.defaultPost.sign
					: ''
			"
			:web3PublicKey="this.web3PublicKey"
			:login-type="login_type"
			v-on:on-sign-change="onSignChange"
			ref="web3Sign"
		/>

		<BuildPollModal
			v-if="showBuildPoll"
			:editPoll="this.editPoll"
			v-on:confirm="savePoll"
			v-on:cancel="cancelPoll"
			ref="pollModal"
		>
		</BuildPollModal>

		<BuildDrawModal
			v-if="showBuildDraw"
			:editDraw="lottery"
			v-on:confirm="saveDraw"
			v-on:cancel="cancelDraw"
			ref="drawModal"
		>
		</BuildDrawModal>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Quill from "quill";
import Web3Sign from "@/components/Web3Sign.vue";
import VueScrollBar from "@/components/VueScrollBar.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

import EmojiBlot from "@/emoji/format-emoji-blot";
import ShortNameEmoji from "@/emoji/module-emoji";
import ToolbarEmoji from "@/emoji/module-toolbar-emoji";
import TextAreaEmoji from "@/emoji/module-textarea-emoji";
import { Response } from "@/http/Response";
import {
	UNSUPPORTED_ATTACH_FILES_TYPE,
	SUPPORTED_IMAGE_TYPE,
	COMMON_IMAGE_TYPE,
	bindEvent,
	formatBytes,
	getFileExtension,
	removeEvent,
	removeListItemByIndex,
	sleep,
	StorageLocal,
	LOGIN_TYPE_PHANTOM,
	SIGN_TYPE_POST,
} from "@/helpers/Utils";
import {
	DeltaInterface,
	DeltaOpsInterface,
	GroupFeatureInterface,
	PostInterface,
	postSignInterface,
	LotteryInterface,
	UploadedImageUrl,
} from "@/helpers/Interfaces";
import BuildPollModal from "@/components/BuildPollModal.vue";
import { cloneDeep } from "lodash";
import "quill-mention";
import "quilljs-markdown";
import "quilljs-markdown/dist/quilljs-markdown-common-style.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import BuildDrawModal from "@/components/BuildDrawModal.vue";
import { message } from "ant-design-vue";

declare const QuillMarkdown: any;

export default defineComponent({
	components: {
		BuildDrawModal,
		BuildPollModal,
		ConfirmModal,
		VueScrollBar,
		Web3Sign,
	},
	props: {
		styles: String,
		defaultPost: Object,
		defaultContent: String,
		maxHeight: Number,
		minHeight: Number,
		clearContent: Boolean,
		setFocus: Boolean,
		submitComplete: Boolean,
		mixedContent: Boolean, // whether allow mixed content in post, such as text and images
		isThreadEditor: {
			type: Boolean,
			default: false,
		},
		placeholder: String,
		setDefaultContent: String,
	},
	data() {
		return {
			isMobile: false,
			editorDiv: this.$refs.editorDiv,
			toolbarDiv: this.$refs.toolbarDiv,
			linkButton: this.$refs.linkButton,
			imageSelector: this.$refs.imageSelector,
			attachSelector: this.$refs.attachSelector,
			editorContentDiv: this.$refs.editorContentDiv,

			maxAllowedSize: 25,
			maxAllowImages: 4,
			imageCounter: 0,

			maxAllowedAttachSize: 25,
			freeAttachSize: 2,
			maxAllowAttach: this.isThreadEditor ? 5 : 1,
			// protected maxAllowAttach: number = 5;
			attached_files: [] as any[],

			polls: [] as any[],
			lottery: null as any,
			login_type: parseInt(StorageLocal.getItem("login_type")),

			editor: {} as Quill,
			hasFocus: false,

			sendDisabled: true,
			onSign: false,
			// attachments id
			image_attachments: [] as any[],
			file_attachments: [] as any[],

			sendBtnText: "", //this.$t('send') as string;
			// protected videoModal: boolean = false;
			// protected videoLink: string = '';

			uploadExternalImages: true,
			// the customized scroll bar position
			scrollPos: 0,

			disableImageInsert: false,
			disableAttachFiles: false,
			disableEmoji: false,
			showButton: true,

			showAttachedFiles: false,
			showAdminMessage: false,
			showImageMessage: false,
			showBuildPoll: false,
			showBuildDraw: false,

			deletedAttachedFiles: [] as any[],

			formats: [
				"list",
				"bold",
				"italic",
				"code",
				"italic",
				"size",
				"strike",
				"underline",
				"image",
				"video",
				"link",
				"emoji",
				"mention",
				"header",
				"code",
				"code-block",
			],

			loadingMask: false,
			toLoadedCount: 0,
			totalToLoadedCount: 0,
			imageUploadingProgress: "",
			imageUploadPseudoPercentage: 0,
			imageUploadPseudoCountdown: 0,
			imageUploadProgressAnimation: 0,
			uploading: this.$t("uploading") as string,

			pasting: false,
			showSubcriptionModal: false,
			showManageGroup: false,
			defaultKey: "4",
			signText: [] as DeltaOpsInterface[],
			sign: null as postSignInterface,
			disableSign: false,

			editPoll: null,
		};
	},
	created() {
		if (
			this.$store.getters["GroupExtensions/getAttachmentsStatus"] &&
			this.$store.state.Group.attached_files
		) {
			if (
				parseInt(
					this.$store.state.Group.attached_files.allow_everyone
				) ||
				this.isAdmin
			) {
				if (
					parseInt(
						this.$store.state.Group.attached_files.allow_post
					) ||
					this.isThreadEditor
				) {
					this.showAttachedFiles = true;
				} else {
					this.showAttachedFiles = false;
				}
			} else {
				this.showAttachedFiles = false;
			}
		} else {
			this.showAttachedFiles = false;
		}

		if (this.defaultPost) {
			if (
				this.defaultPost.attached_files &&
				this.defaultPost.attached_files.length
			) {
				for (
					let i = 0;
					i < this.defaultPost.attached_files.length;
					i++
				) {
					this.attached_files.push({
						id: this.defaultPost.attached_files[i].id,
						countDown: 0,
						progress: 0,
						fileObj: this.defaultPost.attached_files[i],
					});
				}
			}
		}

		if (this.isThreadEditor) {
			this.maxAllowImages = 20;
		}

		Quill.register(
			{
				"formats/emoji": EmojiBlot,
				"modules/emoji-shortname": ShortNameEmoji,
				"modules/emoji-toolbar": ToolbarEmoji,
				"modules/emoji-textarea": TextAreaEmoji,
			},
			true
		);
	},
	beforeDestroy() {
		// removeEvent(this.editorDiv, 'drop', this.dropImage as EventListener);
		removeEvent(
			this.$refs.editorDiv as HTMLDivElement,
			"paste",
			this.pasteVideo as EventListener
		);
		removeEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"drop",
			this.dropAttach as EventListener
		);
		removeEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"dragleave",
			this.dragPrevent as EventListener
		);
		removeEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"dragenter",
			this.dragPrevent as EventListener
		);
		removeEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"dragover",
			this.dragPrevent as EventListener
		);

		this.editor.off("selection-change", this.onFocus);
		this.editor.off("text-change", this.onContentChange);
		// remove from memory
		this.editor = {} as Quill;
	},
	computed: {
		groupId() {
			return this.$store.state.Group.id;
		},
		web3PublicKey() {
			return StorageLocal.getItem("login_type") == LOGIN_TYPE_PHANTOM + ""
				? this.$store.state.User.phantom_address
				: this.$store.state.User.web3_public_key;
		},
		adminStatus() {
			return this.$store.getters["GroupExtensions/getFeatureStatus"](
				"adminsAndModerators"
			);
		},
		isAdmin() {
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
		isGroupOwner() {
			return this.$store.getters["User/isGroupAdmin"](
				this.$store.state.Group,
				1,
				1
			);
		},
		plan() {
			return this.$store.state.Group.group_subscription.current_plan;
		},
		allowFileType() {
			return parseInt(
				this.$store.state.Group.attached_files.allow_all_file_type
			);
		},
	},
	mounted() {
		this.buttonText(false);

		let that = this;

		this.editor = new Quill(this.$refs.editorDiv as HTMLDivElement, {
			theme: "snow",
			formats: this.formats,
			modules: {
				"emoji-toolbar": true,
				"emoji-textarea": true,
				"emoji-shortname": true,
				toolbar: {
					container: this.$refs.toolbarDiv as HTMLDivElement,
					handlers: {
						image: () => {
							if (!this.disableImageInsert) {
								(
									this.$refs.imageSelector as HTMLInputElement
								).click();
							}
						},
						// 'emoji': () => {
						//     // console.log('emoji');
						// },
						attach: () => {
							if (!this.disableAttachFiles) {
								(
									this.$refs
										.attachSelector as HTMLInputElement
								).click();
							}
						},
					},
				},
				mention: {
					allowedChars: /^[\s\S]*$/,
					mentionDenotationChars: ["@"],
					minChars: 1,
					// fixMentionsToQuill: false,
					source: async function (searchTerm: any, renderList: any) {
						let metion = await that.suggestPeople(searchTerm);
						renderList(metion);
					},
					renderItem: (item: any) => {
						if (item.target == "u") {
							var html =
								'<div class="mention-div">' +
								'<img class="mention-avatar" src="' +
								item.photo_url +
								'"><span class="mention-text">' +
								item.value +
								"</span></div>";
						} else {
							var html =
								'<div class="mention-div">' +
								'<img class="mention-avatar"  src="/img/mention-topic.png"><span class="mention-text">' +
								item.value +
								"</span></div>";
						}
						return html;
					},
					onSelect: function (item: any, insertItem: any) {
						if (item.target == "t") {
							item.denotationChar = "";
						}
						insertItem(item);
					},
					positioningStrategy: "fixed",
				},
			},
			bounds: "#confined_box",
			placeholder: this.placeholder,
		});

		const markdownOptions = {
			/**
       ignoreTags: [ 'pre', 'strikethrough'], // @option - if you need to ignore some tags.

       tags: { // @option if you need to change for trigger pattern for some tags.
      blockquote: {
        pattern: /^(\|){1,6}\s/g,
      },
      bold: {
        pattern:  /^(\|){1,6}\s/g,
      },
      italic: {
        pattern: /(\_){1}(.+?)(?:\1){1}/g,
      },
    },
       */
		};

		const quillMarkdown = new QuillMarkdown(this.editor, markdownOptions);

		// console.log(this.editor.getLength());

		if (this.defaultPost) {
			const content = {
				ops: JSON.parse(this.defaultPost.content),
			} as any;
			this.editor.setContents(content);
			this.sendDisabled = false;
			this.notAllowMixedContent(content);
			if (this.defaultPost.sign) {
				this.disableAttachFiles = true;
				this.disableEmoji = true;
				this.showButton = false;
				this.editor.disable();
			}
			if (this.defaultPost.user_id != this.$store.state.User.id) {
				this.disableSign = true;
			} else {
				this.disableSign = false;
			}
		} else if (this.defaultContent) {
			const content = { ops: JSON.parse(this.defaultContent) } as any;
			this.editor.setContents(content);
			this.sendDisabled = false;
			this.notAllowMixedContent(content);
		}

		// bindEvent(this.editorDiv, 'drop', this.dropImage as EventListener);
		bindEvent(
			this.$refs.editorDiv as HTMLDivElement,
			"paste",
			this.pasteVideo as EventListener
		);
		bindEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"drop",
			this.dropAttach as EventListener
		);
		bindEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"dragleave",
			this.dragPrevent as EventListener
		);
		bindEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"dragenter",
			this.dragPrevent as EventListener
		);
		bindEvent(
			this.$refs.editorContentDiv as HTMLInputElement,
			"dragover",
			this.dragPrevent as EventListener
		);

		// when editor get focus, the parent box get .focus class
		this.editor.on("selection-change", this.onFocus);
		this.editor.on("text-change", this.onContentChange);

		this.setVideoHeight();
	},
	watch: {
		submitComplete: {
			handler(val: boolean) {
				if (val) {
					this.editor.enable();
					const content = this.editor.getContents() as DeltaInterface;
					if (
						!content ||
						!content.ops ||
						(content.ops.length == 1 &&
							content.ops[0].insert &&
							content.ops[0].insert === "\n")
					) {
						this.sendDisabled = true;
					} else {
						this.sendDisabled = false;
					}
					this.buttonText(false);

					this.disableImageInsert = false;
					this.disableAttachFiles = false;
					this.disableEmoji = false;
					this.showButton = true;
					this.uploadImage();
				}
			},
		},
	},
	methods: {
		buttonText(sending: boolean) {
			if (sending) {
				this.sendBtnText = this.defaultPost
					? (this.$t("saving") as string)
					: (this.$t("sending") as string);
			} else {
				this.sendBtnText = this.defaultPost
					? (this.$t("save") as string)
					: (this.$t("send") as string);
			}
		},
		async suggestPeople(searchTerm: string) {
			let allPeople: object[] = [];
			await this.$store
				.dispatch("Mention/search", { search: searchTerm })
				.then((response: Response) => {
					response.getData()["list"].forEach((item: any) => {
						// console.log(item);
						allPeople.push(item);
					});
				})
				.catch(() => {
					//error
				})
				.finally(() => {
					//do
				});

			return allPeople;
		},
		setVideoHeight() {
			const boxWidth: number = (
				this.$refs.editorDiv as HTMLDivElement
			).getBoundingClientRect().width;
			const videoHeight: number = Math.ceil((boxWidth * 9) / 16);
			const videoIframes: NodeList = (
				this.$refs.editorDiv as HTMLDivElement
			).querySelectorAll(".ql-video");

			for (let i = 0; i < videoIframes.length; i++) {
				(videoIframes[i] as HTMLIFrameElement).setAttribute(
					"style",
					"height: " + videoHeight + "px;"
				);
			}
		},
		/**
		 * when click on editor's box, set the focus to editor
		 */
		onClickContainer() {
			if (!this.editor.hasFocus()) {
				this.editor.focus();
			}
		},
		clickImage(e: any) {
			const content = this.editor.getContents() as DeltaInterface;
			if (
				!content ||
				!content.ops ||
				(content.ops.length == 1 &&
					content.ops[0].insert &&
					content.ops[0].insert === "\n")
			) {
				if (this.attached_files.length && !this.isThreadEditor) {
					e.preventDefault();
					message.error(this.$t("uploaded_image_attach") as string);
					return;
				}
			} else {
				if (!this.isThreadEditor) {
					e.preventDefault();
					message.error(this.$t("uploaded_image_empty") as string);
					return;
				}
			}
		},
		/**
		 * when editor blur, remove 'focus' class from container
		 * @param range
		 */
		onFocus(
			range: undefined | { index: number; length: number },
			oldRange: undefined | { index: number; length: number },
			source: string
		) {
			this.hasFocus = !!range;

			if (!this.hasFocus && this.sendDisabled) {
				this.onCloseEditor();
			}

			if (
				source === "user" &&
				range &&
				range.length &&
				!this.disableEmoji
			) {
				(this.$refs.linkButton as HTMLButtonElement).classList.remove(
					"disabled"
				);
			} else {
				(this.$refs.linkButton as HTMLButtonElement).classList.add(
					"disabled"
				);
			}
		},
		/**
		 * on content change, if content empty, disable send
		 */
		onContentChange(
			delta: DeltaInterface,
			oldContents: DeltaInterface,
			source: String
		) {
			if (source === "api") {
				return;
			}

			const content = this.editor.getContents() as DeltaInterface;
			if (
				!content ||
				!content.ops ||
				(content.ops.length == 1 &&
					content.ops[0].insert &&
					content.ops[0].insert === "\n")
			) {
				this.sendDisabled = true;
				// when it is cleared
				this.editor.enable();
				this.disableImageInsert = false;
				this.disableAttachFiles = false;
				this.disableEmoji = false;
				this.showButton = true;
				this.uploadImage();
			} else {
				if (!this.isThreadEditor) {
					// this.disableImageInsert = true;
				} else {
					this.disableImageInsert = false;
				}
				this.sendDisabled = false;
			}
			// when we not allow mixed content
			this.notAllowMixedContent(content);

			if (content.ops.length > 5000) {
				this.sendDisabled = true;
			}
		},
		/**
		 * not allow mixed content in comments
		 */
		notAllowMixedContent(content: DeltaInterface) {
			let clean = true;
			this.imageCounter = 0;
			// when we not allow mixed content
			if (content.ops.length) {
				for (let i = 0; i < content.ops.length; i++) {
					if (
						typeof content.ops[i].insert === "string" &&
						content.ops[i].insert !== "\n"
					) {
						// it means we got some text
						// if (!this.isThreadEditor) {
						//     this.disableImageInsert = true;
						// }
						// console.log(content.ops[i].insert);
					} else if (
						typeof content.ops[i].insert === "object" &&
						content.ops[i].insert.image
					) {
						if (!this.isThreadEditor && clean) {
							// this.editor.disable();
							this.removeTextFromContent(content);
							this.disableAttachFiles = true;
							this.disableEmoji = true;
							this.showButton = false;
							this.editor.disable();
							this.uploadImage();
							clean = false;
						}

						this.imageCounter += 1;
					}
				}
			}

			if (this.disableImageInsert == false) {
				if (this.imageCounter >= this.maxAllowImages) {
					this.disableImageInsert = true;
				} else {
					this.disableImageInsert = false;
				}
			}
		},

		removeTextFromContent(content: DeltaInterface) {
			let newcontent = cloneDeep(content);
			let setNew: boolean = false;
			if (content.ops.length && !this.mixedContent) {
				for (let i = 0; i < content.ops.length; i++) {
					if (
						typeof content.ops[i].insert === "string" &&
						content.ops[i].insert !== "\n"
					) {
						removeListItemByIndex(newcontent.ops, i);
						setNew = true;
					}
				}
			}

			if (setNew) {
				this.editor.setContents(newcontent as any);
			}
		},
		/**
		 * select images from local system
		 */
		onSelectImage(e: Event) {
			if (
				(this.$refs.imageSelector as HTMLInputElement).files &&
				(this.$refs.imageSelector as HTMLInputElement).files.length
			) {
				this.toLoadedCount =
					(this.imageSelector as any).files.length +
						this.imageCounter >=
					this.maxAllowImages
						? this.maxAllowImages - this.imageCounter
						: (this.imageSelector as any).files.length;

				if (this.toLoadedCount <= 0) {
					return;
				}

				this.totalToLoadedCount = this.toLoadedCount;
				this.loadingMask = true;
				this.uploading = this.$t("uploading") as string;
				this.imageUploadingProgress = this.$t(
					"uploading_image_progress",
					{
						count:
							this.totalToLoadedCount -
							this.toLoadedCount +
							1 +
							" of " +
							this.totalToLoadedCount,
					}
				) as string;
				this.readImages(
					(this.$refs.imageSelector as HTMLInputElement).files,
					this.insertDroppedImage
				);
			}
		},
		/**
		 * drop image event listener
		 * @param e
		 */
		dropImage(e: DragEvent) {
			e.preventDefault();
			if (
				e.dataTransfer &&
				e.dataTransfer.files &&
				e.dataTransfer.files.length
			) {
				if (this.disableImageInsert) {
					return;
				}

				this.toLoadedCount =
					e.dataTransfer.files.length + this.imageCounter >=
					this.maxAllowImages
						? this.maxAllowImages - this.imageCounter
						: e.dataTransfer.files.length;

				if (this.toLoadedCount <= 0) {
					return;
				}

				this.totalToLoadedCount = this.toLoadedCount;

				this.loadingMask = true;
				this.uploading = this.$t("uploading") as string;
				this.imageUploadingProgress = this.$t(
					"uploading_image_progress",
					{
						count:
							this.totalToLoadedCount -
							this.toLoadedCount +
							1 +
							" of " +
							this.totalToLoadedCount,
					}
				) as string;
				this.readImages(e.dataTransfer.files, this.insertDroppedImage);
			}
		},
		dropAttach(e: DragEvent): void {
			e.preventDefault();

			//if the current content is image
			if (!this.isThreadEditor) {
				if (this.imageCounter > 0) {
					message.error(
						this.$t(
							"Adding more images is not supported."
						) as string
					);
					return;
				}

				if (this.attached_files.length > 0) {
					message.error(this.$t("uploaded_image_attach") as string);
					return;
				}

				const content = this.editor.getContents() as DeltaInterface;
				if (
					!content ||
					!content.ops ||
					(content.ops.length == 1 &&
						content.ops[0].insert &&
						content.ops[0].insert === "\n")
				) {
				} else {
					message.error(this.$t("uploaded_image_empty") as string);
					return;
				}
			}

			if (
				e.dataTransfer &&
				e.dataTransfer.files &&
				e.dataTransfer.files.length
			) {
				let allImage = true;
				for (let i = 0; i < e.dataTransfer.files.length; i++) {
					if (
						!e.dataTransfer.files[i].type.match(COMMON_IMAGE_TYPE)
					) {
						allImage = false;
					}
				}
				if (allImage) {
					//if have content
					if (this.disableImageInsert) {
						this.readAttachedFiles(e.dataTransfer.files);
					} else {
						this.dropImage(e);
					}
				} else {
					this.readAttachedFiles(e.dataTransfer.files);
				}
			}
		},

		dragPrevent(e: DragEvent): void {
			e.stopPropagation();
			e.preventDefault();
		},

		getVideoUrl(url: string): string {
			const regExpYT =
				/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
			const regExpVM = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
			const regExDM =
				/https?:\/\/(www\.)?dailymotion\.com\/video\/([\w\d]+)/;
			let match: RegExpMatchArray | null = [];

			if ((match = url.match(regExpYT))) {
				const videoID: string | null =
					match && match[2].length === 11 ? match[2] : null;

				return videoID
					? "https://www.youtube.com/embed/" + videoID
					: "";
			} else if ((match = url.match(regExpVM))) {
				const videoID = match && match[2].length > 0 ? match[2] : null;

				return videoID
					? "https://player.vimeo.com/video/" + videoID
					: "";
			} else if ((match = url.match(regExDM))) {
				const videoID = match && match[2].length > 0 ? match[2] : null;

				return videoID
					? "//www.dailymotion.com/embed/video/" + videoID
					: "?autoplay=1&mute=1";
			}

			return "";
		},

		loadImage(file: any) {
			let reader = new FileReader();
			reader.onload = function (e: any) {
				const img = document.createElement("img");
				if (img) {
					img.src = e.target.result;
				}
				const range = (window as any).getSelection().getRangeAt(0);
				if (range) {
					range.deleteContents();
					range.insertNode(img);
				}
			};
			reader.readAsDataURL(file);
		},

		pasteVideo(e: ClipboardEvent): void {
			this.pasting = true;

			const paste = (
				e.clipboardData || (window as any).clipboardData
			).getData("text");
			let items = null;
			if (e.clipboardData) {
				items = e.clipboardData.items;
			}

			if (paste === "" && this.disableImageInsert) {
				e.preventDefault();
				return;
			}

			// 10 is just a random threshold, if it's too short, it's unlikely a video link
			if (
				paste &&
				typeof paste === "string" &&
				paste.length > 10 &&
				!this.disableImageInsert
			) {
				const videoUrl = this.getVideoUrl(paste.trim());

				if (videoUrl) {
					e.preventDefault();

					let index = this.editor.getLength();
					// if user has focused in the editor
					const range = this.editor.getSelection(true);
					// get the caret position
					if (range) {
						index = range.index;
					}

					this.editor.insertEmbed(index, "video", videoUrl, "user");

					this.setVideoHeight();
				}
				// todo, append url card
				// if (paste.substring(0, 4) === 'http') {
				//     console.log(paste);

				//     const img = document.createElement('img');

				//     img.setAttribute('src', 'fasd fads');

				//     document.activeElement.appendChild(img);
				// }
			}

			if (items) {
				if (SUPPORTED_IMAGE_TYPE.test(items[items.length - 1].type)) {
					e.preventDefault();
					if (!this.disableImageInsert) {
						this.loadImage(items[items.length - 1].getAsFile());
					}
					return;
				}
			}
		},

		readImages(
			files: FileList | DataTransferItemList,
			callback: EventListener
		): void {
			[].forEach.call(files, (file: File) => {
				if (!file.size) {
					message.error(this.$t("uploaded_file_empty") as string);
					this.loadingMask = false;
					return;
				}

				if (file.size > this.maxAllowedSize * 1048576) {
					message.error(
						this.$t("uploaded_file_exceed_max_size", [
							this.maxAllowedSize,
							(file.size / 1048576).toFixed(2),
						]) as string
					);
					this.loadingMask = false;
					return;
				}

				// if (!file.type.match(SUPPORTED_IMAGE_TYPE)) {
				//     // file is not an image
				//     // Note that some file formats such as psd start with image/* but are not readable
				//     // todo add allowed extension
				//     message.error(this.$t('uploaded_file_type_not_allowed', [file.type]) as string);
				//     this.loadingMask = false;
				//     return;
				// }

				if (!file.type.match(COMMON_IMAGE_TYPE)) {
					// only support the common image type
					// todo add allowed extension
					message.error(
						this.$t("uploaded_file_type_not_allowed", [
							file.type,
						]) as string
					);
					this.loadingMask = false;
					return;
				}

				const reader = new FileReader();

				bindEvent(reader, "load", callback);

				reader.readAsDataURL(file);
			});
		},

		insertDroppedImage(e: Event): void {
			this.imageCounter += 1;
			if (this.imageCounter > this.maxAllowImages) {
				return;
			}

			if (this.imageUploadProgressAnimation) {
				cancelAnimationFrame(this.imageUploadProgressAnimation);

				this.imageUploadPseudoPercentage = 0;
			}

			this.imageUploadProgress();

			// base64 encoded file data
			const dataUrl = (e.target as FileReader).result;

			this.$store
				.dispatch("Attachment/uploadAttach", { dataUrl: dataUrl })
				.then((uploadedUrl: UploadedImageUrl) => {
					if (uploadedUrl.id) {
						this.image_attachments.push(uploadedUrl.id);

						this.insertEditor(uploadedUrl.url as string);

						this.toLoadedCount -= 1;
						this.uploading = this.$t("uploading") as string;
						this.imageUploadingProgress = this.$t(
							"uploading_image_progress",
							{
								count:
									this.totalToLoadedCount -
									this.toLoadedCount +
									" of " +
									this.totalToLoadedCount,
							}
						) as string;
					}
				})
				.catch(() => {
					// when upload failed, just ignore it
					this.toLoadedCount -= 1;
				})
				.finally(() => {
					if (this.toLoadedCount <= 0) {
						this.loadingMask = false;

						this.totalToLoadedCount = 0;

						this.imageUploadPseudoPercentage = 100;

						// auto submit immediately
						// if (!this.isThreadEditor) {
						//     this.prepareData(null);
						// }
					}
					if (this.plan == "starter") {
						if (this.isGroupOwner) {
							let k = "showImageTips:groupId:" + this.groupId;
							let isShow = localStorage.getItem(k);
							if (this.plan == "starter" && !isShow) {
								localStorage.setItem(k, "no");
								this.showImageMessage = true;
							}
						}
					}
				});
		},

		imageUploadProgress() {
			// console.log(this.attached_files[fileIndex]);
			this.imageUploadProgressAnimation = requestAnimationFrame(() => {
				this.imageUploadProgress();
			});

			this.imageUploadPseudoCountdown += 1;

			if (this.imageUploadPseudoCountdown % 6 == 0) {
				if (this.imageUploadPseudoPercentage >= 99) {
					this.imageUploadPseudoPercentage += 1;
				} else {
					this.imageUploadPseudoPercentage += 3;
				}
			}

			if (this.imageUploadPseudoPercentage >= 100) {
				this.uploading = this.$t("processing") as string;
				cancelAnimationFrame(this.imageUploadProgressAnimation);
			}
		},

		insertEditor(dataUrl: string): void {
			// default insert position is the end of the content
			let index = this.editor.getLength();
			// if user has focused in the editor
			const range = this.editor.getSelection();
			// get the caret position
			if (range) {
				index = range.index;
			}
			this.editor.enable();

			this.editor.insertEmbed(index, "image", dataUrl, "user");
			// set editor coursor after the image
			this.$nextTick(() => {
				this.editor.setSelection((range!.index as any) + 1);
			});
		},

		assignImageAttributes(
			blot: any,
			attributes: any,
			imageObject: HTMLImageElement
		) {
			// if quill can't handle the extra attributes,
			// we will have to figure out something else
			blot.attributes = {
				thumb_url: attributes.thumb_url ? attributes.thumb_url : "",
				id: attributes.id ? attributes.id : "",
				width: imageObject.width,
				height: imageObject.height,
			};
		},

		onSelectAttach(e: Event) {
			if (
				(this.$refs.attachSelector as HTMLInputElement).files &&
				(this.$refs.attachSelector as HTMLInputElement).files.length
			) {
				this.readAttachedFiles(
					(this.$refs.attachSelector as HTMLInputElement).files
				);
			}
		},

		removeAttachedFiles(attach_index: number) {
			if (
				this.attached_files[attach_index] &&
				this.attached_files[attach_index].id
			) {
				this.deletedAttachedFiles.push(
					this.attached_files[attach_index].id
				);
			}

			this.file_attachments = this.file_attachments.filter(
				(item) => item != this.attached_files[attach_index].id
			);
			// console.log(this.file_attachments, this.attached_files[attach_index].id);
			removeListItemByIndex(this.attached_files, attach_index);

			if (!this.attached_files.length) {
				const content = this.editor.getContents() as DeltaInterface;

				if (
					!content ||
					!content.ops ||
					(content.ops.length == 1 &&
						content.ops[0].insert &&
						content.ops[0].insert === "\n")
				) {
					this.disableImageInsert = false;
				}
				this.disableAttachFiles = false;
			}
		},

		readAttachedFiles(files: FileList | DataTransferItemList): void {
			[].forEach.call(files, (file: File) => {
				if (!file.size) {
					message.error(this.$t("uploaded_file_empty") as string);
					return;
				}
				if (
					this.plan == "starter" &&
					file.size > this.freeAttachSize * 1048576
				) {
					this.showAdminMessage = true;
					return;
				}

				if (file.size > this.maxAllowedAttachSize * 1048576) {
					message.error(
						this.$t("uploaded_file_exceed_max_size", [
							this.maxAllowedAttachSize,
							(file.size / 1048576).toFixed(2),
						]) as string
					);
					return;
				}

				if (
					UNSUPPORTED_ATTACH_FILES_TYPE.indexOf(
						getFileExtension(file.name).toUpperCase()
					) !== -1
				) {
					// file is not an image
					// Note that some file formats such as psd start with image/* but are not readable
					// todo add allowed extension
					message.error(
						this.$t("uploaded_file_type_not_allowed", [
							getFileExtension(file.name),
						]) as string
					);
					return;
				}

				// let res = this.checkFileAuth(file.type);
				// if( !res ){
				//   return;
				// }

				this.insertAttachedFiles(file);
			});
		},

		checkFileAuth(mimeType: string): boolean {
			if (this.allowFileType == 1) {
				if (
					this.plan == "starter" &&
					!mimeType.match(SUPPORTED_IMAGE_TYPE) &&
					mimeType != "application/pdf"
				) {
					// file is not an image
					// Note that some file formats such as psd start with image/* but are not readable
					// todo add allowed extension
					message.error(this.$t("only_pdf_image") as string);
					return false;
				}
			} else {
				if (
					!mimeType.match(SUPPORTED_IMAGE_TYPE) &&
					mimeType != "application/pdf"
				) {
					message.error(this.$t("only_pdf_image") as string);
					return false;
				}
			}
			return true;
		},

		insertAttachedFiles(file: File): void {
			if (this.attached_files.length >= this.maxAllowAttach) {
				message.error(
					this.$t("max_allowed_attached_files", {
						max_allowed: this.maxAllowAttach,
					}) as string
				);
				return;
			}
			// todo upload images
			this.attached_files.push({
				id: 0,
				countDown: 0,
				progress: 0,
				fileObj: file,
			});

			this.uploadProgress(this.attached_files.length - 1);
			if (!this.isThreadEditor) {
				// if there are attatched files, disable inline image
				// this.disableImageInsert = true;
				this.disableAttachFiles = true;
			}
			this.$store
				.dispatch("Attachment/uploadAttachedFiles", file)
				.then((response: Response) => {
					const data = response.getData();

					if (response.getCode() == "40082") {
						this.removeAttachedFiles(
							this.attached_files.length - 1
						);
						this.showAdminMessage = true;
						// if (this.isAdmin) {
						//     message.error(this.$t('only_2m_admin'));
						// } else {
						//     message.error(this.$t('only_2m_member'));
						// }
						return;
					}

					for (let i = 0; i < this.attached_files.length; i++) {
						if (file === this.attached_files[i].fileObj) {
							this.attached_files[i].progress = 100;
							if (data && data.attached_file_id) {
								this.attached_files[i].id =
									data.attached_file_id;
							}
						}
					}

					if (data && data.attached_file_id) {
						this.file_attachments.push(data.attached_file_id);

						// we can submit attached files alone
						this.sendDisabled = false;
					}

					// auto submit immediately
					// if (!this.isThreadEditor) {
					//     this.prepareData(null);
					// }
				});
		},

		uploadProgress(fileIndex: number) {
			if (!this.attached_files[fileIndex]) {
				return;
			}
			// console.log(this.attached_files[fileIndex]);
			const animation = requestAnimationFrame(() => {
				this.uploadProgress(fileIndex);
			});

			if (!this.attached_files[fileIndex].countDown) {
				this.attached_files[fileIndex].countDown = 1;
			} else {
				this.attached_files[fileIndex].countDown += 1;
			}

			if (this.attached_files[fileIndex].countDown % 6 == 0) {
				if (!this.attached_files[fileIndex].progress) {
					this.attached_files[fileIndex].progress = 3;
				} else {
					this.attached_files[fileIndex].progress += 3;
				}
			}

			if (this.attached_files[fileIndex].progress >= 99) {
				cancelAnimationFrame(animation);
			}
		},

		sizeDisplay(bytes: number) {
			return formatBytes(bytes);
		},

		async prepareData(e: KeyboardEvent | MouseEvent | null) {
			if (e instanceof KeyboardEvent && !e.ctrlKey) {
				return;
			}

			const content = this.editor.getContents() as DeltaInterface;

			if (
				!content ||
				!content.ops ||
				(content.ops.length == 1 &&
					content.ops[0].insert &&
					content.ops[0].insert === "\n")
			) {
				if (this.file_attachments.length == 0) {
					return;
				} else {
					content.ops[0].insert = "";
				}
			}

			for (let i = 0; i < content.ops.length; i++) {
				if (content.ops[i].insert && content.ops[i].insert.image) {
					let base64Data: string = "";

					const imageObj = new Image();

					if (content.ops[i].insert.image.search(/^https?/) !== 0) {
						base64Data = content.ops[i].insert.image;
						imageObj.src = content.ops[i].insert.image;

						// we are not going to re-submit cdn files
					} else if (
						this.uploadExternalImages &&
						content.ops[i].insert.image.search(
							/cdn.everforo.com/
						) === -1 &&
						content.ops[i].insert.image.search(
							/tapatalk-cdn.com/
						) === -1
					) {
						// if it's an external link image, try to get the file content and upload it
						// const xhr = new XMLHttpRequest();
						// xhr.onload = () => {
						//     const reader = new FileReader();
						//     reader.onloadend = () => {
						//         base64Data = reader.result as string;
						//     }
						//     reader.readAsDataURL(xhr.response);
						// };
						// xhr.open('GET', content.ops[i].insert.image);
						// xhr.responseType = 'blob';
						// xhr.send();

						imageObj.crossOrigin = "anonymous";
						// image.crossOrigin = 'use-credentials';
						// create an empty canvas element
						const canvas = document.createElement("canvas");
						const canvasContext = canvas.getContext("2d");

						imageObj.onload = function () {
							//Set canvas size is same as the picture
							canvas.width = imageObj.width;
							canvas.height = imageObj.height;

							// draw image into canvas element
							canvasContext!.drawImage(
								imageObj,
								0,
								0,
								imageObj.width,
								imageObj.height
							);

							// get canvas contents as a data URL (returns png format by default)
							base64Data = canvas.toDataURL();
						};

						imageObj.src = content.ops[i].insert.image;

						// wait maximum 5 seconds
						for (let j = 0; j < 50; j++) {
							if (base64Data) {
								break;
							}
							await sleep(100);
						}
						// if we don't get the file in 5 seconds, we give up uploading the image, juts use the external link
						if (!base64Data) {
							continue;
						}
					}

					if (base64Data.length > this.maxAllowedSize * 1048576) {
						message.error(
							this.$t("uploaded_file_exceed_max_size", [
								this.maxAllowedSize,
								(base64Data.length / 1048576).toFixed(2),
							]) as string
						);
						return;
					}

					if (base64Data) {
						// message.info(this.$t('image_uploading') as string);

						let uploadedUrl: UploadedImageUrl =
							await this.$store.dispatch(
								"Attachment/uploadAttach",
								{ dataUrl: base64Data }
							);

						if (uploadedUrl.id) {
							this.image_attachments.push(uploadedUrl.id);

							content.ops[i].insert.image = uploadedUrl.url;

							this.assignImageAttributes(
								content.ops[i],
								uploadedUrl,
								imageObj
							);

							// message.success(this.$tc('image_uploaded', i, {n: i}) as string);
						}
					}
				}
				// this will eliminate the new line (\n), I don't know why we have this code at thew first place
				// if (content.ops[i].insert && typeof content.ops[i].insert === 'string'){
				// content.ops[i].insert = content.ops[i].insert.trim();
				// }
			}

			this.onSubmit(content.ops);
		},

		onSubmit(content: any[]) {
			const data = new FormData();

			data.append("content", JSON.stringify(content));

			if (this.image_attachments.length) {
				data.append(
					"image_attachments",
					this.image_attachments.join(",")
				);
			}

			if (this.file_attachments.length) {
				data.append(
					"file_attachments",
					this.file_attachments.join(",")
				);
			}

			if (this.deletedAttachedFiles.length) {
				data.append(
					"deleted_attached_files",
					this.deletedAttachedFiles.join(",")
				);
			}

			if (this.polls.length) {
				data.append("polls", JSON.stringify(this.polls));
			}

			if (this.lottery) {
				data.append("lottery", JSON.stringify(this.lottery));
			}

			this.sendDisabled = true;
			this.buttonText(true);
			this.imageCounter = 0;
			// console.log()
			if (null == this.sign || this.sign.sign == "") {
				(this.$refs.web3Sign as any).setSignMsg(content);
				data.append("sign", "");
				data.append(
					"signMsg",
					JSON.stringify((this.$refs.web3Sign as any).msg)
				);
			} else {
				data.append("sign", this.sign.sign);
				data.append("signMsg", this.sign.signMsg);
			}

			this.$emit("on-submit", data);
		},

		onCloseEditor() {
			/**
			 * when there is no content, blur trigger close editor
			 */
			this.$emit("close-editor");
		},

		uploadImage() {
			this.$emit("upload-image", this.showButton);
		},

		linkPopPosition() {
			setTimeout(() => {
				const tip = document.querySelector(
					".ql-tooltip.ql-editing.ql-flip"
				) as HTMLDivElement;

				const left = parseInt(tip.style.left);
				const top = parseInt(tip.style.top);

				if (left < 0) {
					tip.style.left = "0";
				}

				if (top < 0) {
					tip.style.top = "10px";
				}
			}, 0);
		},

		buildPoll() {
			this.showBuildPoll = !this.showBuildPoll;
		},

		buildDraw() {
			this.showBuildDraw = !this.showBuildDraw;
		},

		checkTier(e: Event) {
			// let k = "showAttachTips:groupId:"+this.groupId;
			// let isShow = localStorage.getItem(k)
			// if( this.plan == "starter" && !isShow ){
			//     localStorage.setItem(k,"no")
			//     this.showSubcriptionModal = true
			//     e.preventDefault()
			// }
		},

		showSubcription() {
			this.showSubcriptionModal = false;
			this.showAdminMessage = false;
			this.showImageMessage = false;
			if (!this.isGroupOwner) {
				return;
			}
			this.onShowGroupManage();
		},

		onShowGroupManage() {
			this.showManageGroup = true;
		},

		cancelShowAttchTips() {
			this.showSubcriptionModal = false;
		},

		signContent() {
			const content = this.editor.getContents() as DeltaInterface;
			if (content && content.ops && !this.sign) {
				(this.$refs.web3Sign as any).setSignMsg(content.ops);
				(this.$refs.web3Sign as any).setSignTitle(SIGN_TYPE_POST);
				this.onSign = true;
				this.disableAttachFiles = true;
				this.disableEmoji = true;
				this.showButton = false;
				this.editor.disable();
				this.$nextTick(() => {
					this.onSign = false;
				});
			}
		},

		removeSign() {
			this.onSignChange(null);
		},

		onSignChange(sign: postSignInterface | any) {
			if (sign == null) {
				this.sign = null;
				this.disableAttachFiles = false;
				this.disableEmoji = false;
				this.showButton = true;
				this.editor.enable();
				this.notAllowMixedContent(
					this.editor.getContents() as DeltaInterface
				);
			} else {
				this.sign = sign;
			}
			// console.log('on-sign-change:'+ sign);
		},

		savePoll() {
			var modal = (this.$refs as any).pollModal;

			var opt_ary = [];
			// checkOptions
			if (modal.chartType != "3") {
				for (var i = 0; i < modal.options.length; i++) {
					if (modal.PollCategory !== "0") {
						opt_ary.push(modal.options[i].text);
					} else {
						if (modal.options[i].text != "") {
							opt_ary.push(modal.options[i].text);
						}
					}
				}
				if (opt_ary.length <= 1) {
					message.error("too few options");
					return;
				}
			}

			var max = modal.max;

			//single choic
			if (modal.type == "1") {
			} else if (modal.type == "2") {
				if (max > modal.options.length) {
					message.error("Max Choices too large");
				}
			} else if (modal.type == "3") {
			}

			if (modal.voteType == "2") {
				if (modal.token_address == "") {
					message.error("Please enter Token address.");
					return;
				}
				if (modal.token_address != "" && modal.token_icon == "") {
					message.error("Token address is not valid.");
					return;
				}
				if (modal.min_tokens == 0) {
					message.error("Please enter Token Threshold.");
					return;
				}
			}

			if (modal.voteType == "3") {
				if (modal.token_address == "") {
					message.error("Please enter NFT collection address.");
					return;
				}
				if (modal.token_address != "" && modal.token_icon == "") {
					message.error("Invalid NFT collection address.");
					return;
				}
			}

			if (modal.close_at == "") {
				message.error("Please enter poll close time.");
				return;
			}

			if (new Date().getTime() > new Date(modal.close_at).getTime()) {
				message.error("Please set a future time.");
				return;
			}

			if (modal.pollsIndex == -1) {
				this.polls.push({
					options: modal.options,
					type: modal.type,
					title: modal.title,
					showType: modal.showType,
					showResult: modal.showResult,
					chartType: modal.chartType,
					voteType: modal.voteType,
					period: modal.period,
					close_at: modal.close_at,
					max: max,
					min_tokens: modal.min_tokens,
					token_address: modal.token_address,
					token_icon: modal.token_icon,
					token_image: modal.token_image,
					PollCategory: modal.PollCategory,
					LastCategroyChange: modal.LastCategroyChange,
					poll_category: modal.poll_category,
				});
			} else {
				this.polls[modal.pollsIndex] = {
					options: modal.options,
					type: modal.type,
					title: modal.title,
					showType: modal.showType,
					showResult: modal.showResult,
					chartType: modal.chartType,
					voteType: modal.voteType,
					period: modal.period,
					close_at: modal.close_at,
					max: max,
					min_tokens: modal.min_tokens,
					token_address: modal.token_address,
					token_icon: modal.token_icon,
					token_image: modal.token_image,
					PollCategory: modal.PollCategory,
					LastCategroyChange: modal.LastCategroyChange,
					poll_category: modal.poll_category,
				};
			}

			modal.resetData();
			this.editPoll = null;
			this.showBuildPoll = false;
		},

		cancelPoll() {
			this.showBuildPoll = false;
			this.editPoll = null;
			var modal = (this.$refs as any).pollModal;
			modal.resetData();
		},

		removePoll(index: number) {
			this.polls.splice(index, 1);
			this.editPoll = null;
		},

		pollEdit(index: number) {
			// var modal = (this.$refs as any).pollModal;
			// console.log(modal);
			// modal.setPollData(this.polls[index]);
			this.polls[index].pollsIndex = index;
			this.editPoll = this.polls[index];
			this.showBuildPoll = true;
		},

		saveDraw() {
			const modal = (this.$refs as any).drawModal;

			if (modal.name == "") {
				message.error("Please input the draw name!");
				return;
			}
			if (modal.end_time == "") {
				message.error("Please set a draw date!");
				return;
			}
			if (parseInt(modal.winners_count) > 10) {
				message.error("Max number of winners is 10");
				return;
			}
			if (parseInt(modal.winners_count) <= 0) {
				message.error("Minimum number of winners is 1");
				return;
			}

			this.lottery = {
				end_time: modal.end_time,
				winners_count: modal.winners_count,
				name: modal.name,
				desc: modal.desc,
				max: modal.max,
			};
			this.showBuildDraw = false;
		},

		drawEdit() {
			this.showBuildDraw = true;
		},

		removeDraw() {
			this.lottery = null;
		},

		cancelDraw() {
			this.showBuildDraw = false;
			this.editPoll = null;
			// var modal = (this.$refs as any).drawModal;
			// modal.resetData();
		},
	},
});
</script>

<style lang="scss" scoped>
/* manually import quill editor style */
/*@import '~quill/dist/quill.core.css';*/
/*@import '~quill/dist/quill.snow.css';*/

.ql-container.ql-snow,
.ql-toolbar.ql-snow {
	border: 0;
}

.mobile {
	.ql-container.ql-snow {
		min-height: 120px;
	}
}

.ql-container.ql-snow {
	min-height: 150px;
}

.ql-container {
	@include content_font;
	font-family: inherit;
}

.editor-box {
	position: relative;

	// &:not(.mobile) {
	border: $border-width $border-style var(--border-color5);
	border-radius: $border-radius1;
	@include transition(all);

	&.focus {
		border-color: var(--theme-color);
		box-shadow: $box-shadow-focus;
	}
	// }

	// &.mobile {
	//     .scrollbar-wrap {
	//         // background-color: var(--input-bg);
	//     }
	// }

	.attach-block {
		position: relative;
		width: 90%;
		height: 30px;
		margin: 0 0 var(--p2) var(--p4);
		padding: 0 var(--p2);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--input-bg);
		border: $border-width $border-style var(--border-color5);

		.name-size {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			max-width: 80%;
			span:first-child {
				display: inline-block;
				max-width: 70%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			span:last-child {
				margin-left: var(--p2);
			}
		}

		.ico {
			font-size: $font-size0;
			cursor: pointer;
		}

		.poll_svg,
		.star_svg,
		.pie_svg {
			cursor: none;
		}
		.star_svg {
			height: 0.8rem;
		}
	}

	.toolbar-box {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding: var(--p3) var(--p4) var(--p3) var(--p4);

		.reset {
			@include capitalize;
			margin-right: var(--p6);
			font-weight: $title-weight;
			order: 1;
		}

		.send {
			@include capitalize;
			margin-right: var(--p4);
			font-weight: $title-weight;
			order: 2;
			border-radius: 4px;
			padding-left: var(--p8);
			padding-right: var(--p8);
		}

		.ql-toolbar {
			display: inline-block;
			padding: 0;
			order: 3;
			flex-grow: 1;

			button.disabled {
				opacity: 0.5;
			}

			.ql-attach {
				svg {
					width: 14px;
					height: 14px;
					g {
						fill: var(--font-color2);
					}
				}
			}

			.ql-attach:hover {
				svg {
					width: 14px;
					height: 14px;
					g {
						fill: #0066cc;
					}
				}
			}
		}
	}

	.q-poll {
		svg {
			width: 18px;
			height: 18px;
			//stroke: var(--font-color2);
			fill: var(--font-color2);
		}
		svg:hover {
			fill: #3d72de;
		}
	}

	.divider {
		height: 1px;
		margin-left: var(--p4);
		margin-right: var(--p4);
		background: var(--border-color5);
	}

	.image-selector,
	.attach-selector {
		display: none;
	}

	.loading-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: $mask-color;
		border-radius: $border-radius1;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		color: $font-color-contrast;
		font-size: $font-size4;
	}
}

//.poll-block{
//  padding: 0 10px;
//  margin-left: 10px;
//  line-height: 30px;
//  width: 90%;
//  height: 36px;
//  background: #DADCE0;
//  border: 1px solid #F8F8F8;
//  display: flex;
//  align-items:baseline;
//  justify-content:space-between;
//  font-size: 1.1rem;
//  margin-bottom: 6px;
.poll_title {
	margin-left: 10px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 75%;
	display: inline-block;
}
//}
.poll_title_block {
	width: 100%;
	display: inline-block;
}

.poll_block_right {
	display: flex;
	height: 100%;
	align-items: center;
	span {
		margin-right: 10px;
	}
	.ico {
		margin-bottom: 2px !important;
	}
}
</style>
<style lang="scss">
@import "@/emoji/styles.scss";
// @import '@/emoji/emoji.scss';

.ql-editor.ql-blank {
	&:before {
		font-size: $font-size1;
		color: var(--desc-color);
		font-style: normal;
	}

	-webkit-user-select: text;
}

.ql-snow {
	.ql-editor {
		-webkit-user-select: text;
		@include content_font;

		.ql-video {
			width: 100%;
		}
	}

	.ql-stroke {
		stroke: var(--font-color2);
	}

	button.editor-reset {
		.ico {
			color: var(--font-color2);
			font-size: 14px;
			vertical-align: top;
		}

		padding-right: 0;
		text-align: right;
		float: right;

		&:focus {
			outline: none;
		}
	}

	.ql-tooltip {
		background-color: var(--hover-bg);
		border-color: var(--border_color1);
		box-shadow: $box-shadow;

		input {
			background-color: var(--input-bg);
			color: var(--font-color1);
		}
	}
}
.quick-reply {
	.ql-snow {
		.ql-editor {
			img {
				//max-width: 88%;
				//width: 100%;
				//min-height: 300px;
				//min-width: 300px;
				margin-left: 6px;
				margin-bottom: 6px;
				display: block;
			}

			p {
				//display: grid;
			}
		}
	}
}

.sign-icon {
	height: 14px;
}

.poll_edit {
	cursor: pointer;
	color: #3d72de;
}
.padding_t_4 {
	padding-top: 4px !important;
}

.align-center {
	display: flex;
	align-items: center;
}
</style>
