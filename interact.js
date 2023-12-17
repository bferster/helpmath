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
		o.doneSound="done";		o.doneAct="done";
		o.items.push( { startX:5.8,		startY:28.2, 	endX:44.5,	 endY:58.3, 	width:10.5, status:false });		
		o.items.push( { startX:18.6,	startY:28.2, 	endX:83.2,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:31.7,	startY:28.2, 	endX:57.4,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:44.3,	startY:28.2, 	endX:70.4,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:57.4,	startY:28.2, 	endX:5.8,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:70.7,	startY:28.2, 	endX:18.6,	 endY:58.2, 	width:10.5, status:false });		
		o.items.push( { startX:83.2,	startY:28.2, 	endX:31.7,	 endY:58.2, 	width:10.5, status:false });		
		this.acts[o.id]=o;
		}

	Run(id)
	{
		let act=this.acts[id];																		// Point at action
		this.path="assets/"+act.id.substring(0,2)+"/"+act.id;										// Asset path + name
		if (act.type == "dragsort")	this.DragSort(act);												// Render dragsort interaction
	}

	DragSort(act)																				// RENDER DRAGSORT INTERACTION
	{
		let i,o,str="";
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes
		if (act.back)	str+=`<img src="${this.path}-${act.back}" style="width:100%">`;				// Add back
		for (i=0;i<act.items.length;++i) {															// For each item
			o=act.items[i];																			// Point at items
			str+=`<img id="hm-act-${i}" src="${this.path}-${i}.png" style="position:absolute;left:${o.startX}%;top:${o.startY}%;width:${o.width}%">`;
			}
		str+=this.Success();																		// Add success animation markup
		$("#hm-overlay").html(str);																	// Add items to markup														
		for (i=0;i<act.items.length;++i) {
			$("#hm-act-"+i ).draggable({															// Make item draggable
				stop:(e,ui)=>{																		// On drag stop
					let j=e.target.id.substring(7);													// Get index
					let o=act.items[j];																// Point at item
					if ((Math.abs(ui.position.left/w*100-o.endX) < o.width*.8) && (Math.abs(ui.position.top/h*100-o.endY) < o.width*.8)) { // If correct
						o.status=true;																// Set status
						$("#hm-act-"+j).css({ left:o.endX+"%", top:o.endY+"%"});					// Move in place
						for (j=0;j<act.items.length;++j)	if (!act.items[j].status) break;		// Go through status
							if (j == act.items.length) {											// All correct!
								this.Success("play");												// Show success animation
								}
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

	Success(play=false)																			// SETUP OR PLAY SUCCESS ANIMATION
	{
		if (!play) 																					// Just getting markup
		return `<img id="hm-success" src="img/ribbon.png" style="left:50%;top:50%;position:absolute;width:0;z-index:99">`;
		Sound("img/yea.mp3");																		// Yea sound
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes
		$("#hm-success").animate({ width:"50%", left:(w/2-w/4)+"px", top:((h-(w/2))/2)+"px" }, 1500); // Zoom out
	}

} // App class closure
