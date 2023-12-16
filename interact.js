///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN APP CLASS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Interact  {																					

	constructor()   																			// CONSTRUCTOR
	{
		this.acts=[];																				// Holds actions
		let o={ id:"C0-L0-T0-A1", type:"dragsort", items:[] };
		o.back="back.png";		
		o.doneSound="done";		o.doneAct="done";
		o.items.push( { startX:11.5,	startY:29.5, 	endX:44.6,	 endY:58.1, 	width:8.9});		
		o.items.push( { startX:22.6,	startY:29.5, 	endX:77.9,	 endY:58.1, 	width:8.9});		
		o.items.push( { startX:33.6,	startY:29.5, 	endX:55.8,	 endY:58.1, 	width:8.9});		
		o.items.push( { startX:44.6,	startY:29.5, 	endX:67.0,	 endY:58.1, 	width:8.9});		
		o.items.push( { startX:55.8,	startY:29.5, 	endX:11.5,	 endY:58.1, 	width:8.9});		
		o.items.push( { startX:67.0,	startY:29.5, 	endX:22.6,	 endY:58.1, 	width:8.9});		
		o.items.push( { startX:77.9,	startY:29.5, 	endX:33.6,	 endY:58.1, 	width:8.9});		
		this.acts[o.id]=o;
	}

	Run(id)
	{
		let act=this.acts[id];																		// Point at action
		let path="assets/"+act.id.substring(0,2)+"/"+act.id;										// Asset path + name
		if (act.back)	$("#hm-overlay").html(`<img src="${path}-${act.back}" style="width:100%">`);
		if (act.type == "dragsort")	this.DragSort(act, path);										// Render dragsort interaction
	}

	DragSort(act,path)																			// RENDER DRAGSORT INTERACTION
	{
		let i,o,str;
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get containt sizes
		trace(w)
		for (i=0;i<act.items.length;++i) {
			o=act.items[i];																			// Point at items
			str=`<img id="hm-act-${i}" src="${path}-${i}.png" style="position:absolute;left:${o.startX}%;top:${o.startY}%;width:${o.width}%">
			<img id="hm-success" src="img/ribbon.png" style="left:calc(50% - 256px);top:24px;position:absolute;width:0;z-index:99">`;
			$("#hm-overlay").append(str);

			$("#hm-act-"+i ).draggable({															// Make item draggable
					stop:(e,ui)=>{																	// On drag stop
						let i=e.target.id.substring(7);												// Get index
						let o=act.items[i];															// Point at item
						if ((Math.abs(ui.position.left/w*100-o.endX) < o.width*.8) && (Math.abs(ui.position.top/h*100-o.endY) < o.width*.8)) { // If correct
							o.status=true;															// Set status
							$("#hm-act-"+i).css({ left:o.endX+"%", top:o.endY+"%"});				// Move in place
								for (i=0;i<act.items.length;++i)	if (!act.items[i].status) break;// Go through status
							if (i == act.items.length) {											// All correct!
								Sound("img/yea.mp3");												// Yea sound
								$("#hm-success").animate({ width:"50%" }) 							// Zoom out
								}
							Sound("img/tada.mp3");													// Correct sound
							}
						else{																		// Wrong
							o.status=false;															// Set status
							$("#hm-act-"+i).css({ left:o.startX+"%", top:o.startY+"%" });			// Move back
							Sound("img/sorry.mp3");													// Incorrect sound
						}
					}
				});
			}
	}


} // App class closure
