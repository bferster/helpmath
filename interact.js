///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INTERACTION CLASS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Interact  {																					

	constructor()   																			// CONSTRUCTOR
	{
		this.acts=[];																				// Holds actions
		this.path="";																				// Assets path
		let o={ id:"T00-00-00-03-00", type:"dragsort", items:[] };
		o.back="back.png";		
		o.done="next";	o.doneAnimation=true;
		o.items.push( { startX:5.8,		startY:28.2, 	endX:44.5,	 endY:58.3, 	width:10.5, status:false });		
		o.items.push( { startX:18.6,	startY:28.2, 	endX:83.2,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:31.7,	startY:28.2, 	endX:57.4,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:44.3,	startY:28.2, 	endX:70.4,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:57.4,	startY:28.2, 	endX:5.8,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:70.7,	startY:28.2, 	endX:18.6,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:83.2,	startY:28.2, 	endX:31.7,	 endY:58.2, 	width:10.5, status:false });		
		this.acts[o.id]=o;
		this.acts["T00-00-01-02-00"]={ id:"T00-00-01-02-00", type:"click", done:"next", items:[ { endX:.58, endY:.83, width:.025, height:.1}] };
		this.acts["T00-00-01-03-00"]={ id:"T00-00-01-03-00", type:"click", done:"next", items:[ { endX:.52, endY:.83, width:.025, height:.1}] };
		this.acts["T00-00-01-04-00"]={ id:"T00-00-01-04-00", type:"click", done:"next", items:[ { endX:.38, endY:.83, width:.025, height:.1}] };
		o={ id:"T00-00-01-05-00", type:"placevalue", items:[] };
		o.back="back.png";		
		this.acts[o.id]=o;
	}

	Run(id)
	{
		let action=this.acts[id];																	// Point at action
		this.path="assets/C"+action.id.substring(1,3)+"/"+action.id;								// Asset path + name
		if (action.type == "dragsort")			this.DragSort(action);								// Dragsort interaction
		else if (action.type == "click")		this.Click(action);									// Click 
		else if (action.type == "placevalue")	this.Placevalue(action);							// Placevalue 
		else if (action.type == "rollover")		this.Rollover(action);								// Rollover
	}

	Click(action,num=0)																			// CLICK INTERACTION
	{
		let o=action.items[num];																	// Point at item
		this.OnClick(o.endX,o.endY,o.width,o.height,()=>{											// On click subroutine
				Sound("ding");																		// Ding			
				this.HandleDone(action);															// Handle done
				},()=>{	this.Failure(); }															// Handle failure
			);
		}

	Rollover(action)																			// PLACEVALUE INTERACTION
	{
		let num=Math.floor(Math.random()*9999+1000);												// Get random number from 1000-9999							
		let ones=num%10;																			// Isolate ones
		let tens=Math.floor(num%100/10);															// Tens
		let hundreds=Math.floor(num/100);															// Hundreds
		let thousands=Math.floor(num/1000);															// Thousnds



		if (action.back)	str+=`<img src="${this.path}-${action.back}" style="width:100%">`;		// Add back
		$("#hm-overlay").html(str);																	// Add items to markup														
		this.OnClick(79,.75,.1,.05,()=>{															// Onclick routine
			$("#hm-overlay").off("click");															// Remove click handler becauswe of recursion		
			Sound("ding");																			// Ding			
			this.Placevalue(action);																// Do it again
			});
	}

	Placevalue(action)																				// PLACEVALUE INTERACTION
	{
		let i,str="";
		let num=Math.floor(Math.random()*499+100);													// Get random number from 100-4S99							
		let ones=num%10;																			// Isolate ones
		let tens=Math.floor(num%100/10);															// Tens
		let hundreds=Math.floor(num/100);															// Hundreds
		if (action.back)	str+=`<img src="${this.path}-${action.back}" style="width:100%">`;		// Add back
		str+=`<div style="position:absolute;width:24%;height:52%;top:12vw;left:1.4vw;text-align:center">`;
		for (i=0;i<hundreds;++i)str+=`<img src="img/block.png" style="width:${57-Math.min(30,hundreds*5)}%;margin:3% 3%">`; 
		str+=`</div><div style="position:absolute;width:24%;height:52%;top:12vw;left:16vw;text-align:center">`;
		for (i=0;i<tens;++i) str+=`<img src="img/bar.png" style="width:7%;margin:2% 4%">`; 
		str+=`</div><div style="position:absolute;width:23%;height:52%;top:12vw;left:31vw;text-align:center">`
		for (i=0;i<ones;++i)str+=`<img src="img/unitblock.png" style="width:12%;margin:3% 3%">`;
		str+=`</div><div style="font-size:1.6vw;position:absolute;left:83%;top:47.5%"><b>${num}</b></div>
		<div style="font-size:1.6vw;position:absolute;left:14%;top:90%"><b>${hundreds}</b></div>
		<div style="font-size:1.6vw;position:absolute;left:38%;top:90%"><b>${tens}</b></div>
		<div style="font-size:1.6vw;position:absolute;left:63%;top:90%"><b>${ones}</b></div>`;
		$("#hm-overlay").html(str);																	// Add items to markup														
	
		this.OnClick(.9,.73,.1,.05,()=>{															// Onclick routine
			$("#hm-overlay").off("click");															// Remove click handler becauswe of recursion		
			Sound("ding");																			// Ding			
			this.Placevalue(action);																// Do it again
			});
	}

	DragSort(action)																				// DRAGSORT INTERACTION
	{
		let i,o,str="";
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes
		if (action.back)	str+=`<img src="${this.path}-${action.back}" style="width:100%">`;		// Add back
		for (i=0;i<action.items.length;++i) {														// For each item
			o=action.items[i];																		// Point at items
			str+=`<img id="hm-act-${i}" src="${this.path}-${i}.png" style="position:absolute;left:${o.startX}%;top:${o.startY}%;width:${o.width}%">`;
			}
		str+=this.Success();																		// Add success animation markup
		$("#hm-overlay").html(str);																	// Add items to markup														
		for (i=0;i<action.items.length;++i) {
			$("#hm-act-"+i ).draggable({															// Make item draggable
				stop:(e,ui)=>{																		// On drag stop
					let j=e.target.id.substring(7);													// Get index
					let o=action.items[j];															// Point at item
					if ((Math.abs(ui.position.left/w*100-o.endX) < o.width*.8) && (Math.abs(ui.position.top/h*100-o.endY) < o.width*.8)) { // If correct
						o.status=true;																// Set status
						$("#hm-act-"+j).css({ left:o.endX+"%", top:o.endY+"%"});					// Move in place
						for (j=0;j<action.items.length;++j)	if (!action.items[j].status) break;		// Go through status
							if (j == action.items.length) this.HandleDone(action);					// All correct!, so gandle done 
							Sound("img/tada.mp3");													// Correct sound
							}
						else{																		// Wrong
							o.status=false;															// Set status
							$("#hm-act-"+j).css({ left:o.startX+"%", top:o.startY+"%" });			// Move back
							Sound("img/error.mp3");													// Incorrect sound
						}
					}
				});
			}
	}

	OnRoll(x, y, wid, hgt, msg)																	// REACT TO A MOUSE OVER
	{
	}



	OnClick(x, y, wid, hgt, success, failure=()=>{})											// REACT TO A MOUSE CLICK
	{
		$("#hm-overlay").on("click", (e)=>{
			let x1=e.offsetX/$("#hm-overlay").width();												// Get x pos
			let y1=e.offsetY/$("#hm-overlay").height();												// Y
			if ((Math.abs(x-x1) < wid) && (Math.abs(y-y1) < hgt)) success()							// If in range, run success callback
			else 												  failure()							// Run failure callback
			});
	}

	HandleDone(action)																			// HANDLE DONE WITH INTERACTION
	{
		if (action.doneAnimation) 	this.Success("play",()=>{ done(action)} );						// Show success animation, then handle done
		else						next(action);													// Handle done
		
		function next(action) {																		// HANDLE DONE NEXT MOVE
			$("#hm-overlay").off("click");															// Remove click handler(s)			
			if (action.done == "next") 		$("#hm-pageNext").trigger("click");						// Go onto next page
			else if (action.done == "play") $("#hm-overlay").html(""),$("#hm-play").trigger("click"); // Resume playing
			}	
	}

	Success(play=false, callback)																// SETUP OR PLAY SUCCESS ANIMATION
	{
		if (!play)	return `<img id="hm-success" src="img/ribbon.png" style="left:50%;top:50%;position:absolute;width:0;z-index:99">`;// Just getting markup
		Sound("img/yea.mp3");																		// Yea sound
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes
		$("#hm-success").animate({ width:"50%", left:(w/2-w/4)+"px", top:((h-(w/2))/2)+"px" }, 		// Zoom out
			1500, ()=>{ setTimeout(callback,1000) }); 												// Then wait
	}

	Failure(load=false)																			// SETUP OR PLAY FAILURE ANIMATION
	{
		if (load) 																					// Just getting markup
		return `<img id="hm-success" src="img/safdface.png" style="left:50%;top:50%;position:absolute;width:0;z-index:99">`;
		Sound("img/sorry.mp3");																		// Sorry sound
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes
		$("#hm-success").animate({ width:"50%", left:(w/2-w/4)+"px", top:((h-(w/2))/2)+"px" }, 1500); // Zoom out
	}


} // App class closure
