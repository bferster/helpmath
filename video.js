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
			this.src=`assets/C${app.module}/C${app.module}-L${app.lesson}-T${app.topic}.mp4`;		// Make source
			this.curTime=this.start=curPage.start;													// Init to beginning
			this.end=curPage.end;																	// Get end
			this.dur=this.end-this.start;															// Set duration
				$("#"+this.div).html("");															// Add video tag
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
			<div id="hm-overlay" style="width:100%;height:100%;top:0;position:absolute">
			</div>`;
					
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
				for (i=0;i<curPage.links.length;++i) {												// For each one
					if ((o[i].start > vid.time) || (vid.time > o[i].end)) 	continue;				// Not in time range
					if (Math.abs(y-o[i].y) > .03) 							continue;				// Not in y range
					if (Math.abs(x-o[i].x) > .007*o[i].name.length) 		continue;				// Not in x range
					vid.RunPlayer("pause");															// Pause video
					$("#hm-play").prop("src","img/playbut.png");									// Play icon button
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
			this.player.play(); 																	// Play
			}
		else if (what == "seek")  {																	// SEEK
			if ((this.status == "empty") && isMobile)	return;										// Mobiles need user to initiate touch before controlled play
			this.curTime=param;																		// Set time
			if (!this.player) return;																// If no player yet, quit
			if (this.player.readyState)	this.player.currentTime=this.curTime;						// If ready, cue it up
			trace("Seek = "+(param-vid.start).toFixed(2),param.toFixed(2));							// Show clip and total time
			}
		else if (what == "pause") {																	// PAUSE
			this.status="pause";																	// Set mode
			if (!this.player)	return;																// If no player yet, quit
			this.player.pause(); 																	// Pause
			}
		else if (what == "volume") {																// Volume
			if (!this.player)	return;																// If no player yet, quit
			this.volume=param;																		// Save volume
			this.player.volume=param/100;															// Set device
			}
	}


} // App class closure
