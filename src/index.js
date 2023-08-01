import Area from './components/Area.vue';
import Snail from './components/Snail.vue';

export {
  Area,
  Snail,
};

function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component("area", Area);
}

const plugin = {
	install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
	GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
	GlobalVue = global.vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

Area.install = install;

export default Area;