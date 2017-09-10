/**
 * Created by chenshu on 02/03/2017.
 */
"use strict";

let config = {
  props: {
    hotspots: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  mounted(){
    this.createHotspots();
  },
  methods: {
    addHotspot(it, {v, h, scale, view}) {
      const spotname = `hotspot${it}`;
      let position = '';
      let cropW = 251;
      let cropH = 410;

      if (v > 10) {
        position = 'bottom';
      } else if (v < -10) {
        position = 'top';
      } else {
        cropW = 350;
        cropH = 571;
        position = 'middle';
      }

      const url = `./static/panoramas/interface/pin_${position}.png`;

      this.krpanoObj.call(`
        addhotspot(${spotname});
        set(hotspot[${spotname}].url, ${url});
        set(hotspot[${spotname}].ath, ${h});
        set(hotspot[${spotname}].atv, ${v});
        set(hotspot[${spotname}].distorted, true);
        set(hotspot[${spotname}].scale, ${scale});
        set(hotspot[${spotname}].onloaded, do_crop_animation(${cropW},${cropH}, 25));
        set(hotspot[${spotname}].onclick, jscall(calc('krpano.hooks.gotoView(${view})')) );
      `);
    },
    createHotspots() {
      if (!this.krpanoObj) {
        setTimeout(() => { this.createHotspots(); }, 2000);
        return;
      } else {
        for (let i = 0; i < this.hotspots.length; i++) {
          this.addHotspot(i, this.hotspots[i]);
        }
      }
    }
  },
  watch: {
    hotspots(){
      this.createHotspots();
    }
  },
};

export default config;
