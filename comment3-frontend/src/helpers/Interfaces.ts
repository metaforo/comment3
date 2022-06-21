export type AirdropRuleInterface = {
	id: number;
	rule_name: string;
	award_count: number;
	action: string | undefined;
	condition: string;
	desc: string;
	repeat: number;
	interval: number;
	total_count?: number;
	exec_status?: number;
	show_action: false | undefined;
	sum?: string;
};

export type AntVueEvent = {
	nativeEvent: Event;
	preventDefault: object;
	stopPropagation: object;
	target: { checked: boolean; defaultChecked: boolean };
};

export type AssetInterface = {
	id: number;
	token_id: number;
	balance: number;
	name: string;
	symbol: string;
	logo: string;
	is_import: number;
	decimal?: number;
};

export type CategoryInterface = {
	id: number;
	group_id: number;
	name: string;
	category_id: number;
	new_topics?: number;
	is_show?: boolean;
	// children?: any[];
	// [propName: string]: any;
};

export type TagInterface = {
	id: number;
	name: string;
	order: string;
	type: string;
};

export type TitleInterface = {
	id: number;
	name: string;
	order: string;
	color: string;
	icon: string;
	unicode_emoji: string;
	type: number;
};

export type DeltaInterface = {
	ops: DeltaOpsInterface[];
};

export type DeltaOpsInterface = {
	insert?: any;
	attributes?: any;
	delete?: any;
	format?: any;
};

export type ERC20TokenInterface = {
	id: number;
	group_id: number;
	name?: string;
	logo?: string;
	balance?: number | string;
	decimal?: number | string;
	address?: string;
	contract_url?: string;
	symbol?: string;
	status?: number;
	is_import?: number;
	order_id?: string;
	created_at?: string;
	updated_at?: string;
};

export type FlagInterface = {
	id: number;
	post_id: number;
	user_id: number;
	reason?: number;
	is_ban?: number;
	created_at?: string;
	user?: ProfileInterface;
	poster?: ProfileInterface;
	reason_msg?: string;
	online?: boolean;
};

export type GroupInterface = {
	id: number;
	name: string;
	title: string;
	created_at: string;
	owner: 0;
	cover: string;
	logo: string;
	updated_at: string;
	description: string;
	members?: number;
	online_members?: number;
	threads?: number;
	no_recommend?: number;
	super_no_recommend?: number;
	erc20_token?: ERC20TokenInterface;
	feature?: GroupFeatureInterface[];
	attached_files?: any;
	group_admin?: any;
	group_settings?: any;
	joining?: number;
	visibility?: number;
	privacy_type: string;
	chain_type: string;
	nft_path?: string;
	ft_pass?: string;
	primary_token: string;
	primary_nft: string;
	ft_count?: number;
	open_readonly?: number;
	group_subscription?: any;
	show_snapshot?: number;
	snapshot_space: string;
	can_join_group?: number;
	main_token_address?: string;
};

export type GroupFeatureInterface = {
	id: number;
	feature_name: string;
	status: string;
	is_setting: number;
};

export type LikeInterface = {
	post_id: number;
	user_id: number;
	is_ban: number;
	user?: ProfileInterface;
	is_subscribe?: number;
	online?: boolean;
	amount?: string;
	symbol?: string;
};

export type NotificationInterface = {
	id: number;
	type: string;
	thread_id: number;
	post_id: number;
	user_id: number;
	group_name: string;
	user?: { id: number; name: string; photo_url: string };
	token?: { name: string; logo: string };
	created_at: string;
	msg: string;
	title?: string;
	url?: string;
	post_content?: string;
	short_content?: string;
	post_parent_id?: number;
	content: string;
	reason?: number;
	reason_msg?: string;
	likes?: [];
	flags?: [];
	ipfs?: string;
	thread_slug?: string;
	group_id?: number;
	is_ban: number;
	online?: boolean;
	attached_files?: any[];
};

export type PostInterface = {
	id: number;
	thread_id: number;
	parent_id: number;
	user_id: number;
	user: UserInterface;
	created_at: string;
	content: string;
	ipfs: string;
	arweave: string;
	likes: LikeInterface[];
	flags: FlagInterface[];
	nsfw?: number;
	children?: PostInterface[];
	deleted?: number;
	deleted_by?: ProfileInterface;
	is_new?: boolean;
	is_ban?: number;
	group_id?: number;
	total_likes?: number;
	total_report?: number;
	is_subscribe?: boolean;
	attached_files?: any[];
	depth?: number;
	online?: boolean;
	badge?: any[];
	title?: string;
	user_title?: any[];
	sign?: string;
	attachments?: any[];
	tip_count: number;
	tipped?: number;
	liked?: number;
	user_group_level?: number; // user group permissio level, 1: admin, 2: admin, 3: mod
};

export type ProfilePostInterface = {
	deleted: number;
	deleted_by: number;
	group_id: number;
	group_name: string;
	group_post_id: number;
	group_thread_id: number;
	id: number;
	ipfs: string;
	like_username?: string;
	nsfw: number;
	nsfw_score: number;
	parent_id: number;
	thread_id: number;
	thread_poster_id: number;
	thread_poster_name: string;
	thread_title: string;
	created_at: string;
	updated_at: string;
	user_avatar: string;
	user_id: number;
	is_nfc: number;
	username: string;
	parent_poster_name: string;
	first_post_id: number;
	post_id: number;
	tag: string;
	from_avatar: string;
	from_uid: number;
	from_username: string;
	to_avatar: string;
	to_uid: string;
	to_username: string;
	symbol: string;
	logo: string;
	amount: string;
};

