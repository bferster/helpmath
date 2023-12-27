///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VIDEO CLASS																GLOBALS: isMobile
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Video  {																					

	constructor(div="hm-video")   																// CONSTRUCTOR
	{
		vid=this;											
		this.div=div;																				// Div to hold video
		this.type="html5";																			// Assume HTML5 video
		this.player=null;																			// Holds video player object
		this.status="empty";																		// Hold status
		this.aspect=700/1320;																		// Apect ratio
		this.src="";																				// Holds source
		this.autoPlay=true;																			// Auto play?
		this.volume=50;																				// Default volume
		this.curTime=0;																				// Player position
		this.start=0;																				// Clip start time
		this.end=0;																					// Clip end time
		this.pct=0;																					// Percentage
		this.dur=0;																					// Duration
		this.timer=setInterval(this.OnPlayerTimer,200);												// Set timer ~5ps
		this.readySent=false;																		// To init only once
		this.triggers=[];																			// Triggers	
		this.links=[];																				// Hyperlinks	
	}	

	OnPlayerTimer()																				// HANDLE FRAME TIMER
	{
		let i,o;
		if (vid.status != "play")	return;															// Quit if not playing
		vid.curTime=vid.GetPlayerTime();															// Get player time
		vid.time=vid.curTime-vid.start;																// Time within span
		vid.pct=vid.time/vid.dur;																	// Calc pct of clip done
		$("#hm-timeSlider").slider("value",vid.pct*100);											// Set slider
		$("#auth-time").val((vid.curTime-0).toFixed(2)+" : "+(vid.time-0).toFixed(2));				// Set authoring time
		let n=vid.triggers.length;																	// Number of triggers
		for (i=0;i<n;++i) {																			// For each
			o=vid.triggers[i];																		// Point at trigger
			if (vid.time >= o.time) {																// If in this one and not triggered yet
				vid.RunPlayer("pause");																// Pause video
				$("#hm-play").prop("src","img/playbut.png");										// Play icon button
				act.Run(vid.triggers[i].id);														// Run interaction
				vid.triggers.splice(i,1);															// Remove trigger
				break;																				// Quit looking
				}
			}	
		if (vid.curTime > vid.end)	$("#hm-play").trigger("click");									// Pause at end
		}

	GetPlayerTime()																				// GET TIME FROM PLAYER
	{
		return vid.player.currentTime;																// Return time
	}

	ResetTriggers()																				// RESET TRIGGERS TO LIVE
	{
		$("#hm-overlay").html("");																	// Clear overlay
		if (curPage.triggers) vid.triggers=JSON.parse(JSON.stringify(curPage.triggers));			// Clone triggers from page
	}
	
	RunPlayer(what, param)																		// PLAYER ACTIONS
	{
		let i,str;
		if (what == "init") {																		// INIT
			$("#hm-play").prop("src","img/pausebut.png");											// Pause icon button, since we do autoplay
			this.src=`assets/C${(""+app.module).padStart(2,"0")}/C${app.module}-L${app.lesson}-T${app.topic}.mp4`;		// Make source
			this.curTime=this.start=curPage.start;													// Init to beginning
			this.end=curPage.end;																	// Get end
			this.dur=this.end-this.start;															// Set duration
			$("#"+this.div).html("");																// Add video tag
			let base=this.src.match(/(.*)\.[^.]+$/i)[1];											// Extract base
			this.ResetTriggers();																	// Make trigger live			
			str="<video id='vplayer' width='100%'";													// Video tag
			if ((this.controls == "true") || isMobile)												// If has controls or mobile
				str+= " controls";																	// Add native controls to player
			str+=">";																				// Close tag
			if (this.src.match(/\.mp3/i)) 															// If audio
				str+="<source src='"+base+".mp3'  type='audio/mp3'>";								// MP3 Source
			else																					// VIDEO
				str+="<source src='"+base+".mp4'  type='video/mp4'>";								// MP4 Source
			str+=`</video>
			<div id="hm-overlay" class="hm-overlay"></div>`;
					
			$("#"+this.div).html(str);																// Add video tag
			let myVid=document.getElementById("vplayer");											// Point at player	
			this.player=$("#vplayer")[0];															// Point to player
			this.readySent=false;																	// Ready not sent
	
			myVid.onloadstart=function() {															// When loaded
				vid.readySent=false;																// Ready not sent
				};
			myVid.oncanplay=function() {															// When ready
				let p=$("#vplayer")[0];																// Point to player
				if (!this.src.match(/\.mp3/i)) 														// If video
				vid.aspect=p.videoHeight/p.videoWidth;												// Set aspect 				
				if (!vid.readySent)	vid.RunPlayer("ready");											// Not sent yet, set up player		
				vid.readySent=true;																	// Ready sent
				};
			myVid.onended=function() {																// When done
				vid.RunPlayer("pause");																// Pause
				};
			myVid.onplay=function() {																// When playing
				vid.status="play";																	// Set mode
				};
			myVid.onpause=function() {																// When paused
				vid.status="pause";																	// Set mode
				};
			
			myVid.addEventListener("canplay",myVid.oncanplay,false);	 							// Add listener 
			myVid.addEventListener("ended",myVid.onened,false);	 									// Add listener 
			myVid.addEventListener("play",myVid.onplay,false);	 									// Add listener 
			myVid.addEventListener("pause",myVid.onpause,false);	 								// Add listener 
			
			$("#hm-overlay").on("click", (e)=>{														// ON OVERLAY CLICK
				let x=e.offsetX/$("#hm-overlay").width();											// Get x pos
				let y=e.offsetY/$("#hm-overlay").height();											// Y
				trace(x.toFixed(2),y.toFixed(2));													// Log
				let o=curPage.links;																// Point at links
				if (!o)	return;																		// No links
				for (i=0;i<o.length;++i) {															// For each one
					if ((o[i].start > vid.time) || (vid.time > o[i].end)) 	continue;				// Not in time range
					if (Math.abs(y-o[i].y) > .03) 							continue;				// Not in y range
					if (Math.abs(x-o[i].x) > .007*o[i].name.length) 		continue;				// Not in x range
					vid.RunPlayer("pause");															// Pause video
					key.Show(o[i].name);															// Show keyterm
					}
				});
			}
		else if (what == "ready") {																	// When ready
			this.readySent=true;																	// Ready sent
			if (this.autoPlay)	this.RunPlayer("play",this.start);									// If autoplay, play
			else				this.RunPlayer("seek",this.start);									// Just seek
			}
		else if (what == "resize") {																// RESIZE
			if (!this.player)	return;																// If no player yet, quit
			let w=$("#"+this.div).width();															// Get width
			$("#vplayer").width(w);																	// Set width
			$("#vplayer").height(w*this.aspect);													// Set height
			}
		else if ((what == "play") || (what == "jump")) {											// Play / JUMP
			if ((this.status == "empty") && isMobile)	return;										// Mobiles need user to initiate touch before controlled play
			this.status="play";																		// Set status
			if (this.player.readyState)	this.RunPlayer("seek",this.curTime);						// If ready, cue it up
			this.player.volume=this.volume/100;														// Set volume
			$("#hm-play").prop("src","img/pausebut.png");											// Pause icon button
			this.player.play(); 																	// Play
			}
		else if (what == "seek")  {																	// SEEK
			if ((this.status == "empty") && isMobile)	return;										// Mobiles need user to initiate touch before controlled play
			this.curTime=param;																		// Set time
			if (!this.player) return;																// If no player yet, quit
//			this.player.pause(); 																	// Pause
//			$("#hm-play").prop("src","img/playbut.png");											// Play icon button
			if (this.player.readyState)	this.player.currentTime=this.curTime;						// If ready, cue it up
			$("#auth-time").val((vid.curTime-0).toFixed(2)+" : "+(vid.time-0).toFixed(2));			// Set authoring time
			trace("Seek = "+(param-vid.start).toFixed(2),param.toFixed(2));							// Show clip and total time
			}
		else if (what == "pause") {																	// PAUSE
			this.status="pause";																	// Set mode
			if (!this.player)	return;																// If no player yet, quit
			$("#hm-play").prop("src","img/playbut.png");											// Play icon button
			this.player.pause(); 																	// Pause
			}
		else if (what == "volume") {																// Volume
			if (!this.player)	return;																// If no player yet, quit
			this.volume=param;																		// Save volume
			this.player.volume=param/100;															// Set device
			}
	}

	SetTimes()																					// AUTRHOR PAGES
	{
		$("#popupDiv").remove();																	// Kill old one, if any
		let str=`<div id='popupDiv' class='hm-popup' style="width:500px;top:calc(100vh - 250px);font-size:13px;">
		<img id="auth-close" style="float:right" src="img/closedot.gif">
		<b>AUTHOR PAGES</b><br><br>
		START: <input class="hm-is" id="auth-start" style="width:40px">  &nbsp; 
		TIME: <input class="hm-is" id="auth-time" style="width:100px">  &nbsp; 
		END: <input class="hm-is" id="auth-end" style="width:40px">
		<div style="margin:16px 0">NAME: <input class="hm-is" id="auth-name" style="width:200px"> &nbsp; <div id="auth-new" class="hm-bs">NEW</div></div>
		<div id="auth-set" class="hm-bs" style="float:left">SET PAGE</div> 												
		<div id="auth-save" class="hm-bs"style="float:right">SAVE ALL</div>
		<div id="auth-trigger" class="hm-bs"style="">ADD TRIGGER</div>`;
		$("body").append(str.replace(/\t|\n|\r/g,""));												// Add tool to body
		$("#popupDiv").draggable();																	// Make it draggable
		$("#auth-start").val(curPage.start);														// Get initial start
		$("#auth-end").val(curPage.end);															// End
		$("#auth-name").val(curPage.name);															// Name
		$("#auth-start").on("dblclick", ()=>{ $("#auth-start").val(vid.curTime.toFixed(2)); });		// Set start to cur time
		$("#auth-end").on("dblclick",   ()=>{ $("#auth-end").val(vid.curTime.toFixed(2));   });		// End
		$("#auth-close").click(function() { $("#popupDiv").remove(); });							// Remove on click of close but
		$("#popupDiv").fadeIn(500);																	// Animate in and out		

		$("#auth-new").click(function() {															// When saving
			let o={ name:"New page",start:curPage.end,end:curPage.end+100,status:0,links:[], triggers:[] };	// Base
			curLesson.topics[app.topic].pages.splice(app.page-0+1,0,o);								// Add in place
			app.page++;																				// Go to page
			app.ShowLesson();																		// Reset
			Sound("ding");																			// Bonk
			});
		
		$("#auth-set").click(function() {															// When saving
			curPage.start=$("#auth-start").val()-0;													// Start
			curPage.end=$("#auth-end").val()-0;														// End
			curPage.name=$("#auth-name").val();														// Name
			app.ShowLesson();																		// Reset
			Sound("ding");																			// Ding
			});

		$("#auth-save").click(function() {															// When saving
			let i,o;
			for (i=0;i<curLesson.topics[app.topic].pages.length;++i) {								// For each page
				o=curLesson.topics[app.topic].pages[i];												// Point at page
				if (!o.links)		o.links=[];														// Add links shell, if not there
				if (!o.triggers) 	o.triggers=[];													// Triggers 
				o.status=0;																			// Status
				o.id=makeId(i);																		// Set id
				}
			let s=JSON.stringify(curLesson.topics[app.topic].pages);								// Get page data
			s=s.replace(/},/g,"},\n");	 															// Add LFs
			s=s.replace(/{"/g,"{");  s=s.replace(/,"/g,",");   s=s.replace(/":/g,":");				// Remove quotes
			s=s.substring(1,s.length-1);															// Remove array
			s=s.replace(/links:\[{/g,"links:[\n\t{");												// Indent links
			trace(s)
			});

		$("#auth-trigger").click(function() {														// When saving
			Sound("ding");																			// Ding
			if (!curPage.triggers)	curPage.triggers=[];											// Add array if not there
			curPage.triggers.push({time:vid.time.toFixed(2),id:"T"+makeId(app.page)+"-"+(""+curPage.triggers.length).padStart(2,"0")});	// Add trigger
			});

		function makeId(n) {																		// MAKE ID
			return (""+app.module).padStart(2,"0")+"-"+(""+app.lesson).padStart(2,"0")+"-"+(""+app.topic).padStart(2,"0")+"-"+(""+n).padStart(2,"0");	
			}
		}
	
} // App class closure

