!function($,window,document,undefined){"use strict";var HelperFunctions={getHostname:function(){return window.location.hostname},getProgramNumberFromUrl:function(){if(void 0!==window.location)return/.*program\/\d+$/.test(window.location.pathname)?HelperFunctions.getLastValue(window.location.pathname):void 0},getLastValue:function(uri){if(void 0!==uri&&"string"==typeof uri)return uri.match(/\d+$/)[0]},removeDomainAndQuery:function(uri){if(void 0!==uri&&"string"==typeof uri){var hostname=HelperFunctions.getHostname();return uri.indexOf(window.location.protocol)>=0&&(uri=uri.replace(window.location.protocol+"//","")),uri.indexOf(hostname)>=0&&(uri=uri.replace(hostname,"")),uri=HelperFunctions.removeQueryParameterFromUri(uri)}},removeQueryParameterFromUri:function(uri){if(void 0!==uri&&"string"==typeof uri)return uri.indexOf("?")>=0&&(uri=uri.substring(0,uri.indexOf("?"))),uri},isNullOrWhitespace:function(text){if(void 0!==text&&"string"==typeof text)return!text||""===text.trim()}};window.HelperFunctions=HelperFunctions}(window.jQuery,window,document),function($,window,document,undefined){"use strict";var UrlMapper={map:function(url,mappings){return url=url||window.location.href||"",mappings=mappings||[],$.each(mappings,function(j,map){if(map.RegEx.test(url))return url=url.match(map.RegEx)[map.ValueIndex]}),url}};window.UrlMapper=UrlMapper}(window.jQuery,window,document),function($,window,document,undefined){"use strict";var TrackingObjectFactory={createArray:function(trackingObjectArray){var returnArray=[];return jQuery.each(trackingObjectArray,function(index,elementToTrack){returnArray.push(TrackingObjectFactory.createObj(elementToTrack))}),returnArray},createObj:function(obj){var trackingObject=new TrackingObject;return Object.keys(obj).forEach(function(key,index){switch(key){case"BaseSelector":trackingObject.addBaseSelector(obj[key]);break;case"SubSelector":trackingObject.addSubSelector(obj[key]);break;default:trackingObject.addEventParameter(key,obj[key])}}),AnalyticsTracker.debugOutput&&AnalyticsTracker.isBaseSeletorValid(trackingObject.baseSelector),trackingObject}};window.TrackingObjectFactory=TrackingObjectFactory}(window.jQuery,window,document),function($,window,document,undefined){"use strict";var TrackingObject;(TrackingObject=function(){this.baseSelector="",this.subSelector="",this.eventParameter={}}).prototype.addBaseSelector=function(baseSelector){return this.baseSelector=baseSelector,this},TrackingObject.prototype.addSubSelector=function(subSelector){return this.subSelector=subSelector,this},TrackingObject.prototype.addEventParameter=function(key,value){return this.eventParameter[key]=value,this},TrackingObject.prototype.getEventParameter=function(){return this.eventParameter},TrackingObject.prototype.hasSubSelector=function(){return this.subSelector.length>0},TrackingObject.prototype.copy=function(){var copy=new TrackingObject,toCopy=this;return Object.keys(toCopy).forEach(function(key,index){copy[key]="object"==typeof copy[key]?Object.assign({},toCopy[key]):toCopy[key]}),copy},TrackingObject=TrackingObject,window.TrackingObject=TrackingObject}(window.jQuery,window,document),function($,window,document,undefined){"use strict";var AnalyticsTracker;AnalyticsTracker={debugOutput:!1,isSending:!0,trackingFunction:void 0,validDownloadExtensions:[],trackingVarMap:[],initialize:function(trackingFunction,map,validDownloadExtensions){AnalyticsTracker.trackingFunction=trackingFunction,AnalyticsTracker.trackingVarMap=map,AnalyticsTracker.validDownloadExtensions=validDownloadExtensions},addEventParameter:function(obj,eventParameter){obj.data=obj.data||{},obj.data.eventParameter=eventParameter},trackEmails:function(parameter){parameter.BaseSelector='a[href^="mailto"]';var trackingObject=TrackingObjectFactory.createObj(parameter);AnalyticsTracker.trackOnClickEvent(trackingObject)},trackOnKeyPressEnter:function(parameter){var trackingObject=TrackingObjectFactory.createObj(parameter);jQuery(trackingObject.baseSelector).keypress(function(e){13==e.which&&(AnalyticsTracker.addEventParameter(e,trackingObject.getEventParameter()),AnalyticsTracker.resolve(e))})},resolve:function(event){var params=event.data.eventParameter;Object.keys(params).forEach(function(key,index){"function"==typeof params[key]&&key.indexOf("callback")<0&&(params[key]=params[key](event.currentTarget))}),AnalyticsTracker.sendEvent(event.currentTarget,params)},mapEventParameter:function(actions){var mapped={};return Object.keys(actions).forEach(function(key,index){var mapIndex=AnalyticsTracker.trackingVarMap.findIndex(function(x){return key in x});if(mapIndex>=0){var mappedKey=AnalyticsTracker.trackingVarMap[mapIndex][key];("string"==typeof actions[key]&&!1===HelperFunctions.isNullOrWhitespace(actions[key])||"number"==typeof actions[key])&&(mapped[mappedKey]=actions[key])}else mapped[key]=actions[key]}),mapped},sendEvent:function(element,eventParameter){var mapped=AnalyticsTracker.mapEventParameter(eventParameter);!0===AnalyticsTracker.debugOutput&&(console.log("send event:"),console.log(AnalyticsTracker.printObjectParameter(mapped))),!0===AnalyticsTracker.isSending&&AnalyticsTracker.trackingFunction("event",eventParameter.Action,mapped)},trackOnClickJavaScript:function(trackingObject){jQuery(trackingObject.baseSelector).each(function(){$(this).attr("data-href",$(this).attr("href"))}),jQuery(trackingObject.baseSelector).on("click",function(e){var tracking_copy=trackingObject.copy();AnalyticsTracker.addEventParameter(e,tracking_copy.getEventParameter()),AnalyticsTracker.resolve(e)})},trackOnClickEvent:function(trackingObject){trackingObject.hasSubSelector()?jQuery(trackingObject.baseSelector).on("click",trackingObject.subSelector,{eventParameter:trackingObject.getEventParameter()},AnalyticsTracker.resolve):jQuery(trackingObject.baseSelector).on("click",{eventParameter:trackingObject.getEventParameter()},AnalyticsTracker.resolve)},registerElementsForClickTracking:function(trackingList){jQuery.each(trackingList,function(index,trackingObjectToTrack){AnalyticsTracker.trackOnClickEvent(trackingObjectToTrack)})},trackOutboundAndDownloads:function(parameter){jQuery("a:not([href^='#'])").filter(function(){return/^http.*/.test(this.href)}).each(function(){var _hostDomain=HelperFunctions.getHostname();this.href.indexOf(_hostDomain)<0?jQuery(this).on("click",function(sender){if(void 0!==this.href){var url=this.href,trackingObject=TrackingObjectFactory.createObj(parameter.Outbound);"_blank"!==jQuery(this).attr("target")&&(trackingObject=trackingObject.addEventParameter("event_callback",function(){document.location=url})),AnalyticsTracker.addEventParameter(sender,trackingObject.getEventParameter()),AnalyticsTracker.resolve(sender)}}):jQuery(this).filter(function(){return AnalyticsTracker.validDownloadExtensions.test(this.href)}).each(function(){jQuery(this).on("click",function(sender){var trackingObject=TrackingObjectFactory.createObj(parameter.Downloads);AnalyticsTracker.addEventParameter(sender,trackingObject.getEventParameter()),AnalyticsTracker.resolve(sender)})})})},isBaseSeletorValid:function(baseSelector){var isValid=!1;return $(baseSelector).length?(console.log("Selector found: "+baseSelector),isValid=!0):console.log("%cSelector not found: "+baseSelector,"color:red"),isValid},printObjectParameter:function(obj){var output="";return Object.keys(obj).forEach(function(key,index){output+=key+": "+obj[key]+"\r\n"}),output}},window.AnalyticsTracker=AnalyticsTracker}(window.jQuery,window,document),function($,window,document,undefined){var YoutubeTracker;YoutubeTracker={analyticsTracker:void 0,percentageToTrack:[25,50,75],playerArray:[],players:[],intervalId:0,initialize:function(analyticsTracker){YoutubeTracker.analyticsTracker=analyticsTracker},getPercentage:function(id){return void 0===YoutubeTracker.players[id]&&(YoutubeTracker.players[id]={}),void 0===YoutubeTracker.players[id].timePercent&&(YoutubeTracker.players[id].timePercent=0),YoutubeTracker.players[id].timePercent},setPercentage:function(id,value){void 0===YoutubeTracker.players[id]&&(YoutubeTracker.players[id]={}),YoutubeTracker.players[id].timePercent=value},getId:function(event){return event.getVideoData().video_id},registerYoutubeVideos:function(){var regex=/(http)?s?\:?\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?.*)?/;$("iframe").each(function(i,element){if(!regex.test(element.src))return!1;$(this).load(function(){var matches=element.src.match(regex);$(element).attr("data-video-id",matches[2]),YoutubeTracker.onYouTubeIframeAPIReady(element,matches[2])})})},checkStateChange:function(event){var player=event.target,id=YoutubeTracker.getId(player);player.PlayerState=event.data,event.data==YT.PlayerState.UNSTARTED&&(player.lastPlayerState=YT.PlayerState.UNSTARTED),event.data==YT.PlayerState.PLAYING&&player.lastPlayerState!=YT.PlayerState.PLAYING&&(player.lastPlayerState=YT.PlayerState.PLAYING,YoutubeTracker.trackEvent(player,id,"play",""),YoutubeTracker.startChecking(player)),event.data==YT.PlayerState.PAUSED&&(player.lastPlayerState=YT.PlayerState.PAUSED,YoutubeTracker.trackEvent(player,id,"pause","")),event.data==YT.PlayerState.ENDED&&(player.lastPlayerState=YT.PlayerState.ENDED,YoutubeTracker.setPercentage(id,0),YoutubeTracker.trackEvent(player,id,"watched-100%",""))},startChecking:function(player){0===YoutubeTracker.intervalId&&(YoutubeTracker.intervalId=setInterval(YoutubeTracker.checkPercentage,500));var id=YoutubeTracker.getId(player),isAdded=!1;Object.keys(YoutubeTracker.players).forEach(function(key,index){key==id&&(isAdded=!0)}),!1===isAdded&&(YoutubeTracker.players[id]=player)},stopChecking:function(){0!==YoutubeTracker.intervalId&&(clearInterval(YoutubeTracker.intervalId),YoutubeTracker.intervalId=0)},checkPercentage:function(){var anyPlaying=!1;Object.keys(YoutubeTracker.players).forEach(function(key,index){var player=YoutubeTracker.players[key];if(player.PlayerState==YT.PlayerState.PLAYING){anyPlaying=!0;var trackedPercentage=YoutubeTracker.getPercentage(key),duration=player.getDuration(),currentTime=player.getCurrentTime();if(duration>0){var currentPerc=currentTime/duration*100;currentPerc=Math.round(currentPerc),$.each(YoutubeTracker.percentageToTrack,function(j,percentage){trackedPercentage<percentage&&currentPerc>percentage&&(YoutubeTracker.setPercentage(key,percentage),YoutubeTracker.trackEvent(player,key,"watched-"+percentage+"%",""))})}}}),anyPlaying||YoutubeTracker.stopChecking()},onYouTubeIframeAPIReady:function(element,id){void 0===YoutubeTracker.playerArray[id]&&(YoutubeTracker.playerArray[id]=new YT.Player(element,{events:{onReady:YoutubeTracker.onPlayerReady,onStateChange:YoutubeTracker.onPlayerStateChange}}))},onPlayerReady:function(event){},onPlayerStateChange:function(event){YoutubeTracker.checkStateChange(event)},addTrackingApiToYoutoubeVideos:function(){$("iframe").each(function(i,elem){/youtube.com\/embed/.test(elem.src)&&-1===elem.src.indexOf("enablejsapi=")&&(elem.src+=(-1===elem.src.indexOf("?")?"?":"&")+"enablejsapi=1&origin="+window.location.origin)}),$.getScript("https://www.youtube.com/iframe_api")},trackEvent:function(event,id,action,label){var actionName=action+" - "+event.getVideoData().title,trackingObject=TrackingObjectFactory.createObj({Category:"videos",Action:actionName,Label:window.location.pathname});YoutubeTracker.sendEvent(trackingObject.getEventParameter())},sendEvent:function(parameter){void 0!==YoutubeTracker.analyticsTracker?YoutubeTracker.analyticsTracker.sendEvent(null,parameter):console.log("AnalyticsTracker is undefined")}},window.YoutubeTracker=YoutubeTracker}(window.jQuery,window,document),function($,window,document,configCustom,undefined){"use strict";configCustom=configCustom||{};var configDefault={UaId:"UA-42270417-5",validDownloadExtensions:/\.*.(zip|rar|mp\\d+|mpe*g|pdf|docx*|pptx*|xlsx*|jpe*g|png|gif|tiff*|avi|svg)/,GoogleAnalyticsUri:"https://www.googletagmanager.com/gtag/js?id=",DebugOutput:!1,UrlMapping:[{RegEx:/(.*\/program\/)(\d+)/,ValueIndex:1},{RegEx:/(.*\/search\/)(.*)/,ValueIndex:1},{RegEx:/(.*\/?)(\?.*)/,ValueIndex:1}],TrackingVarMap:[{Category:"event_category"},{Action:"event_action"},{Label:"event_label"},{Value:"value"}]};function gtag(){dataLayer.push(arguments)}Object.keys(configCustom).forEach(function(key,index){configDefault[key]=configCustom[key]}),AnalyticsTracker.initialize(gtag,configDefault.TrackingVarMap,configDefault.validDownloadExtensions),AnalyticsTracker.debugOutput=configDefault.DebugOutput,YoutubeTracker.initialize(AnalyticsTracker),$.getScript(configDefault.GoogleAnalyticsUri+configDefault.UaId,function(){if(!0===AnalyticsTracker.isSending){gtag("js",new Date);var href=UrlMapper.map(window.location.href,configDefault.UrlMapping);gtag("config",configDefault.UaId,{anonymize_ip:!0,page_location:href})}}),jQuery(document).ready(function(){if(void 0!==HelperFunctions.getHostname()){if(YoutubeTracker.addTrackingApiToYoutoubeVideos(),YoutubeTracker.registerYoutubeVideos(),AnalyticsTracker.trackEmails({Category:"engagement",Action:"send email",Label:function(e){return e.href.replace(/^mailto\:/i,"")}}),AnalyticsTracker.trackOnKeyPressEnter({BaseSelector:"nav input.search-input-header",Category:"engagement",Action:"search",Label:function(e){return e.value},search_term:function(e){return e.value}}),AnalyticsTracker.trackOutboundAndDownloads({Outbound:{Category:"outbound",Action:function(e){return"outbound - "+e.href.replace(/^https?\:\/\//i,"")},Label:window.location.pathname,transport_type:"beacon",pathname:window.location.pathname},Downloads:{Category:"download",Action:function(e){return"download - "+e.href},Label:function(e){return e.value},file_path:function(e){return e.href},pathname:window.location.pathname}}),"/pocketcode/"===window.location.pathname){var elementList=[{BaseSelector:"#featuredPrograms",SubSelector:"a",Category:"home page",Action:"click - featured programs",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#newest",SubSelector:"a",Category:"home page",Action:"click - newest programs",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#newest",SubSelector:".button-show-more",Category:"home page",Action:"click - newest programs - more"},{BaseSelector:"#newest",SubSelector:".button-show-less",Category:"home page",Action:"click - newest programs - less"},{BaseSelector:"#recommended",SubSelector:"a",Category:"home page",Action:"click - recommended programs",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#recommended",SubSelector:".button-show-more",Category:"home page",Action:"click - recommended programs - more"},{BaseSelector:"#recommended",SubSelector:".button-show-less",Category:"home page",Action:"click - recommended programs - less"},{BaseSelector:"#mostDownloaded",SubSelector:"a",Category:"home page",Action:"click - most downloaded programs",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#mostDownloaded",SubSelector:".button-show-more",Category:"home page",Action:"click - most downloaded programs - more"},{BaseSelector:"#mostDownloaded",SubSelector:".button-show-less",Category:"home page",Action:"click - most downloaded programs - less"},{BaseSelector:"#mostViewed",SubSelector:"a",Category:"home page",Action:"click - most viewed programs",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#mostViewed",SubSelector:".button-show-more",Category:"home page",Action:"click - most viewed programs - more"},{BaseSelector:"#mostViewed",SubSelector:".button-show-less",Category:"home page",Action:"click - most viewed programs - less"},{BaseSelector:"#random",SubSelector:"a",Category:"home page",Action:"click - random programs",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#random",SubSelector:".button-show-more",Category:"home page",Action:"click - random programs - more"},{BaseSelector:"#random",SubSelector:".button-show-less",Category:"home page",Action:"click - random programs - less"}],trackingObjectList=TrackingObjectFactory.createArray(elementList);AnalyticsTracker.registerElementsForClickTracking(trackingObjectList)}else if("/pocketcode/login"===window.location.pathname){elementList=[{BaseSelector:"button#_submit.login",Category:"engagement",Action:"sign_up",Label:"direct",method:"direct"},{BaseSelector:"a#btn-login_google",Category:"engagement",Action:"sign_up",Label:"Google",method:"Google"},{BaseSelector:"a#btn-login_facebook",Category:"engagement",Action:"sign_up",Label:"Facebook",method:"Facebook"}],trackingObjectList=TrackingObjectFactory.createArray(elementList);AnalyticsTracker.registerElementsForClickTracking(trackingObjectList)}else if(window.location.pathname.indexOf("/pocketcode/program")>=0){elementList=[{BaseSelector:"button.pc-startButton",Category:"program page",Action:"click - launch program",Label:function(){return window.location.pathname}},{BaseSelector:"div#tag-container",SubSelector:"a",Category:"program page",Action:function(e){return"tag - "+$(e).find("button").attr("id")},Label:function(e){return window.location.pathname}},{BaseSelector:"div.download-container > a",Category:"program page",Action:"click - download program",Label:function(e){return window.location.pathname}},{BaseSelector:"button#apk-generate",Category:"program page",Action:"click - download apk",Label:function(e){return window.location.pathname}},{BaseSelector:"button#remix-graph-button",Category:"program page",Action:"click - show remix graph",Label:function(e){return window.location.pathname}},{BaseSelector:"div.show-hide-code-statistic",SubSelector:"div.show-hide-code-statistic-arrow:not(.showing-code)",Category:"program page",Action:"click - code statistics - show",Label:function(e){return window.location.pathname}},{BaseSelector:"div.show-hide-code-statistic",SubSelector:"div.show-hide-code-statistic-arrow.showing-code",Category:"program page",Action:"click - code statistics - hide",Label:function(e){return window.location.pathname}},{BaseSelector:"div.show-hide-code",SubSelector:"div.show-hide-code-arrow:not(.showing-code)",Category:"program page",Action:"click - program code - show",Label:function(e){return window.location.pathname}},{BaseSelector:"div.show-hide-code",SubSelector:"div.show-hide-code-arrow.showing-code",Category:"program page",Action:"click - program code - hide",Label:function(e){return window.location.pathname}},{BaseSelector:"#recommendations > div.programs",SubSelector:"a.rec-programs",Category:"program page",Action:"click - similar program",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#recommendations",SubSelector:"div.button-show-more",Category:"program page",Action:"click - similar program - show more"},{BaseSelector:"#recommendations",SubSelector:"div.button-show-less",Category:"program page",Action:"click - similar program - show less"},{BaseSelector:"#specific-programs-recommendations > div.programs",SubSelector:"a.rec-programs",Category:"program page",Action:"click - recommended download",Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#specific-programs-recommendations",SubSelector:"div.button-show-more",Category:"program page",Action:"click - recommended download - show more"},{BaseSelector:"#specific-programs-recommendations",SubSelector:"div.button-show-less",Category:"program page",Action:"click - recommended download - show less"}];var socialInteraction=[{BaseSelector:"#program-like-thumbs-up",Category:"engagement",Action:"socialEngagement - program",Label:window.location.pathname,Value:10},{BaseSelector:"#program-like-smile",Category:"engagement",Action:"socialEngagement - program",Label:window.location.pathname,Value:10},{BaseSelector:"#program-like-love",Category:"engagement",Action:"socialEngagement - program",Label:window.location.pathname,Value:10},{BaseSelector:"#program-like-wow",Category:"engagement",Action:"socialEngagement - program",Label:window.location.pathname,Value:10},{BaseSelector:"#program-comments button#post-button",Category:"engagement",Action:"socialEngagement - program",Label:window.location.pathname,Value:30}];trackingObjectList=TrackingObjectFactory.createArray(elementList);AnalyticsTracker.registerElementsForClickTracking(trackingObjectList);var trackingObjectListSocialInteraction=TrackingObjectFactory.createArray(socialInteraction);AnalyticsTracker.registerElementsForClickTracking(trackingObjectListSocialInteraction)}else if(window.location.pathname.indexOf("/search")>=0){var actionSubstring=window.location.pathname.indexOf("/tag/search")>=0?"tag":"program";elementList=[{BaseSelector:".programs",SubSelector:"a",Category:"search page",Action:"click - searched "+actionSubstring,Label:function(e){return HelperFunctions.removeDomainAndQuery($(e).attr("href"))}},{BaseSelector:"#search-results",SubSelector:".button-show-more",Category:"search page",Action:"click - searched "+actionSubstring+" - more"},{BaseSelector:"#search-results",SubSelector:".button-show-less",Category:"search page",Action:"click - searched "+actionSubstring+" - less"}],trackingObjectList=TrackingObjectFactory.createArray(elementList);AnalyticsTracker.registerElementsForClickTracking(trackingObjectList)}var internalDownload=TrackingObjectFactory.createObj({BaseSelector:'a[onclick^="onDownload',Category:"download",Action:window.location.pathname,Label:function(e){return $(e).closest("a").attr("data-href")}});AnalyticsTracker.trackOnClickJavaScript(internalDownload)}})}(window.jQuery,window,document,configGA=configGA||{});