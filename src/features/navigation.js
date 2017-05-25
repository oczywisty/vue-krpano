/**
 * Created by chenshu on 02/03/2017.
 */
"use strict";

let config = {
  props: {
    setups: {
      type: Array,
      default: function () {
        return [];
      }
    },
    views: {
      type: Array,
      default: function () {
        return [];
      }
    },
    route: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  mounted(){
    this.createNavi();
  },
  methods: {
    addViewHotspot(it, active) {
      const spotname = `view_${it+1}`;
      const url = `%FIRSTXML%/interface/${it+1}_${active}.png`;
      const h = -22 + (it * 6);
      const v = 40;

      this.krpanoObj.call(`
        addhotspot(${spotname});
        set(hotspot[${spotname}].url, ${url});
        set(hotspot[${spotname}].ath, ${h});
        set(hotspot[${spotname}].atv, ${v});
        set(hotspot[${spotname}].scale, .25);
        set(hotspot[${spotname}].distorted, true);
        set(hotspot[${spotname}].onclick, jscall(calc('krpano.hooks.gotoView(${it})')) );
      `);
    },
    addSetupHotspot(it, active) {
      const spotname = `setup_${it+1}`;
      const url = `%FIRSTXML%/interface/setup_${it+1}_${active}.png`;
      const h = -18 + this.views.length * 6 + (it * 6);
      const v = 40;

      this.krpanoObj.call(`
        addhotspot(${spotname});
        set(hotspot[${spotname}].url, ${url});
        set(hotspot[${spotname}].ath, ${h});
        set(hotspot[${spotname}].atv, ${v});
        set(hotspot[${spotname}].scale, .25);
        set(hotspot[${spotname}].distorted, true);
        set(hotspot[${spotname}].onclick, jscall(calc('krpano.hooks.gotoSetup(${it})')) );
      `);
    },
    createNavi() {
      for (let i = 0; i < this.views.length; i++) {
        const routeView = Number(this.route.params.view) || 0;
        const active = (routeView === i) ? 'off' : 'on';
        this.addViewHotspot(i, active);
      }

      for (let i = 0; i < this.setups.length; i++) {
        const routeSetup = Number(this.route.params.setup) || 0;
        const active = (routeSetup === i) ? 'off' : 'on';
        this.addSetupHotspot(i, active);
      }
    }
  },
  watch: {
    route(){
      this.createNavi();
    }
  },
};

export default config;
