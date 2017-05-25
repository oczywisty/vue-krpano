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
    addHotspot(it, {v, h, scale}) {
      const spotname = `hotspot${it}`;
      const url = './static/vr/hotspot.png';

      this.krpanoObj.call(`
        addhotspot(${spotname});
        set(hotspot[${spotname}].url, ${url});
        set(hotspot[${spotname}].ath, ${h});
        set(hotspot[${spotname}].atv, ${v});
        set(hotspot[${spotname}].scale, ${scale});
        set(hotspot[${spotname}].onclick, jscall(calc('krpano.hooks.onHotspotClick("${spotname}")')));
      `);
    },
    createHotspots() {
      for (let i = 0; i < this.hotspots.length; i++) {
        this.addHotspot(i, this.hotspots[i]);
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
