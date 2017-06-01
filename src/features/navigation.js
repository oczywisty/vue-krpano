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
    createHotspot(name, ath, atv, image, ico, scale, hook, enabled) {
      this.krpanoObj.call(`
        addhotspot(${name});
        set(hotspot[${name}].url, %FIRSTXML%/interface/${image}.png);
        set(hotspot[${name}].ath, ${ath});
        set(hotspot[${name}].atv, ${atv});
        set(hotspot[${name}].scale, ${scale});
        set(hotspot[${name}].distorted, true);
        set(hotspot[${name}].enabled, ${enabled});
        set(hotspot[${name}].onclick, jscall(calc('krpano.hooks.${hook}')));
      `);

      this.krpanoObj.call(`
        addhotspot(${name}_ico);
        set(hotspot[${name}_ico].url, %FIRSTXML%/interface/${ico}.png);
        set(hotspot[${name}_ico].ath, ${ath});
        set(hotspot[${name}_ico].atv, ${atv});
        set(hotspot[${name}_ico].scale, ${scale});
        set(hotspot[${name}_ico].distorted, true);
        set(hotspot[${name}_ico].enabled, false);
      `);

    },
    addlabel(name, ath, atv) {
      this.krpanoObj.call(`
        addhotspot(${name});
        set(hotspot[${name}].url, %FIRSTXML%/interface/${name}.png);
        set(hotspot[${name}].ath, ${ath});
        set(hotspot[${name}].atv, ${atv});
        set(hotspot[${name}].scale, .2);
        set(hotspot[${name}].distorted, true);
        set(hotspot[${name}].enabled, false);
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
      let image = hudOn ? 'btn' : 'btn_active';
      this.createHotspot('hud_show', -40, 52, image, 'show', .25, 'toggleHud()', !hudOn);

      image = !hudOn ? 'btn' : 'btn_active';
      this.createHotspot('hud_hide', -32, 52, image, 'hide', .25, 'toggleHud()', hudOn);
      
    },
    addViewHotspot(it, active) {
      console.log(active);
      const spotname = `view_${it+1}`;
      const image = active ? 'btn' : 'btn_active';
      const h = -18 + (it * 8);
      const v = 52;

      this.createHotspot(spotname, h, v, image, it+1, .25, `gotoView(${it})`, !active);
    },
    addSetupHotspot(it, energyLevel, active) {
      const spotname = `setup_${it+1}`;
      const image = active ? `level_${energyLevel}` : `level_${energyLevel}_active`;
      const h = -12 + this.views.length * 8 + (it * 8);
      const v = 52;

      this.createHotspot(spotname, h, v, image, it+1, .25, `gotoSetup(${it})`, !active);
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

      this.addlabel('text_hud', -36, 55);
      this.addlabel('text_view', -10, 55);

      const setupLabelH = this.setups.length === 4 ? 24 : 20;
      this.addlabel('text_setup', setupLabelH, 55);

      this.addSectionHotspots('ee', 17, 62, -20, 0);
      this.addSectionHotspots('aq', 0, 63.4, 0, 1);
      this.addSectionHotspots('hs', -17, 62, 20, 2);

      this.addHudHotspots(this.route.path.indexOf('hud') > -1);
      
      for (let i = 0; i < this.views.length; i++) {
        const routeView = Number(this.route.params.view) || 0;
        this.addViewHotspot(i, routeView === i);
      }

      for (let i = 0; i < this.setups.length; i++) {
        const routeSetup = Number(this.route.params.setup) || 0;
        this.addSetupHotspot(i, this.setups[i].energy_level, routeSetup === i);
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
