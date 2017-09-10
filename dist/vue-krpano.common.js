'use strict';

/**
 * Created by chenshu on 02/03/2017.
 */var krpanoProps = {bgcolor:{type:String},wmode:{type:String,default:"opaque"},vars:{type:Object},initvars:{type:Object},basepath:{type:String},mwheel:{type:Boolean,default:false},focus:{type:Boolean,default:true},consolelog:{type:Boolean,default:false},mobilescale:{type:Number,default:0.5},fakedevice:{type:String},passQueryParameters:{type:Boolean,default:false},webglsettings:{type:Object}};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Created by chenshu on 02/03/2017.
 */var _window=window; var embedpano=_window.embedpano; var removepano=_window.removepano;if(embedpano==undefined||removepano==undefined){throw new Error("krpano player is required");}var config$2={props:_extends({xml:{type:String,required:true},scene:{type:String},hooks:{type:Object},lookat:{type:Boolean},hlookat:{type:Number,default:0},vlookat:{type:Number,default:0},webvr:{type:Number},debug:{type:Boolean,default:false}},krpanoProps),data:function data(){return{createLock:false,krpanoObjId:"krpano_"+Math.floor(Math.random()*(100000-100+1)+100)};},methods:{createPano:function createPano(){if(!this.createLock&&!this.krpanoObj){this.createLock=true;var vm=this;this.$el.id=this.krpanoObjId+"_container";embedpano({id:this.krpanoObjId,target:this.$el.id,xml:this.xml,bgcolor:this.bgcolor,wmode:this.wmode,vars:this.vars,initvars:this.initvars,basepath:this.basepath,mwheel:this.mwheel,focus:this.focus,consolelog:this.consolelog,mobilescale:this.mobilescale,fakedevice:this.fakedevice,passQueryParameters:this.passQueryParameters,webglsettings:this.webglsettings,onready:function onready(krpanoObj){vm.krpanoObj=krpanoObj;vm.krpanoObj.hooks=vm.hooks;vm.log("pano created");vm.$emit("panoCreated",vm.krpanoObj);vm.createLock=false;},onerror:function onerror(msg){vm.$emit("panoError",msg);vm.createLock=false;}});}},removePano:function removePano(){if(this.krpanoObj){removepano(this.krpanoObj.id);this.log("pano removed");delete this.krpanoObj;}},loadScene:function loadScene(){var _this=this;var scene=this.scene;if(this.krpanoObj&&scene){var str="if(scene["+scene+"]===null,\n                        loadscene(get(scene[0].name),null,MERGE,BLEND(0.5)),\n                        loadscene("+scene+",null,MERGE,BLEND(0.5)))";this.krpanoObj.call(str);if(this.lookat){setTimeout(function(){console.log(_this.vlookat);_this.krpanoObj.set("view.hlookat",_this.hlookat);_this.krpanoObj.set("view.vlookat",_this.vlookat);},50);}this.log("scene changed: "+scene);this.$emit("sceneChanged",scene);}},enterVr:function enterVr(){var scene=this.scene;if(this.krpanoObj&&scene){console.log(scene,'enterVr');}},log:function log(content){if(this.debug){if(this.krpanoObj){content="["+this.krpanoObj.id+"] "+content;}console.debug(content);}}},watch:{xml:function xml(oldXml,newXml){if(this.krpanoObj&&newXml){if(oldXml){newXml=newXml.split("/").pop();}this.krpanoObj.call("loadpano("+newXml+",null,IGNOREKEEP)");this.$emit("xmlChanged",newXml);this.log("xml changed: "+newXml);}},scene:function scene(){this.loadScene();},webvr:function webvr(value){if(this.krpanoObj){this.krpanoObj.call('webvr.toggleVR();');}}},created:function created(){this.$on(["panoCreated","xmlChanged"],this.loadScene);},beforeDestroy:function beforeDestroy(){this.removePano();}};

/**
 * Created by chenshu on 02/03/2017.
 */var config$3={props:{lazyLoad:{type:Boolean,default:true}},mounted:function mounted(){if(this.lazyLoad){this.createLock=true;this.scrollListener();window.addEventListener("scroll",this.scrollListener);}else{this.createPano();}},methods:{scrollListener:function scrollListener(){var rect=this.$el.getBoundingClientRect();if(-rect.top>rect.height||rect.top>window.innerHeight){//屏幕之外
if(this.krpanoObj){this.krpanoObj.call("if(autorotate.enabled,autorotate.pause())");this.log("out of screen: autorotate paused");}}else{//屏幕之内
if(!this.krpanoObj){this.createLock=false;//lazy load
this.createPano();}else{this.krpanoObj.call("if(autorotate.enabled,autorotate.resume())");this.log("in screen: autorotate resumed");}}}}};

