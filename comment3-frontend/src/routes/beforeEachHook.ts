import { app } from "../main.js";
import store from "@/store";
import { Route } from "vue-router";
import VueAmplitude from "@/helpers/VueAmplitude";
// import VueAnalytics from 'vue-analytics';
import { isInApp, switchDarkMode, getCustomType } from "@/helpers/Utils";
import { message } from "ant-design-vue";

// Vue.use(VueAmplitude, {
// 	apiKey: "19fd4965e4e045e16b9d9574cb36c65e",
// 	userId: 0,
// 	config: { includeReferrer: true, includeUtm: true },
// });
// Vue.use(VueAnalytics, {id: 'UA-172351397-1'});

export default function beforeEachHook(to: Route, from: Route, next: any) {
	let proceed = true;
	// proceed = false;
	//
	// if ((import.meta.env.VITE_APP_DOMAIN === 'https://stage.everforo.com' || import.meta.env.VITE_APP_DOMAIN === 'https://dev.everforo.com')
	//     && !localStorage.getItem('stagePassport'))
	// {
	//
	//     if (isInApp()) {
	//         // no need such guard for app
	//     } else {
	//         proceed = false;
	//         const answer = window.prompt('what\'s the password?');
	//         if (btoa(btoa(btoa(answer + ''))) === 'VFZSSmVrNUVVWHBOYWtVOQ==') {
	//             proceed = true;
	//             localStorage.setItem('stagePassport', 'everforo');
	//         }
	//     }
	// }

	//amp track and ga track
	if (
		import.meta.env.NODE_ENV === "production" &&
		from.fullPath != to.fullPath
	) {
		Vue.prototype.$amplitude.logEvent(to.fullPath);
		// Vue.prototype.$ga.page(to.fullPath);
	}

	const showPapercups: string[] = [
		"homehome",
		"homepricing",
		"homefeatures",
		"homegroups",
	];
	let elm = document.getElementById("PapercupsChatWidget");
	let body = document.querySelector("body");

	if (elm) {
		if (showPapercups.indexOf(to.name as string) === -1) {
			elm.style.display = "none";
		} else {
			elm.style.display = "block";
		}
	}

	var lastDomain = localStorage.getItem("lastDomain") as string;

	var domain = window.location.host;

	var group_info_url = "";
	if (to.params.group_name == null) {
		group_info_url = "custom/api/group/info";
		// console.log( store.getters.getDomain);
		// console.log( domain);
		// console.log( import.meta.env.VITE_APP_DOMAIN);
		// console.log( (import.meta.env.VITE_APP_DOMAIN as string).indexOf(domain));

		if (store.getters.getDomain == "") {
			store.commit("setDomain", import.meta.env.VITE_APP_DOMAIN);
		}

		if (getCustomType()) {
			loadGroup();
		} else {
			next(proceed);
		}
	} else {
		group_info_url =
			import.meta.env.VITE_APP_GROUP_PATH +
			to.params.group_name +
			"/api/group/info";

		if (
			!store.getters.getGroupName ||
			store.getters.getGroupName !== to.params.group_name
		) {
			store.commit("setGroupName", to.params.group_name);
			loadGroup();
		} else {
			next(proceed);
		}
	}

	localStorage.setItem("cacheHref", domain);
	localStorage.setItem("lastDomain", domain);

	// localStorage.setItem('cacheHref',response.domain )

	// if ( body ){
	//         if ( to.name == 'homegroups' ){
	//             body.style.overflowY = 'hidden'
	//         }else{
	//             body.style.overflowY = 'auto'
	//         }
	// }
	// if we are going to a  group info not fetched, we do it before go to this page
	// var indexHref = window.location.href;
	// var cacheHref = localStorage.getItem('cacheHref') as string;
	// var cacheGroup = localStorage.getItem('cacheGroup') as string;
	// if (store.getters.getCustomType) {
	//     if (!cacheHref || indexHref.indexOf(cacheHref) == -1) {
	//         const data = new FormData();
	//         data.append('url', indexHref);
	//         store.dispatch('Group/getUrlInfo', data).then((response: any) => {
	//             cacheGroup = response.group;
	//             localStorage.setItem('cacheGroup', cacheGroup);
	//             // localStorage.setItem('cacheHref', indexHref.substring(indexHref.indexOf('/', 8), 0));
	//             localStorage.setItem('cacheHref', response.group_url);
	//             loadGroup();
	//         }).catch(() => {
	//             store.commit('setErrorMessage', 'The group you are trying to visit doesn\'t exist.');
	//             store.commit('setShowProgressLine', false);
	//             next({name: '404'});
	//         });
	//
	//     } else {
	//         loadGroup();
	//     }
	// } else if (to.params.group_name) {
	//     if (to.params.group_name == 'peopledaofamily'
	//         || to.params.group_name == 'opendao'
	//         || to.params.group_name == 'seedao'
	//         || to.params.group_name == '98kdao'
	//         || to.params.group_name == 'maodao'
	//         || to.params.group_name == 'builderdao'
	//         || to.params.group_name == 'web3university'
	//         || to.params.group_name == 'bombdao'
	//     ) {
	//         if ( to.params.group_name == 'opendao' ){
	//             cacheGroup = 'opendao';
	//             cacheHref = 'https://forum.theopendao.com';
	//         }else if ( to.params.group_name == 'seedao' ){
	//             cacheGroup = 'seedao';
	//             cacheHref = 'https://forum.seedao.xyz';
	//         } else if ( to.params.group_name == '98kdao' ){
	//             cacheGroup = '98kdao';
	//             cacheHref = 'https://98kdao.com';
	//         } else if ( to.params.group_name == 'web3university' ){
	//             cacheGroup = 'web3university';
	//             cacheHref = 'https://discuss.web3.university';
	//         } else if ( to.params.group_name == 'bombdao' ){
	//             cacheGroup = 'bombdao';
	//             cacheHref = 'https://forum.bombdao.xyz';
	//         } else if ( to.params.group_name == 'maodao' ){
	//             cacheGroup = 'maodao';
	//             cacheHref = 'https://forum.maonft.com';
	//         } else if ( to.params.group_name == 'builderdao' ){
	//             cacheGroup = 'builderdao';
	//             cacheHref = 'https://metaforo.io/g/builderdao';
	//         }  else {
	//             cacheGroup = 'peopledaofamily';
	//             cacheHref = 'https://thepeople.family';
	//         }
	//
	//         // cacheGroup = 'goat';
	//         // cacheHref = 'http://127.0.0.1:8002';
	//     } else {
	//         cacheGroup = '';
	//         cacheHref = '';
	//     }
	//     if (cacheHref) {
	//         var fullGroup = '/g/' + cacheGroup;
	//         var url = '';
	//         if (fullGroup != to.fullPath) {
	//             url = to.fullPath.substring(to.fullPath.indexOf('/', fullGroup.length));
	//         }
	//         window.location.href = cacheHref + url;
	//         return;
	//     }
	//     var groupName = to.params.group_name  ? to.params.group_name : cacheGroup;
	//     loadGroup(groupName);
	// }

	function loadGroup() {
		// if (
		//     (!store.getters.getGroupName)) {

		store.commit("setShowProgressLine", true);

		// clear some group spicified data
		store.commit("BanUser/clearBanList");

		store
			.dispatch("Group/load", group_info_url)
			.then((response: any) => {
				if (
					response &&
					response.response &&
					response.response.data &&
					response.response.data.code == "40012"
				) {
					// message.error(response.response.data.description, 5);
					store.commit("setShowProgressLine", false);
					next(proceed);
					return;
				}

				if (response && response.name) {
					// set group name
					store.commit("setGroupName", response.name);
					// }
					if (response.domain) {
						var fullGroup = "/g/" + response.name;
						var url = "";
						url = to.fullPath.substring(
							to.fullPath.indexOf("/", fullGroup.length)
						);
						store.commit("setDomain", response.domain);
						if ((response.domain as string).indexOf(domain) == -1) {
							window.location.href = response.domain + url;
						}
					}
				}

				store.commit("GroupExtensions/clearFeature");
				if (response && response.feature && response.feature.length) {
					for (let i in response.feature) {
						store.commit(
							"GroupExtensions/setFeature",
							response.feature[i]
						);
					}
					store.commit("setMetaInfo", {
						site_name: store.getters.getGroupName,
						image: response.logo,
					});
				} else {
					next({
						name: "group404",
						params: { group_name: to.params.group_name },
					});
				}

				//     localStorage.setItem('cacheHref',response.domain ?? null )

				store.commit("Tag/clearTags");
				if (response && response.tags && response.tags.length) {
					store.commit("Tag/setTags", response.tags);
					store.commit("Tag/setOrderTags", response.order_tags);
				}

				// if (  ){
				//     next({name: 'group404', params: {group_name: to.params.group_name}});
				// }
				// if (response && response.group_subscription ) {
				//     store.commit('GroupExtensions/setSubscription', response.group_subscription);
				// }

				// we also need category list.
				store
					.dispatch("Category/load")
					.then(() => {
						store.commit("setShowProgressLine", false);
						next(proceed);
					})
					.catch(() => {
						store.commit(
							"setErrorMessage",
							"Fetching category list failed"
						);
					});
			})
			.catch(() => {
				store.commit(
					"setErrorMessage",
					"The group you are trying to visit doesn't exist."
				);

				store.commit("setShowProgressLine", false);
				// ?
				next({
					name: "group404",
					params: { group_name: to.params.group_name },
				});
			});

		// } else {
		// move on to the next hook in the pipeline. If no hooks are left, the navigation is confirmed.
		// Make sure that the next function is called exactly once in any given pass through the navigation guard.
		// otherwise the hook will never be resolved or produce errors.
		// next(proceed);
		// }
	}
}
