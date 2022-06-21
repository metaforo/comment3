import DiscordAuth from "@/views/DiscordAuth.vue";
import DiscordWallet from "@/views/DiscordWallet.vue";
import EULA from "@/views/EULA.vue";
import Group from "@/views/Group.vue";
import GroupNotFound from "@/views/GroupNotFound.vue";
import Home from "@/views/Home.vue";
import HomeAirdrop from "@/views/HomeAirdrop.vue";
import HomeFeatures from "@/views/HomeFeatures.vue";
import HomeGroups from "@/views/HomeGroups.vue";
import HomeHome from "@/views/HomeHome.vue";
import HomeTech from "@/views/HomeTech.vue";
import LandingPage from "@/views/LandingPage.vue";
import NotFound from "@/views/NotFound.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import TermUse from "@/views/TermUse.vue";
import Thread from "@/views/Thread.vue";
import { getCustomType } from "@/helpers/Utils";

var routes = [];
if (getCustomType()) {
	routes = [
		{
			path: "/",
			name: "home",
			component: Group,
			meta: {
				keepAlive: true, //需要缓存
			},
			children: [
				{
					path: "/password/reset",
					name: "passwordreset",
					component: Group,
				},
				{
					path: "/email/register",
					name: "register",
					component: Group,
				},
				// {
				//     path: '/all',
				//     name: 'groups',
				//     component: Group,
				//     meta: {
				//         keepAlive: true, //需要缓存
				//     }
				// },
				{
					path: "/:type(search|everpay|join|join_request)",
					name: "groups",
					component: Group,
					meta: {
						keepAlive: true, //需要缓存
					},
				},
				{
					path: "/:type(label)/:label_id",
					name: "grouplabel",
					component: Group,
					meta: {
						keepAlive: true, //需要缓存
					},
				},
			],
		},
		{
			path: "/privacy",
			name: "privacy",
			component: PrivacyPolicy,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			// be compatible with app, remove in the future
			path: "/privacy-policy",
			redirect: { name: "privacy" },
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/eula",
			name: "eula",
			component: EULA,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/term-of-use",
			name: "terms",
			component: TermUse,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/thread/:thread_slug/:post_id?/:unsubscribe?/:user_id?",
			name: "thread",
			component: Thread,
			meta: {
				keepAlive: false, //需要缓存
			},
		},
		{
			path: "/:category_id?",
			name: "group",
			component: Group,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "*",
			name: "404",
			component: NotFound,
		},
		{
			path: "/discord/auth",
			name: "discord",
			component: DiscordAuth,
		},
		{
			path: "/my/wallet",
			name: "discordwallet",
			component: DiscordWallet,
		},
	];
} else {
	routes = [
		{ path: "/:pathMatch(.*)", component: NotFound },
		{
			path: "/",
			name: "home",
			component: Home,
			children: [
				{
					path: "/password/reset",
					name: "passwordreset",
					component: HomeGroups,
				},
				{
					path: "/email/register",
					name: "register",
					component: HomeGroups,
				},
				{
					path: "/",
					name: "homehome",
					component: HomeHome,
					meta: {
						keepAlive: true, //需要缓存
					},
				},
				// {
				// 	path: "feature",
				// 	name: "homefeature",
				// 	component: HomeFeature,
				// 	meta: {
				// 		keepAlive: true, //需要缓存
				// 	},
				// },
				{
					path: "features",
					name: "homefeatures",
					component: HomeFeatures,
					meta: {
						keepAlive: true, //需要缓存
					},
				},
				{
					path: "tech",
					name: "hometech",
					component: HomeTech,
					meta: {
						keepAlive: true, //需要缓存
					},
				},
				{
					path: "/explore",
					name: "homegroups",
					component: HomeGroups,
					meta: {
						keepAlive: true, //需要缓存
					},
				},
				{
					path: "/landing",
					name: "landingpage",
					component: LandingPage,
				},
				{
					path: "airdrop",
					name: "homeairdrop",
					component: HomeAirdrop,
					meta: {
						keepAlive: true, //需要缓存
					},
				},
			],
		},
		{
			// path: '/g/:group_name/thread/:thread_slug/:sort?/:page?/:post_id?/:unsubscribe?/:user_id?',
			path: "/g/:group_name/thread/:thread_slug/:post_id?/:unsubscribe?/:user_id?",
			name: "thread",
			component: Thread,
			meta: {
				keepAlive: false, //需要缓存
			},
		},
		{
			path: "/g/:group_name/:type(search|everpay|join|join_request)",
			name: "groups",
			component: Group,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/g/:group_name/:type(label)/:label_id",
			name: "grouplabel",
			component: Group,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/g/:group_name/:category_id?",
			name: "group",
			component: Group,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/privacy",
			name: "privacy",
			component: PrivacyPolicy,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			// be compatible with app, remove in the future
			path: "/privacy-policy",
			redirect: { name: "privacy" },
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/eula",
			name: "eula",
			component: EULA,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/term-of-use",
			name: "terms",
			component: TermUse,
			meta: {
				keepAlive: true, //需要缓存
			},
		},
		{
			path: "/*",
			name: "404",
			component: NotFound,
		},
		{
			path: "/g/:group_name",
			name: "group404",
			component: GroupNotFound,
		},
		{
			path: "/discord/auth",
			name: "discord",
			component: DiscordAuth,
		},
		{
			path: "/my/wallet",
			name: "discordwallet",
			component: DiscordWallet,
		},
	];
}

export default routes;
