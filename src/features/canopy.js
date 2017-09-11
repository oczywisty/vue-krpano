/**
 * Created by chenshu on 02/03/2017.
 */
"use strict";

let config = {
  props: {
    canopy: {
      type: Object,
      default: function () {
        return null;
      }
    }
  },
  mounted(){
    this.createCanopy();
  },
  methods: {
    createCanopy() {
      if (!this.krpanoObj) {
        setTimeout(() => { this.createCanopy(); }, 2000);
        return;
      } else if(this.canopy) {
        const canopyUrl = './static/panoramas/interface/canopy.png';
        
        this.krpanoObj.call(`
          addhotspot(canopy);
          set(hotspot[canopy].url, ${canopyUrl});
          set(hotspot[canopy].ath, ${this.canopy.h});
          set(hotspot[canopy].atv, ${this.canopy.v});
          set(hotspot[canopy].scale, ${this.canopy.scale});
          set(hotspot[canopy].distorted, true);
          set(hotspot[canopy].onclick, jscall(calc('krpano.hooks.toggleCanopy()')));
        `);
      }
    }
  },
  watch: {
    canopy(){
      this.createCanopy();
    }
  },
};

export default config;
