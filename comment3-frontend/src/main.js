import { createApp } from "vue";
import {
	createRouter,
	createWebHashHistory,
	createWebHistory,
} from "vue-router";
import {
	Button,
	Statistic,
	DatePicker,
	AutoComplete,
	Avatar,
	Breadcrumb,
	Card,
	Checkbox,
	Col,
	Drawer,
	Dropdown,
	Empty,
	Input,
	Select,
	Popover,
	BackTop,
	Layout,
	List,
	Menu,
	Modal,
	Radio,
	Alert,
	Row,
	Skeleton,
	Switch,
	Table,
	Tabs,
	Rate,
	Progress,
	Tooltip,
} from "ant-design-vue";
import VueClipboard from "vue3-clipboard";
import Icons from "./components/Icons.vue";
import store from "./store";
import { createI18n } from "vue-i18n";
import routes from "./routes";
import "ant-design-vue/dist/antd.less"; //modifyVars in vite.config, so import less here,
import en from "../assets/locales/en.json";
import zh_CN from "../assets/locales/zh_CN.json";
import beforeEachHook from "./routes/beforeEachHook";
import App from "./App.vue";

// Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHistory(),
	routes, // short for `routes: routes`
});
/**
 *  global before guards
 *  we can do auth and redirect in here
 */
router.beforeEach(beforeEachHook);

const i18n = createI18n({
	// legacy: false,
	globalInjection: true,
	locale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || "en",
	fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || "en",
	dateTimeFormats: {
		en: {
			short: {
				year: "numeric",
				month: "short",
				day: "numeric",
			},
			long: {
				year: "numeric",
				month: "short",
				day: "numeric",
				weekday: "short",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			},
			notification: {
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: false,
			},
		},
	},
	messages: {
		en: en,
		zh_CN: zh_CN,
	},
});

export const app = createApp(App);

app.component("Icons", Icons);

app.use(VueClipboard, {
	autoSetContainer: true,
	appendToBody: true,
})
app.use(router);
app.use(store);
app.use(i18n);
app.use(Button);
app.use(Statistic);
app.use(DatePicker);
app.use(AutoComplete);
app.use(Avatar);
app.use(Breadcrumb);
app.use(Button);
app.use(Card);
app.use(Checkbox);
app.use(Col);
app.use(Drawer);
app.use(Dropdown);
app.use(Empty);
app.use(Input);
app.use(Select);
app.use(Popover);
app.use(BackTop);
app.use(Layout);
app.use(List);
app.use(Menu);
app.use(Modal);
app.use(Radio);
app.use(Alert);
app.use(Row);
app.use(Skeleton);
app.use(Switch);
app.use(Table);
app.use(Tabs);
app.use(Rate);
app.use(Progress);
app.use(Tooltip);
app.mount("#app");
