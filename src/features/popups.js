/**
 * Created by chenshu on 02/03/2017.
 */
"use strict";

let config = {
  props: {
    popups: {
      type: Array,
      default: function () {
        return [];
      }
    },
    popupsVisible: {
      type: Boolean,
      default: function () {
        return true;
      }
    },
    video: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  mounted(){
    this.createPopups();
  },
  methods: {
    addPopup(it, {v, h, scale, title, content, video, loop}) {
      const spotname = `popup${it}`;
      const url = './static/panoramas/interface/hotspot_sprite.png';

      this.krpanoObj.call(`
        addhotspot(${spotname});
        set(hotspot[${spotname}].url, ${url});
        set(hotspot[${spotname}].ath, ${h});
        set(hotspot[${spotname}].atv, ${v});
        set(hotspot[${spotname}].scale, ${scale});
        set(hotspot[${spotname}].visible, ${this.popupsVisible});
        set(hotspot[${spotname}].onloaded, do_crop_animation(250,250, 25));
        set(hotspot[${spotname}].onclick, jscall(calc('krpano.hooks.openPopup("${it}")')));
      `);
    },
    createPopups() {
      if (!this.krpanoObj) {
        setTimeout(() => { this.createPopups(); }, 2000);
        return;
      } else {
        for (let i = 0; i < this.popups.length; i++) {
          this.addPopup(i, this.popups[i]);
        }
      }
    },
  },
  watch: {
    popups(){
      this.createPopups();
    },
    video(){
      if (!this.krpanoObj) { return; }

      var isVideo = this.video.video ? false : true;
      
      for (let i = 0; i < this.popups.length; i++) {
        this.krpanoObj.call(`set(hotspot[popup${i}].enabled, ${isVideo});`);
      }
    },
    popupsVisible(){
      if (!this.krpanoObj) { return; }
      
      for (let i = 0; i < this.popups.length; i++) {
        this.krpanoObj.call(`set(hotspot[popup${i}].visible, ${this.popupsVisible});`);
      }
    }
  },
};

export default config;
