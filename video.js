///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN APP CLASS																GLOBALS: isMobile
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
		this.src="assets/EL3-L1/C0-L0-T0.mp4";														// Hold source
		this.curTime=0;																				// Player position
		this.start=4;																				// Clip start time
		this.end=15.5;																				// Clip end time
		this.pct=0;																					// Percentage
		this.dur=0;																					// Duration
		this.timer=setInterval(this.OnPlayerTimer,200);												// Set timer ~5ps
		}	

	OnPlayerTimer()																				// HANDLE FRAME TIMER
	{
		if (vid.status != "play")	return;															// Quit if not playing
		vid.curTime=vid.GetPlayerTime();															// Get player time
		vid.time=vid.curTime-vid.start;																// Time within span
		vid.pct=vid.time/vid.dur;																	// Calc pct of clip done
		$("#hm-timeSlider").slider("value",vid.pct*100);											// Set slider
		trace(vid.dur,vid.time,vid.pct)
		if (vid.curTime > vid.end)	$("#hm-play").trigger("click");									// Pause at end
		}

	GetPlayerTime()																				// GET TIME FROM PLAYER
	{
	//	trace( vid.player.currentTime)
		return vid.player.currentTime;																// Return time
	}
	
	RunPlayer(what, param)																		// PLAYER ACTIONS
	{
		let str;
		if (what == "init") {																		// INIT
			this.curTime=this.start;																// Init to beginning
			this.dur=this.end-this.start;															// Set duration
			$("#"+this.div).html("");																// Add video tag
			let base=this.src.match(/(.*)\.[^.]+$/i)[1];											// Extract base
			str="<video id='vplayer' width='100%' height='100%'";									// Video tag
			if ((this.controls == "true") || isMobile)												// If has controls or mobile
				str+= " controls";																	// Add native controls to player
			str+=">";																				// Close tag
			if (this.src.match(/\.mp3/i)) 															// If audio
				str+="<source src='"+base+".mp3'  type='audio/mp3'>";								// MP3 Source
			else																					// VIDEO
				str+="<source src='"+base+".mp4'  type='video/mp4'>";								// MP4 Source
			str+="</video>"
			$("#"+this.div).html(str);																// Add video tag
			let myVid=document.getElementById("vplayer");											// Point at player	
			this.player=$("#vplayer")[0];															// Point to player
			this.player.readySent=false;															// Ready not sent
	
			myVid.onloadstart=function() {															// When loaded
				let p=$("#vplayer")[0];																// Point to player
				p.readySent=false;																	// Ready not sent
				};
							
			myVid.oncanplay=function() {															// When ready
				let p=$("#vplayer")[0];																// Point to player
				if (!this.src.match(/\.mp3/i)) 														// If video
				vid.aspect=p.videoHeight/p.videoWidth;												// Set aspect 				
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
			this.player.play(); 																	// Play
			}
		else if (what == "seek")  {																	// SEEK
			if ((this.status == "empty") && isMobile)	return;										// Mobiles need user to initiate touch before controlled play
			this.curTime=param;																		// Set time
			if (!this.player) return;																// If no player yet, quit
			if (this.player.readyState)	this.player.currentTime=this.curTime;						// If ready, cue it up
			}
		else if (what == "pause") {																	// PAUSE
			this.status="pause";																	// Set mode
			if (!this.player)	return;																// If no player yet, quit
			this.player.pause(); 																	// Pause
			}
		else if (what == "volume") {																// Volume
			if (!this.player)	return;																// If no player yet, quit
			this.player.volume=playerVolume/100;													// Set
			}
	}


} // App class closure
