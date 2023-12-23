///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INTERACTION CLASS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Interact  {																					

	constructor()   																			// CONSTRUCTOR
	{
		this.acts=[];																				// Holds actions
		this.path="";																				// Assets path
		let o={ id:"C0-L0-T0-A1", type:"dragsort", items:[] };
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
		this.acts["C0-L0-T1-A1"]={ id:"C0-L0-T1-A1", type:"click", done:"play", items:[ { endX:.58, endY:.83, width:.025, height:.1}] };
		this.acts["C0-L0-T1-A2"]={ id:"C0-L0-T1-A2", type:"click", done:"play", items:[ { endX:.52, endY:.83, width:.025, height:.1}] };
		this.acts["C0-L0-T1-A3"]={ id:"C0-L0-T1-A3", type:"click", done:"play", items:[ { endX:.38, endY:.83, width:.025, height:.1}] };
		}

	Run(id)
	{
		let action=this.acts[id];																	// Point at action
		this.path="assets/"+action.id.substring(0,2)+"/"+action.id;									// Asset path + name
		if (action.type == "dragsort")			this.DragSort(action);								// Dragsort interaction
		else if (action.type == "click")		this.Click(action);									// Click interaction
	}

	Click(action)																				// CLICK INTERACTION
	{
		$("#hm-overlay").on("click", (e)=>{
			let o=action.items[0];																	// Point at item
			let x=e.offsetX/$("#hm-overlay").width();												// Get x pos
			let y=e.offsetY/$("#hm-overlay").height();												// Y
			if ((Math.abs(x-o.endX) < o.width) && (Math.abs(y-o.endY) < o.height)) {				// If in range
				Sound("ding");																		// OK			
				$("#hm-overlay").off("click");														// Remove click handler				
				this.HandleDone(action);															// Handle done
				}
			else this.Failure();																	// Oh oh
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

	HandleDone(action)																			// HANDLE DONE WITH INTERACTION
	{
		if (action.doneAnimation) 	this.Success("play",()=>{ done(action)} );						// Show success animation, then handle done
		else						next(action);													// Handle done
		
		function next(action) {																		// HANDLE DONE NEXT MOVE
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
