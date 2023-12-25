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
		o.items.push( { sx:5.8,	 sy:28.2, 	ex:44.5,	 ey:58.3, 	wid:10.5 });		
		o.items.push( { sx:18.6, sy:28.2, 	ex:83.2,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:31.7, sy:28.2, 	ex:57.4,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:44.3, sy:28.2, 	ex:70.4,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:57.4, sy:28.2, 	ex:5.8,	 	ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:70.7, sy:28.2, 	ex:18.6,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:83.2, sy:28.2, 	ex:31.7,	 ey:58.2, 	wid:10.5 });		
		this.acts[o.id]=o;
		this.acts["T00-00-01-02-00"]={ id:"T00-00-01-02-00", type:"click", done:"next", items:[ { sx:.58, sy:.83, wid:.025, hgt:.1}] };
		this.acts["T00-00-01-03-00"]={ id:"T00-00-01-03-00", type:"click", done:"next", items:[ { sx:.52, sy:.83, wid:.025, hgt:.1}] };
		this.acts["T00-00-01-04-00"]={ id:"T00-00-01-04-00", type:"click", done:"next", items:[ { sx:.38, sy:.83, wid:.025, hgt:.1}] };
		o={ id:"T00-00-01-05-00", type:"placevalue", items:[] };
		o.back="back.png";		
		this.acts[o.id]=o;
		o={ id:"T00-00-01-06-00", type:"rollover", items:[] };
		o.back="back.png";		
		o.items.push( { ex:.57, ey:.735, wid:.05, src:"div" });		
		o.items.push( { ex:.51, ey:.735, wid:.05, src:"div" });		
		o.items.push( { ex:.45, ey:.735, wid:.05, src:"div" });		
		o.items.push( { ex:.395, ey:.735, wid:.05, src:"div"});		
		o.items.push( { ex:.33, ey:.735, wid:.05, src:"div" });		
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
		this.OnClick(o.sx,o.sy,o.wid,o.hgt,()=>{													// On click subroutine
				Sound("ding");																		// Ding			
				this.HandleDone(action);															// Handle done
				},()=>{	this.Failure(); }															// Handle failure
			);
		}

	Rollover(action)																			// PLACEVALUE INTERACTION
	{
		let i,n,o,str="";
		let places=["ones","tens","hundreds","thousands","ten thousands"];							// Place names
		let num=Math.floor(Math.random()*99999+10000);												// Get random number from 10000-99999							
		if (action.back)	str+=`<img src="${this.path}-${action.back}" style="width:100%">`;		// Add back
		for (i=0;i<action.items.length;++i) {														// For each item
			o=action.items[i];																		// Point at items
			if (o.src == "div")	{																	// If a div
				n=(""+num).substring(5-i,4-i);														// Isolate digit	
				if (i == 3) n+=",";																	// Add comma		
				str+=`<div id="hm-act-${i}" style="position:absolute;cursor:pointer;left:${o.ex*100}%;top:${o.ey*100}%;width:${o.wid*100}%">${n}</div>`;
				}
			}
		$("#hm-overlay").html(str);																	// Add items to markup														
		
		for (i=0;i<action.items.length;++i) {														// For each item
			this.OnOver("hm-act-"+i,(n)=>{															// OnOver routine
				let dig=(""+num).substring(5-n,4-n);
				let pv=n*10
				let msg=`<div style="display:inline-block;color:#fff;width:3vw;height:2.5vw;text-align:center;border-radius:99px;background-color:#185b9d;padding-top:.5vw">
				${dig}</div> &nbsp;is in the ${places[n]} place, it's place value is ${dig*Math.pow(10,n)}`;
				PopUp(msg,"hm-overlay");															// Show popup
				},(n)=>{ $("#popupDiv").remove(); });												// Kill popup						
			}
		
		this.OnClick(.78,.75,.11,.05,()=>{															// OnClick routine
			$("#hm-overlay").off("click");															// Remove click handler because of recursion		
			$("#hm-overlay").off("mouseover");														// Mouseover		
			$("#hm-overlay").off("mouseout");														// Mouseout		
			Sound("ding");																			// Ding			
			this.Rollover(action);																	// Do it again
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
		str+=`</div><div style="position:absolute;left:83%;top:47.5%">${num}</div>
		<div style="position:absolute;left:14%;top:90%">${hundreds}</div>
		<div style="position:absolute;left:38%;top:90%">${tens}</div>
		<div style="position:absolute;left:63%;top:90%">${ones}</div>`;
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
			o.status=false;																			// Reset status
			str+=`<img id="hm-act-${i}" src="${this.path}-${i}.png" style="position:absolute;left:${o.sx}%;top:${o.sy}%;width:${o.wid}%">`;
			}
		str+=this.Success();																		// Add success animation markup
		$("#hm-overlay").html(str);																	// Add items to markup														
		for (i=0;i<action.items.length;++i) {
			$("#hm-act-"+i ).draggable({															// Make item draggable
				stop:(e,ui)=>{																		// On drag stop
					let j=e.target.id.substring(7);													// Get index
					let o=action.items[j];															// Point at item
					if ((Math.abs(ui.position.left/w*100-o.ex) < o.wid*.8) && (Math.abs(ui.position.top/h*100-o.ey) < o.wid*.8)) { // If correct
						o.status=true;																// Set status
						$("#hm-act-"+j).css({ left:o.ex+"%", top:o.ey+"%"});					// Move in place
						for (j=0;j<action.items.length;++j)	if (!action.items[j].status) break;		// Go through status
							if (j == action.items.length) this.HandleDone(action);					// All correct!, so gandle done 
							Sound("img/tada.mp3");													// Correct sound
							}
						else{																		// Wrong
							o.status=false;															// Set status
							$("#hm-act-"+j).css({ left:o.sx+"%", top:o.sy+"%" });			// Move back
							Sound("img/error.mp3");													// Incorrect sound
						}
					}
				});
			}
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TOOLS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	OnOver(div, success, failure=()=>{})															// REACT TO A MOUSE OVER
	{
		$("#"+div).on("mouseover", (e)=>{																// If over area
			success(e.target.id.substring(7));															// Call success
			});

		$("#"+div).on("mouseout", (e)=>{																// If out of area
			failure(e.target.id.substring(7));															// Call failure
			});
	}

	OnClick(x, y, wid, hgt, success, failure=()=>{})											// REACT TO A MOUSE CLICK
	{
		$("#hm-overlay").on("click", (e)=>{
			let x1=e.offsetX/$("#hm-overlay").width();												// Get x pos
			let y1=e.offsetY/$("#hm-overlay").height();												// Y
			if ((Math.abs(x-x1) < wid) && (Math.abs(y-y1) < hgt)) success();						// If in range, run success callback
			else 												  failure();						// Run failure callback
			});
	}

	HandleDone(action)																			// HANDLE DONE WITH INTERACTION
	{
		if (action.doneAnimation) 	this.Success("play",()=>{ next(action)} );						// Show success animation, then handle done
		else						next(action);													// Handle done
		
		function next(action) {																		// HANDLE DONE NEXT MOVE
			$("#hm-overlay").off("click");															// Remove click handler(s)			
			$("#hm-overlay").off("mouseover");														// Mouseover		
			$("#hm-overlay").off("mouseout");														// Mouseout		
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