/**
 * Created by chenshu on 03/03/2017.
 */var config$4={props:{freezeVertical:{type:Boolean,default:false}},data:function data(){return{eventDelegate:undefined};},methods:{},watch:{freezeVertical:function freezeVertical(val){if(this.eventDelegate){if(val){this.eventDelegate.style.display="block";var hlookat=this.krpanoObj.get("view.hlookat");this.krpanoObj.call("lookat("+hlookat+",0)");}else{this.eventDelegate.style.display="none";}}}},created:function created(){var _this=this;if(TouchEvent){this.$on("panoCreated",function(krpano){var origin=krpano.firstChild;var eventDelegate=document.createElement("DIV");eventDelegate.className="event-delegate";Object.assign(eventDelegate.style,{display:_this.freezeVertical?"block":"none",width:"100%",height:"100%",position:"absolute","user-select":"none","z-index":1});krpano.appendChild(eventDelegate);_this.eventDelegate=eventDelegate;var originTouch=void 0;eventDelegate.addEventListener("touchstart",function(e){originTouch=e;Object.defineProperty(e,"cancelable",{value:true});var event=new TouchEvent("touchstart",e);return origin.dispatchEvent(event);});eventDelegate.addEventListener("touchend",function(e){Object.defineProperty(e,"cancelable",{value:true});var event=new TouchEvent("touchend",e);return origin.dispatchEvent(event);});eventDelegate.addEventListener("touchmove",function(e){var currentTouch=e.changedTouches[0];var deltaX=originTouch.clientX-currentTouch.clientX;var hlookat=krpano.get("view.hlookat")+deltaX;var vlookat=krpano.get("view.vlookat");krpano.call("lookat("+hlookat+","+vlookat+")");originTouch=currentTouch;return true;});eventDelegate.addEventListener("mousedown",function(e){Object.defineProperty(e,"cancelable",{value:true});return origin.dispatchEvent(new MouseEvent("mousedown",e));});eventDelegate.addEventListener("mousewheel",function(e){Object.defineProperty(e,"cancelable",{value:true});return origin.dispatchEvent(new MouseEvent("mousewheel",e));});});}}};

/**
 * Created by chenshu on 02/03/2017.
 */var config$5={props:{hotspots:{type:Array,default:function _default(){return[];}}},mounted:function mounted(){this.createHotspots();},methods:{addHotspot:function addHotspot(it,_ref){var v=_ref.v,h=_ref.h,scale=_ref.scale,view=_ref.view;var spotname='hotspot'+it;var position='';var cropW=251;var cropH=410;if(v>10){position='bottom';}else if(v<-10){position='top';}else{cropW=350;cropH=571;position='middle';}var url='./static/panoramas/interface/pin_'+position+'.png';this.krpanoObj.call('\n        addhotspot('+spotname+');\n        set(hotspot['+spotname+'].url, '+url+');\n        set(hotspot['+spotname+'].ath, '+h+');\n        set(hotspot['+spotname+'].atv, '+v+');\n        set(hotspot['+spotname+'].distorted, true);\n        set(hotspot['+spotname+'].scale, '+scale+');\n        set(hotspot['+spotname+'].onloaded, do_crop_animation('+cropW+','+cropH+', 25));\n        set(hotspot['+spotname+'].onclick, jscall(calc(\'krpano.hooks.gotoView('+view+')\')) );\n      ');},createHotspots:function createHotspots(){var _this=this;if(!this.krpanoObj){setTimeout(function(){_this.createHotspots();},2000);return;}else{for(var i=0;i<this.hotspots.length;i++){this.addHotspot(i,this.hotspots[i]);}}}},watch:{hotspots:function hotspots(){this.createHotspots();}}};

