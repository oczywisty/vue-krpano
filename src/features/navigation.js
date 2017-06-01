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
    addlabel(name, ath, atv) {
      this.krpanoObj.call(`
        addhotspot(${name});
        set(hotspot[${name}].url, %FIRSTXML%/interface/${name}.png);
        set(hotspot[${name}].ath, ${ath});
        set(hotspot[${name}].atv, ${atv});
        set(hotspot[${name}].scale, .2);
        set(hotspot[${name}].distorted, true);
      `);
    },
    addSectionHotspots(name, rz, atv, ath, index) {
      var current = Number(this.route.params.section) == index;
      this.krpanoObj.call(`
        addhotspot(${name});
        set(hotspot[${name}].url, %FIRSTXML%/interface/btn_${name}_${current ? 'on' : 'off'}.png);
        set(hotspot[${name}].ath, ${ath});
        set(hotspot[${name}].atv, ${atv});
        set(hotspot[${name}].rz, ${rz});
        set(hotspot[${name}].scale, .105);
        set(hotspot[${name}].distorted, true);
        set(hotspot[${name}].onclick, jscall(calc('krpano.hooks.gotoSection(${index})')) );
      `);
    },

    addHudHotspots(hudOn) {
      const v = 52;
      this.krpanoObj.call(`
        addhotspot(hud_show);
        set(hotspot[hud_show].url, %FIRSTXML%/interface/show_${hudOn ? 'off' : 'on'}.png);
        set(hotspot[hud_show].ath, -40);
        set(hotspot[hud_show].atv, ${v});
        set(hotspot[hud_show].scale, .25);
        set(hotspot[hud_show].distorted, true);
        set(hotspot[hud_show].onclick, jscall(calc('krpano.hooks.toggleHud()')) );
      `);

      this.krpanoObj.call(`
        addhotspot(hud_hide);
        set(hotspot[hud_hide].url, %FIRSTXML%/interface/hide_${!hudOn ? 'off' : 'on'}.png);
        set(hotspot[hud_hide].ath, -32);
        set(hotspot[hud_hide].atv, ${v});
        set(hotspot[hud_hide].scale, .25);
        set(hotspot[hud_hide].distorted, true);
        set(hotspot[hud_hide].onclick, jscall(calc('krpano.hooks.toggleHud()')) );
      `);
    },
    addViewHotspot(it, active) {
      const spotname = `view_${it+1}`;
      const url = `%FIRSTXML%/interface/${it+1}_${active}.png`;
      const h = -18 + (it * 8);
      const v = 52;

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
      const h = -12 + this.views.length * 8 + (it * 8);
      const v = 52;

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
      if (!this.krpanoObj) {
        // Fixing the fact that krpano may be not yet initialized on mobile phone app
        setTimeout(() => { this.createNavi(); }, 2000);
        return;
      } else {
        this.krpanoObj.call('webvr.enterVR();');
      }

      if (this.views.length == 0) return;

      this.addlabel('text_view', -10, 55);
      this.addlabel('text_setup', 16, 55);
      
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
    },
    hotspots(hs){
      if (hs.length) this.createNavi();
    }
  },
};

export default config;
