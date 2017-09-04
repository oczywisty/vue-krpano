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
      const url = './static/panoramas/interface/pin.png';

      this.krpanoObj.call(`
        addhotspot(${spotname});
        set(hotspot[${spotname}].url, ${url});
        set(hotspot[${spotname}].ath, ${h});
        set(hotspot[${spotname}].atv, ${v});
        set(hotspot[${spotname}].distorted, true);
        set(hotspot[${spotname}].scale, .25);
        set(hotspot[${spotname}].onloaded, do_crop_animation(251,410, 25));
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