/**
 * Created by chenshu on 02/03/2017.
 */var config$6={props:{popups:{type:Array,default:function _default(){return[];}}},mounted:function mounted(){this.createPopups();},methods:{addPopup:function addPopup(it,_ref){var v=_ref.v,h=_ref.h,scale=_ref.scale,title=_ref.title,content=_ref.content,video=_ref.video,loop=_ref.loop;var spotname="popup"+it;var url='./static/panoramas/interface/hotspot_sprite.png';this.krpanoObj.call("\n        addhotspot("+spotname+");\n        set(hotspot["+spotname+"].url, "+url+");\n        set(hotspot["+spotname+"].ath, "+h+");\n        set(hotspot["+spotname+"].atv, "+v+");\n        set(hotspot["+spotname+"].scale, "+scale+");\n        set(hotspot["+spotname+"].onloaded, do_crop_animation(250,250, 25));\n        set(hotspot["+spotname+"].onclick, jscall(calc('krpano.hooks.openPopup(\""+video+"\", "+loop+", "+v+", "+h+")')));\n      ");},createPopups:function createPopups(){var _this=this;if(!this.krpanoObj){setTimeout(function(){_this.createPopups();},2000);return;}else{for(var i=0;i<this.popups.length;i++){this.addPopup(i,this.popups[i]);}}}},watch:{popups:function popups(){this.createPopups();}}};

/**
 * Created by chenshu on 02/03/2017.
 */var config$7={props:{video:{type:Object,default:function _default(){return{};}}},data:function data(){return{hotspotName:null};},mounted:function mounted(){this.createVideo();},methods:{removeCurrentVideo:function removeCurrentVideo(){if(this.hotspotName){this.krpanoObj.call("\n          removehotspot("+this.hotspotName+");\n          removehotspot("+this.hotspotName+"_img);\n          removehotspot("+this.hotspotName+"_close);\n        ");}},addVideo:function addVideo(_ref){var _this=this;var v=_ref.v,h=_ref.h,scale=_ref.scale,video=_ref.video;this.removeCurrentVideo();if(video==undefined)return;this.hotspotName=video;var videoUrl="./static/popups/"+this.hotspotName+".mp4";var imageUrl="./static/popups/"+this.hotspotName+".png";var closeUrl='./static/panoramas/interface/close.png';this.krpanoObj.call("\n        addhotspot("+this.hotspotName+");\n        set(hotspot["+this.hotspotName+"].url, ./static/panoramas/videoplayer_basic_source.js);\n        set(hotspot["+this.hotspotName+"].videourl, "+videoUrl+");\n        set(hotspot["+this.hotspotName+"].ath, "+h+");\n        set(hotspot["+this.hotspotName+"].atv, "+v+");\n        set(hotspot["+this.hotspotName+"].alpha, 1);\n        set(hotspot["+this.hotspotName+"].distorted, true);\n        set(hotspot["+this.hotspotName+"].scale, 0.2);\n      ");setTimeout(function(){_this.krpanoObj.call("\n          addhotspot("+_this.hotspotName+"_img);\n          set(hotspot["+_this.hotspotName+"_img].url, "+imageUrl+");\n          set(hotspot["+_this.hotspotName+"_img].ath, "+h+");\n          set(hotspot["+_this.hotspotName+"_img].atv, "+v+");\n          set(hotspot["+_this.hotspotName+"_img].distorted, true);\n          set(hotspot["+_this.hotspotName+"_img].scale, 0.2);\n        ");_this.krpanoObj.call("\n          addhotspot("+_this.hotspotName+"_close);\n          set(hotspot["+_this.hotspotName+"_close].url, "+closeUrl+");\n          set(hotspot["+_this.hotspotName+"_close].ath, "+(h+28)+");\n          set(hotspot["+_this.hotspotName+"_close].atv, "+(v-18)+");\n          set(hotspot["+_this.hotspotName+"_close].distorted, true);\n          set(hotspot["+_this.hotspotName+"_close].scale, 0.25);\n          set(hotspot["+_this.hotspotName+"_close].onclick, jscall(calc('krpano.hooks.openPopup()')));\n        ");},1000);},createVideo:function createVideo(){var _this2=this;if(!this.krpanoObj){setTimeout(function(){_this2.createVideo();},2000);return;}else{this.addVideo(this.video);}}},watch:{video:function video(){this.createVideo();}}};

/**
 * Created by chenshu on 02/03/2017.
 */var config={mixins:[config$2,config$3,config$4,config$5,config$6,config$7],template:"<div class='vue-krpano'></div>",mounted:function mounted(){this.createPano();}};

module.exports = config;
