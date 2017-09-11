/**
 * Created by chenshu on 02/03/2017.
 */
"use strict";

let config = {
  props: {
    video: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      hotspotName: null
    };
  },
  mounted(){
    this.createVideo();
  },
  methods: {
    removeCurrentVideo() {
      if (this.hotspotName) {
        this.krpanoObj.call(`
          removehotspot(${this.hotspotName});
          removehotspot(${this.hotspotName}_img);
          removehotspot(${this.hotspotName}_close);
        `);
      }
    },
    addVideo({v, h, scale, video}) {
      this.removeCurrentVideo();
      if (video == undefined) return;
      
      this.hotspotName = video;
      const videoUrl = `./static/popups/${this.hotspotName}.mp4`;
      const imageUrl = `./static/popups/${this.hotspotName}.png`;
      const closeUrl = './static/panoramas/interface/close.png';

      this.krpanoObj.call(`
        addhotspot(${this.hotspotName});
        set(hotspot[${this.hotspotName}].url, ./static/panoramas/videoplayer_basic_source.js);
        set(hotspot[${this.hotspotName}].videourl, ${videoUrl});
        set(hotspot[${this.hotspotName}].ath, ${h});
        set(hotspot[${this.hotspotName}].atv, ${v});
        set(hotspot[${this.hotspotName}].enabled, false);
        set(hotspot[${this.hotspotName}].alpha, 1);
        set(hotspot[${this.hotspotName}].distorted, true);
        set(hotspot[${this.hotspotName}].scale, 0.2);
      `);

      setTimeout(() => {
        this.krpanoObj.call(`
          addhotspot(${this.hotspotName}_img);
          set(hotspot[${this.hotspotName}_img].url, ${imageUrl});
          set(hotspot[${this.hotspotName}_img].ath, ${h});
          set(hotspot[${this.hotspotName}_img].atv, ${v});
          set(hotspot[${this.hotspotName}_img].enabled, false);
          set(hotspot[${this.hotspotName}_img].distorted, true);
          set(hotspot[${this.hotspotName}_img].scale, 0.2);
        `);

        this.krpanoObj.call(`
          addhotspot(${this.hotspotName}_close);
          set(hotspot[${this.hotspotName}_close].url, ${closeUrl});
          set(hotspot[${this.hotspotName}_close].ath, ${h + 28});
          set(hotspot[${this.hotspotName}_close].atv, ${v - 16});
          set(hotspot[${this.hotspotName}_close].distorted, true);
          set(hotspot[${this.hotspotName}_close].scale, 0.5);
          set(hotspot[${this.hotspotName}_close].onclick, jscall(calc('krpano.hooks.openPopup()')));
        `);
      }, 1000);

    },
    createVideo() {
      if (!this.krpanoObj) {
        setTimeout(() => { this.createVideo(); }, 2000);
        return;
      } else {
        this.krpanoObj.call('webvr.enterVR();');
        this.addVideo(this.video);
      }
    }
  },
  watch: {
    video(){
      this.createVideo();
    }
  },
};

export default config;
