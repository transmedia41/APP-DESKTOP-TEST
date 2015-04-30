"use strict";angular.module("deskappApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","LocalStorageModule","angular.directives-round-progress","leaflet-directive","geolocation","ngProgress","bootstrapLightbox","ui.bootstrap","videosharing-embed"]).constant("Config",{API_URL:"http://hydromerta.di-rosa.ch:3000/",mapboxMapId:"hydromerta.lpkj6fe5",mapboxAccessToken:"pk.eyJ1IjoiaHlkcm9tZXJ0YSIsImEiOiJZTUlDdVA0In0.Z7qJF3weLg5WuPpzt6fMdA"}).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/login.html",controller:"MainCtrl"}).when("/tactic",{templateUrl:"views/tactic.html",controller:"MainSectorsCtrl"}).when("/actions",{templateUrl:"views/actions.html",controller:"MainActionsCtrl"}).when("/documents",{templateUrl:"views/documents.html",controller:"MainDocumentsCtrl"}).when("/mafia",{templateUrl:"views/mafia.html",controller:"MainMafiaCtrl"}).otherwise({redirectTo:"/"})}]).config(["$httpProvider",function(a){a.defaults.headers.common["Access-Control-Allow-Origin"]="*",a.defaults.headers.common["Access-Control-Allow-Methods"]="GET, POST, PUT, DELETE, OPTIONS",a.defaults.headers.common["Access-Control-Allow-Headers"]="Content-Type, X-Requested-With"}]).run(["ngProgress",function(a){a.color("#eeece1"),a.height(3)}]).service("SocketService",["$rootScope","localStorageService","Config",function(a,b,c){var d,e={connect:function(e){return b.isSupported?(b.set("wstoken",e),d=io.connect(c.API_URL,{query:"token="+e,"force new connection":!0}).on("connect",function(){a.$emit("connection"),d.emit("get user"),d.emit("has new document"),d.on("user responce",function(b){a.$emit("user responce",b)}),d.on("user responce 404",function(){console.log("user responce 404")})}).on("disconnect",function(){d.close(),b.isSupported&&b.remove("wstoken"),a.$emit("disconnected")}).on("error",function(b){a.$emit("UnauthorizedError"==b.type||"invalid_token"==b.code?"invalide token":"error token")})):void 0},getSocket:function(){return d}};return e}]).run(["localStorageService","SocketService",function(a,b){if(a.isSupported){var c=a.get("wstoken");c&&b.connect(c)}}]).run(["$rootScope","$location","localStorageService",function(a,b,c){a.$on("$routeChangeStart",function(d){if(c.isSupported){var e=c.get("wstoken");if(e)switch(console.log("autorized",b.path()),b.path()){case"/actions":c.set("currentPage","/actions"),a.$emit("update navbar");break;case"/tactic":c.set("currentPage","/tactic"),a.$emit("update navbar");break;case"/documents":c.set("currentPage","/documents"),a.$emit("update navbar");break;case"/mafia":c.set("currentPage","/mafia"),a.$emit("update navbar")}else console.log("not autorized"),b.path("/")}else a.$emit("localstorage not supported")})}]).run(["$rootScope","$location","localStorageService",function(a,b,c){a.$on("connection",function(b){console.log("connection"),a.gameBar=!0}),a.$on("register",function(a){console.log("register")}),a.$on("disconnected",function(d){console.log("disconnected"),c.set("last disconnect",Date.now()),a.gameBar=!1,c.remove("currentPage"),b.path("/")})}]).service("SectorService",["$rootScope","localStorageService","SocketService",function(a,b,c){function d(d){c.getSocket().emit("get sectors").on("sectors responce",function(a){b.set("sectors",a),b.set("last update sectors",Date.now()),g=a,d(g)}),c.getSocket().on("update sectors influence",function(b){f(b),a.$emit("new sector available")})}function e(a){angular.forEach(g,function(b,c){b.id==a.id&&(g[c]=a)}),b.set("sectors",g),b.set("last update sectors",Date.now())}function f(a){g=a,b.set("sectors",g),b.set("last update sectors",Date.now())}var g=[];a.$on("connection",function(b){c.getSocket().on("action polygon performed",function(b){e(b),a.$emit("new sector available")})});var h={getSectors:function(c){if(b.isSupported)if(b.get("sectors")){var e;e=b.get("last disconnect")?b.get("last disconnect"):0,e>b.get("last update sectors")?d(c):(g=b.get("sectors"),c(g))}else d(c);else a.$emit("localstorage not supported")},getSectorsLocal:function(a){a(g)},getActionPoint:function(){var a=[];return angular.forEach(g,function(b,c){angular.forEach(b.properties.actionsPoint,function(c){var d={};d.id=b.id,d.influence=b.properties.influence,c.sector=d,a.push(c)})}),a}};return h}]).controller("GameCoreCtrl",["$scope","$rootScope","SectorService",function(a,b,c){b.$on("connection",function(a){c.getSectors(function(a){b.$emit("sector available")})})}]).service("GameCoreService",function(){var a={getExpectedDrop:function(a,b){return 1}};return a}).run(["$rootScope",function(a){angular.extend(a,{getNbActionPerformed:function(b){var c=0;return angular.forEach(a.playerInfos.sectors,function(a){a.sector_id==b&&(c=a.actionsPerformed)}),c},isSectorActionPerformed:function(b,c){var d=!1;return angular.forEach(a.playerInfos.sectors,function(a){a.sector_id==b&&a.actionsPerformed>=c&&(d=!0)}),d}})}]),angular.module("deskappApp").service("HTTPAuhtService",["$http","localStorageService","Config",function(a,b,c){return{login:function(b){return a.post(c.API_URL+"login",b)},logout:function(){var d={};if(b.isSupported){var e=b.get("wstoken");e&&(d={token:e})}return a.post(c.API_URL+"logout",d)},register:function(b){return a.post(c.API_URL+"register",b)}}}]).controller("MainCtrl",["$scope","$modal","$log",function(a,b,c){a.openCredits=function(){var d=b.open({templateUrl:"views/modal_credits.html",controller:"ModalCreditsCtrl",size:"lg",resolve:{items:function(){return a.items}}});d.result.then(function(b){a.selected=b},function(){c.info("Modal dismissed at: "+new Date)})}}]).controller("mainBarController",["$rootScope","$scope","HTTPAuhtService","localStorageService",function(a,b,c,d){}]).controller("loginController",["$rootScope","$scope","$location","HTTPAuhtService","SocketService","localStorageService",function(a,b,c,d,e,f){function g(g){d.login(g).success(function(a,b,d,g){e.connect(a.token).on("connect",function(){f.set("currentPage","actions"),c.path("/actions")})}).error(function(c,d,e,f){b.error="Impossible de se connecter",setTimeout(function(){b.error=null,a.$apply()},2e3)})}b.loginFunc=function(){var a={username:b.username,password:b.password,plateform:"desktop"};g(a)},a.$on("register",function(a,b){var b={username:b.username,password:b.password,plateform:"desktop"};g(b)})}]).controller("registerController",["$rootScope","$scope","HTTPAuhtService",function(a,b,c){b.registerFunc=function(){if(b.password==b.confirm){var d={username:b.username,password:b.password};c.register(d).success(function(b,c,e,f){a.$emit("register",d)}).error(function(c,d,e,f){b.error="Impossible de s'enregistrer",setTimeout(function(){b.error=null,a.$apply()},2e3)})}else b.error="Confirmation de password invalide",setTimeout(function(){b.error=null,a.$apply()},2e3)}}]).controller("PanelController",function(){this.tab=1,this.selectTab=function(a){this.tab=a},this.isSelected=function(a){return this.tab===a}}).controller("ModalCreditsCtrl",["$scope","$modalInstance",function(a,b){a.ok=function(){b.close()}}]);var colors={rouge:"#9e1915",orangeFonce:"#ea590c",orange:"#ffca61",jaune:"#fff161",vert:"#089b6e"};angular.module("deskappApp").controller("MainSectorsCtrl",["$scope",function(a){}]).controller("SectorsCtrl",["$scope","$rootScope","$interval","ngProgress","SocketService","SectorService",function(a,b,c,d,e,f){a.progressInfluence={label:0,percentage:0},a.$watch("progressInfluence",function(a){a.percentage=a.label/100},!0),b.$on("click on sector",function(b,d){var e=Math.abs(a.progressInfluence.label-d.properties.influence);e>0&&c(function(){a.progressInfluence.label>d.properties.influence?a.progressInfluence.label--:a.progressInfluence.label++},10,e,!0,d)}),a.makeAction=function(b){d.start();var c={id:b,sector_id:a.completeSectorSelected.id};e.getSocket().emit("make action",c),a.closeDashboard()},b.$on("complete sector update after action",function(){d.complete()})}]).controller("SectorDashboardCtrl",["$scope","$rootScope","SectorService",function(a,b,c){a.visible=!1,a.closeDashboard=function(){a.visible=!1},b.$on("click on sector",function(b,c){a.visible=!0})}]).controller("MapSectorCtrl",["$scope","$rootScope","leafletData","geolocation","SectorService","GameCoreService","Config",function(a,b,c,d,e,f,g){function h(a){var b=a/3600,c=Math.floor(b);b=60*(b-c);var d=Math.floor(b),e=Math.floor(60*(b-d));return c+"h "+d+"'' "+e+"'"}var i="http://api.tiles.mapbox.com/v4/"+g.mapboxMapId+"/{z}/{x}/{y}.png?access_token="+g.mapboxAccessToken;a.paths={},a.geojson={},angular.extend(a,{defaults:{maxZoom:16,minZoom:14,attributionControl:!1,tileLayer:i,zoomControl:!1,reuseTiles:!0},maxbounds:{southWest:{lat:46.71,lng:6.5},northEast:{lat:46.85,lng:6.8}},mapCenter:{lat:46.779463,lng:6.638802,zoom:14},layers:{baselayers:{xyz:{name:"OpenStreetMap (XYZ)",url:i,type:"xyz"}},overlays:{markers:{type:"group",name:"Markers",visible:!1},circles:{type:"group",name:"Circles",visible:!1},sectors:{type:"group",name:"Sectors",visible:!0},yverdon:{type:"group",name:"Yverdon",visible:!1}}},updateActionDescription:function(b){if(b.isAvailable)b.disponibility="Maintenant";else{var c=b.coolDown+b.lastPerformed-Math.floor(Date.now()/1e3);b.disponibility=h(c)}a.actionSelected=b},addSectorsGeoJSONToMap:function(b){a.geojson={data:{type:"FeatureCollection",features:b},style:function(a){switch(!0){case a.properties.influence<=20:return{fillColor:colors.vert,weight:4,opacity:1,color:"white",dashArray:"9",fillOpacity:.7};case a.properties.influence>20&&a.properties.influence<=40:return{fillColor:colors.jaune,weight:4,opacity:1,color:"white",dashArray:"9",fillOpacity:.7};case a.properties.influence>40&&a.properties.influence<=60:return{fillColor:colors.orange,weight:4,opacity:1,color:"white",dashArray:"9",fillOpacity:.7};case a.properties.influence>60&&a.properties.influence<=80:return{fillColor:colors.orangeFonce,weight:4,opacity:1,color:"white",dashArray:"9",fillOpacity:.7};case a.properties.influence>80&&a.properties.influence<=100:return{fillColor:colors.rouge,weight:4,opacity:1,color:"white",dashArray:"9",fillOpacity:.7};default:return{fillColor:"#089b6e",weight:4,opacity:1,color:"white",dashArray:"9",fillOpacity:.7}}}}}}),e.getSectorsLocal(function(b){a.addSectorsGeoJSONToMap(b)}),b.$on("new sector available",function(){console.log("sectors update"),e.getSectorsLocal(function(b){a.addSectorsGeoJSONToMap(b)})}),b.$on("sector available",function(){console.log("sectors charged"),e.getSectorsLocal(function(b){a.addSectorsGeoJSONToMap(b)})}),a.$on("leafletDirectiveMap.geojsonClick",function(c,d,e){angular.forEach(d.properties.actionsPolygon,function(a,b){d.properties.actionsPolygon[b].isAvailable=a.lastPerformed+a.coolDown<Math.floor(Date.now()/1e3);({id:d.id,influence:d.properties.influence});d.properties.actionsPolygon[b].sectorInfluence=d.properties.influence}),a.completeSectorSelected=d,a.sectorSelected=d.properties,b.isSectorActionPerformed(d.id,d.properties.nbActions)?a.sectorSelected.fullLinkImg=g.API_URL+d.properties.character.portrait:(a.sectorSelected.fullLinkImg=g.API_URL+"portraits/unknown.png",a.sectorSelected.character.sectorDescription=""),a.nbActionPerformed=Math.min(b.getNbActionPerformed(d.id),d.properties.nbActions),a.updateActionDescription(d.properties.actionsPolygon[0]),b.$emit("click on sector",d)})}]),angular.module("deskappApp").controller("MainActionsCtrl",["$scope",function(a){}]).controller("ActionsCtrl",["$scope","SectorService",function(a,b){}]).controller("ActionDashboardCtrl",["$scope","$rootScope","SectorService","GameCoreService","SocketService",function(a,b,c,d,e){a.visible=!1,a.closeDashboard=function(){a.visible=!1},a.makeActionPoint=function(){e.getSocket().emit("make action point")},b.$on("click on marker",function(b,c){a.visible=!0,a.markerSelected=c,a.markerSelected.expectedDrop=d.getExpectedDrop(c.properties,c.sector)})}]).controller("MapActionCtrl",["$scope","$rootScope","leafletData","geolocation","SectorService","Config",function(a,b,c,d,e,f){var g="http://api.tiles.mapbox.com/v4/"+f.mapboxMapId+"/{z}/{x}/{y}.png?access_token="+f.mapboxAccessToken;angular.extend(a,{defaults:{maxZoom:18,minZoom:14,attributionControl:!1,tileLayer:g,zoomControl:!1},maxbounds:{southWest:{lat:46.749859206774524,lng:6.559438705444336},northEast:{lat:46.8027621127906,lng:6.731100082397461}},mapCenter:{lat:46.779463,lng:6.638802,zoom:15},layers:{baselayers:{xyz:{name:"OpenStreetMap (XYZ)",url:g,type:"xyz"}},overlays:{markers:{type:"group",name:"Markers",visible:!1},circles:{type:"group",name:"Circles",visible:!1},sectors:{type:"group",name:"Sectors",visible:!0},yverdon:{type:"group",name:"Yverdon",visible:!1}}},markers:{},geojson:{},addSectorsGeoJSONToMap:function(b){a.geojson={data:{type:"FeatureCollection",features:b},style:function(a){return{weight:5,opacity:1,color:"white",dashArray:"12",fillOpacity:.4}}}},addMarkersToMap:function(a){var b=[];return angular.forEach(a,function(a,c){var d={lat:a.geometry.coordinates[1],lng:a.geometry.coordinates[0],properties:a.properties,icon:{}};switch(a.properties.type.toLowerCase()){case"hydrante":d.icon.extraClasses="icon-hydrante",d.icon.iconImg="../img/hydrante.png";break;case"fontaine":d.icon.extraClasses="icon-fontaine",d.icon.iconImg="../img/fontaine.png";break;case"arrosage":d.icon.extraClasses="icon-arrosage",d.icon.iconImg="../img/arrosage.png";break;case"affiche":d.icon.extraClasses="icon-affiche",d.icon.iconImg="../img/affiche.png";break;case"toilettes":d.icon.extraClasses="icon-toilettes",d.icon.iconImg="../img/toilettes.png";break;case"bouche_egout":d.icon.extraClasses="icon-bouche_egout",d.icon.iconImg="../img/bouche-egout.png";break;case"dechet_lac":d.icon.extraClasses="icon-dechet_lac",d.icon.iconImg="../img/dechet-lac.png"}d.icon.type="extraMarker",d.icon.imgWidth=42,d.icon.imgHeight=52,b.push(d)}),b}}),e.getSectorsLocal(function(b){a.addSectorsGeoJSONToMap(b),a.markers=a.addMarkersToMap(e.getActionPoint())}),b.$on("new sector available",function(){console.log("sectors update"),e.getSectorsLocal(function(b){a.addSectorsGeoJSONToMap(b),a.markers=a.addMarkersToMap(e.getActionPoint())})}),b.$on("sector available",function(){console.log("sectors charged"),e.getSectorsLocal(function(b){a.addSectorsGeoJSONToMap(b),a.markers=a.addMarkersToMap(e.getActionPoint())})}),a.$on("leafletDirectiveMarker.click",function(a,c,d){b.$emit("click on marker",c.model)})}]),angular.module("deskappApp").controller("MainDocumentsCtrl",["$scope",function(a){}]).config(["$sceDelegateProvider",function(a){a.resourceUrlWhitelist(["self","https://vimeo.com/**","http://localhost:3000/**"])}]).service("DocumentService",["$rootScope","SocketService",function(a,b){var c=[],d={getDocuments:function(a){b.getSocket().emit("get my documents").on("my documents responce",function(b){c=b,a(b)})},getDocumentsLocal:function(){return c}};return d}]).filter("convertName",function(){return function(a){var b=a;return b="video"===a?"play":"photo"===a?"camera":"picture"}}).config(["LightboxProvider",function(a){a.templateUrl="views/Lightbox.html"}]).controller("DocumentsCtrl",["$scope","DocumentService","SocketService","localStorageService","Lightbox","Config","$modal","$log",function(a,b,c,d,e,f,g,h){b.getDocuments(function(b){console.log("documents",b),a.rootUrl=f.API_URL,a.$apply(a.documentsList=b)}),a.items=["item1","item2","item3"],a.open=function(b,d){a.items=d,c.getSocket().emit("document vu",d.id),console.log(a.items);var e=g.open({templateUrl:"views/modal.html",controller:"ModalInstanceCtrl",size:b,resolve:{items:function(){return a.items}}});e.result.then(function(b){a.selected=b},function(){h.info("Modal dismissed at: "+new Date)})},this.tab=1,this.selectTab=function(a){console.log("click"),this.tab=a},this.isSelected=function(a){return this.tab===a}}]).controller("ModalInstanceCtrl",["$scope","$modalInstance","items","Config","$sce",function(a,b,c,d,e){a.rootUrl=d.API_URL,a.items=c,a.selected={item:a.items[0]},a.ok=function(){b.close(a.selected.item)},a.cancel=function(){b.dismiss("cancel")}}]).controller("panelController",["$scope","$sce",function(a,b){this.tab=1,this.selectTab=function(a){this.tab=a},this.isSelected=function(a){return this.tab===a}}]),angular.module("deskappApp").controller("MainMafiaCtrl",["$scope",function(a){}]).service("CharacterService",["$rootScope","SocketService",function(a,b){var c=[],d={getCharacters:function(a){b.getSocket().emit("get my characters").on("my characters responce",function(b){c=b,a(b)})},getCharactersLocal:function(){return c}};return d}]).controller("MafiaCtrl",["$scope","CharacterService","Config","SocketService","$rootScope",function(a,b,c,d,e){a.showDesc=!1,a.desc_available=!1,a.active=[],b.getCharacters(function(b){a.characters=b,a.showMafiosiContent(b[0]),a.$apply()}),a.showMafiosiContent=function(b){console.log(b),d.getSocket().emit("character vu",b.id),a.active=[],a.active[b.char_id-1]="active",a.locked=null,a.showDesc=!0,b.available||(a.locked="locked"),a.desc_available=b.available,a.showDescNotAvaible=!0,a.desc_lastname=b.lastname,a.desc_status=b.status,a.desc_firstname=b.firstname,a.desc_nickname=b.nickname,a.desc_portrait=c.API_URL+b.portrait,a.desc_life=b.life,a.desc_personality=b.personality,a.desc_twitch=b.twitch,a.desc_vice=b.vice,a.desc_drink=b.drink,a.desc_strength=b.strength,a.desc_weakness=b.weakness,a.desc_distinctive=b.distinctive,a.desc_body=b.body,a.desc_family=b.family,a.desc_weapon=b.weapon}}]),angular.module("deskappApp").factory("GeoJSONLayers",function(){var a=function(){this.clear()};return a.prototype.clear=function(){this.json={type:"FeatureCollection",features:[]},this.layerStyles={}},a.prototype.addLayer=function(a,b,c){this.layerStyles[a]=c,b.features.forEach(function(b,c){b.properties.__LAYERID__=a}),Array.prototype.push.apply(this.json.features,b.features)},a.prototype.removeLayer=function(a){var b=this.json.features,c=0;for(delete this.layerStyles[a];c<b.length;++c)feature=b[c],feature.properties.__LAYERID__==a&&(b.splice(c,1),--c)},a.prototype.__handleStyle=function(a){return void 0===a.properties.__LAYERID__?{}:this.layerStyles[a.properties.__LAYERID__](a)},a.prototype.get=function(){var a=this;return{data:this.json,style:function(b){return a.__handleStyle.call(a,b)},resetStyleOnMouseout:!0}},a}),angular.module("deskappApp").controller("NavBarCtrl",["$rootScope","$scope","$location","CharacterService","SocketService","localStorageService",function(a,b,c,d,e,f){function g(){b.actionsBtn=!1,b.tacticBtn=!1,b.documentsBtn=!1,b.mafiaBtn=!1}function h(){if(f.get("currentPage"))switch(f.get("currentPage")){case"/actions":b.goToActions();break;case"/tactic":b.goToTactic();break;case"/documents":b.goToDocuments();break;case"/mafia":b.goToMafia()}}f.get("notifDoc")?b.notifDoc=f.get("notifDoc"):b.notifDoc=0,f.get("notifChar")?b.notifChar=f.get("notifChar"):b.notifChar=0,g(),b.goToActions=function(){g(),b.actionsBtn=!0},b.goToTactic=function(){g(),b.tacticBtn=!0},b.goToDocuments=function(){g(),b.documentsBtn=!0},b.goToMafia=function(){g(),b.mafiaBtn=!0},h(),a.$on("update navbar",function(){h()}),a.$on("connection",function(a){e.getSocket().emit("get character count"),e.getSocket().on("character count responce",function(a){b.$apply(b.notifChar=a),f.set("notifChar",a)}),e.getSocket().on("update character count",function(a){b.$apply(b.notifChar=a),f.set("notifChar",a)}),e.getSocket().emit("get document count"),e.getSocket().on("document count responce",function(a){b.$apply(b.notifDoc=a),f.set("notifDoc",a)}),e.getSocket().on("update document count",function(a){b.$apply(b.notifDoc=a),f.set("notifDoc",a)})})}]).controller("mainBarGameController",["$rootScope","$scope","$timeout","HTTPAuhtService","SocketService","localStorageService",function(a,b,c,d,e,f){function g(d){b.playerInfos=d.username,b.playerRank=d.level.rankName,b.level=d.level.level,11==d.level.level?(b.nbXP=d.xp,c(function(){b.progressBar={transition:"width 1s ease-in-out",width:"100%"}},200)):(b.nbXP=d.xp-d.level.xp,b.nextLvlXP=d.level.xpMax+1-d.level.xp,c(function(){b.progressBar={transition:"width 1s ease-in-out",width:(d.xp-d.level.xp)/(d.level.xpMax-d.level.xp)*100+"%"}},200)),c(function(){a.$emit("complete sector update after action")},1e3),b.rankClass=function(){return"icon-"+d.level.icon},b.$apply()}a.playerInfos={},b.playerInfos="",b.logoutFunc=function(){if(f.isSupported){var a=f.get("wstoken");a&&d.logout().success(function(a,b,c,d){}).error(function(a,b,c,d){})}},a.$on("user responce",function(b,c){a.playerInfos=c,g(c)}),a.$on("connection",function(b){e.getSocket().on("user update",function(b){a.playerInfos=b,g(b)})}),a.$on("disconnected",function(c,d){a.playerInfos={},b.playerInfos="",b.playerRank="",b.progressBar={transition:"width 1s ease-in-out",width:"0%"},b.$apply()}),b.progressBar={transition:"width 1s ease-in-out"}}]).service("MessagesService",["$rootScope","localStorageService","SocketService",function(a,b,c){function d(c){if(b.get("messages")){var d=b.get("messages");"undefined"!=typeof d[a.playerInfos.id]?d[a.playerInfos.id].push({title:"Nouveau rang",content:c}):(d={},d[a.playerInfos.id]=[],d[a.playerInfos.id].push({title:"Nouveau rang",content:c})),e=d[a.playerInfos.id],b.set("messages",JSON.stringify(d))}else{var f={};f[a.playerInfos.id]=[],f[a.playerInfos.id].push({title:"Nouveau rang",content:c}),e=f[a.playerInfos.id],b.set("messages",JSON.stringify(f))}}var e=[];return a.$on("connection",function(){c.getSocket().on("new rank",function(b){d(b),a.$emit("new messages")})}),{getMessages:function(){var c=b.get("messages");return"undefined"!=typeof c[a.playerInfos.id]?c[a.playerInfos.id]:[]},killMessage:function(c){console.log(c);var d=[],e=b.get("messages");angular.forEach(e[a.playerInfos.id],function(a,b){console.log(a.content,c.content),a.content!=c.content&&d.push(a)}),e[a.playerInfos.id]=[],e[a.playerInfos.id]=d,console.log(e[a.playerInfos.id],d),b.set("messages",JSON.stringify(e)),a.$emit("new messages")},hasMessages:function(){var c=b.get("messages");return"undefined"!=typeof c[a.playerInfos.id]?c[a.playerInfos.id].length:!1}}}]).filter("reverse",function(){return function(a){return a.slice().reverse()}}).controller("MessagesCtrl",["$rootScope","$scope","$location","MessagesService",function(a,b,c,d){b.messages=[],b.hasMessages=!1,a.$on("new messages",function(){console.log("new messages"),b.messages=d.getMessages(),b.hasMessages=d.hasMessages()}),a.$on("user responce",function(){console.log("user responce"),console.log(d.getMessages()),b.messages=d.getMessages(),b.hasMessages=d.hasMessages()}),b.closeMessage=function(a){d.killMessage(a)}}]);