export type ProductInterface = {
	id: number;
	price: string;
	product_name: string;
	status: number;
};

export type ProfileInterface = {
	user_id: number;
	name: string;
	photo_url: string;
	is_ban?: number;
	last_seen?: boolean;
	online?: boolean;
	is_nfc?: number;
};

export type RequestOptionsInterface = {
	route: string;
	param?: Record<string, any>;
	headers?: Record<string, any>;
	data?: Record<string, any>;
};

export type ThreadInterface = {
	id: number;
	title: string;
	user: UserInterface;
	category: CategoryInterface;
	category_index_id?: number;
	created_at: string;
	first_post: PostInterface;
	latest_reply: PostInterface;
	posts_count: number;
	likes_count: number;
	posts: PostInterface[];
	ipfs?: string;
	unread?: number;
	no_recommend?: number;
	is_ban?: number;
	is_pin?: number;
	pin_user?: string;
	updated_at?: string;
	morePostCount?: number;
	group?: GroupInterface;
	slug?: string;
	polls?: PollInterface[];
	badge?: any[];
	tags?: TagInterface;
	snapshot_id?: string;
	snapshot_author?: string;
	user_title?: UserTitleInterface;
	tip_count: number;
	tip_amount?: string;
	tip_list?: tipListInterface[];
	tipped?: boolean;
	is_gallery?: boolean;
	gallery?: galleryInterface;
	gallery_id?: number;
	lottery?: LotteryInterface;
	lottery_list?: LotteryListInterface[];
};

export type UserTitleInterface = {
	name: string;
	color: string;
	background: string;
};
export type galleryInterface = {
	id: number;
	name: string;
	desc: string;
	thumb_url: string;
	url: string;
	opensea_link: string;
	matadata: any;
};

export type tipListInterface = {
	id: number;
	name: string;
	photo_url: string;
};

export type TokenInterface = {
	id: number;
	name: string;
	symbol: string;
	logo: string;
	contract_address: string;
	balance?: number;
};

export type UploadedImageUrl = {
	url: string;
	id: number;
	thumb_url: string;
};

export type UserInterface = {
	id: number;
	name: string;
	email: string;
	photo_url?: string;
	created_at?: string;
	updated_at?: string;
	groups?: { id: number; name: string; is_admin?: number }[];
	likes?: number;
	posts?: number;
	activate: number;
	refreshedToken?: string;
	api_version?: number;
	blocked_users?: number[];
	super_admin?: number;
	is_nfc?: number;
	online?: boolean;
	is_user_follow?: number;
	is_follow?: number;
	is_admin?: number;
	badge?: string[];
	group_name?: string;
	title?: string;
	referral_url?: string;
	discord_id?: string;
	group_perm_level?: { group_id: number; level: number }[];
};

export type MemberListInterface = {
	user_id: number;
	name: string;
	photo_url: string;
	created_at: string;
	likes_count: number;
	is_admin: number;
	is_ban: number;
	online?: boolean;
	last_login?: boolean;
	updated_at?: boolean;
	seven_days?: number;
};

export type WithdrawRequest = {
	id: number;
	group_id: 0;
	amount: string;
	order_id: string;
	status: number;
	to: string;
	token_id: number;
	user_id: number;
	wallet_id: number;
	transactionHash?: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
};

export type SnapShotInterface = {
	id: string;
	avatar: string;
	name: string;
	author: string;
	title: string;
	content: string;
	end: number;
	domain: string;
	state: string;
	body: string;
	space?: { id: string; name: string; avatar: string };
};

export type postSignInterface = {
	sign: string;
	msg: string;
};

export type PollOptionsInterface = {
	id: number;
	html: string;
	is_vote: number;
	poll_id: number;
	voters: number;
};

export type NFTSectionInterface = {
	is_approved: number;
	min_partipants: number;
	min_pass: number;
	partipants: number;
	passes: number;
};

export type PollInterface = {
	id: number;
	chart_type: number;
	category_id?: number;
	category_name?: string;
	vote_type: number;
	close_at: string;
	created_at: string;
	is_vote: number;
	max: number;
	min: number;
	show_who_vote: number;
	options: PollOptionsInterface[];
	title: string;
	type: number;
	leftTime: string;
	totalVotes: number;
	status: string;
	show_type: number;
	average: number;
	min_tokens: string;
	token_address: string;
	nftsection: NFTSectionInterface;
};

export type PollUserInterface = {
	id: number;
	option_id: number;
	user_id: number;
	user?: ProfileInterface;
	online?: boolean;
};

export interface GalleryInterface {
	id: number;
	name: string;
	thumb_url: string;
	posts_count: number;
	likes_count: number;
}

export interface LotteryInterface {
	id: number;
	account: string;
	thread_id: number;
	applicant_count: number;
	arweave: string;
	end_time: string;
	status: number;
	winners_count: number;
	result: string;
	is_entered: boolean;
	remaining_time: number;
	name: string;
	desc: string;
	winner_list?: WinnerListInterface[];
	block: number;
}

export interface LotteryListInterface {
	id: number;
	everHash: string;
	user_id: number;
	photo_url: string;
	name: string;
}

export type DrawUserListInterface = {
	id: number;
	user_id: number;
	created_at: string;
	name: string;
	photo_url: string;
	everHash: string;
};

export type WinnerListInterface = {
	id: number;
	name: string;
	photo_url: string;
	web3_public_key: string;
};
