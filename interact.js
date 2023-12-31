///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INTERACTION CLASS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Interact  {																					

	constructor()   																			// CONSTRUCTOR
	{
		this.acts=[];																				// Holds actions
		this.path="";																				// Assets path
		let o={ id:"T00-00-00-03-00", type:"dragsort", items:[], back:"back.png", done:"next" };
		o.doneAnimation=true;
		o.items.push( { sx:5.8,	 sy:28.2, 	ex:44.5,	 ey:58.3, 	wid:10.5 });		
		o.items.push( { sx:18.6, sy:28.2, 	ex:83.2,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:31.7, sy:28.2, 	ex:57.4,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:44.3, sy:28.2, 	ex:70.4,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:57.4, sy:28.2, 	ex:5.8,	 	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:70.7, sy:28.2, 	ex:18.6,	 ey:58.2, 	wid:10.5 });		
		o.items.push( { sx:83.2, sy:28.2, 	ex:31.7,	 ey:58.2, 	wid:10.5 });		
		this.acts[o.id]=o;
		this.acts["T00-00-01-02-00"]={ id:"T00-00-01-02-00", type:"click", done:"next", doneAnimation:true, items:[ { sx:.58, sy:.83, wid:.025, hgt:.1}] };
		this.acts["T00-00-01-03-00"]={ id:"T00-00-01-03-00", type:"click", done:"next", doneAnimation:true, items:[ { sx:.52, sy:.83, wid:.025, hgt:.1}] };
		this.acts["T00-00-01-04-00"]={ id:"T00-00-01-04-00", type:"click", done:"next", doneAnimation:true, items:[ { sx:.38, sy:.83, wid:.025, hgt:.1}] };
		this.acts["T00-00-01-05-00"]={ id:"T00-00-01-05-00", type:"placevalue", back:"back.png", done:"repeat" };
		o={ id:"T00-00-01-06-00", type:"rollover", items:[], back:"back.png", done:"repeat" };
		o.items.push( { ex:.57, ey:.735, wid:.05, src:"div" });		
		o.items.push( { ex:.51, ey:.735, wid:.05, src:"div" });		
		o.items.push( { ex:.45, ey:.735, wid:.05, src:"div" });		
		o.items.push( { ex:.395, ey:.735, wid:.05, src:"div"});		
		o.items.push( { ex:.33, ey:.735, wid:.05, src:"div" });		
		this.acts[o.id]=o;
		this.acts["T00-00-01-08-00"]={ id:"T00-00-01-08-00", type:"click", done:"play", doneAnimation:true, items:[ { sx:.52, sy:.52, wid:.3, hgt:.05 }] };
		this.acts["T00-00-01-09-00"]={ id:"T00-00-01-09-00", type:"wordform", back:"back.png", done:"repeat" };
		this.acts["T00-00-01-10-00"]={ id:"T00-00-01-10-00", type:"click", done:"play", items:[ { sx:.52, sy:.42, wid:.5, hgt:.1 }] };
		this.acts["T00-00-01-11-00"]={ id:"T00-00-01-11-00", type:"wordform", data:1, back:"back.png", done:"repeat" };
		this.acts["T00-00-02-03-00"]={ id:"T00-00-02-03-00", type:"wordform2", back:"back.png", done:"repeat" };
		this.acts["T00-00-02-07-00"]={ id:"T00-00-02-07-00", type:"click", done:"play+9", items:[ { sx:.52, sy:.84, wid:.3, hgt:.1 }] };
		this.acts["T00-00-02-07-01"]={ id:"T00-00-02-07-01", type:"click", done:"play", items:[ { sx:.52, sy:.84, wid:.3, hgt:.1 }] };
		this.acts["T00-00-02-09-00"]={ id:"T00-00-02-09-00", type:"dragdigits", doneAnimation:true, items:[], back:"back.png", done:"repeat" };
		this.acts["T00-00-04-01-00"]={ id:"T00-00-04-01-00", type:"robot",doneAnimation:true, items:[] };
	}

	Run(id)
	{
		this.curAct=this.acts[id];																	// Point at action
		if (!this.curAct) { trace("BAD INTERACTION"); return; };									// Quit if no interaction found
		this.path="assets/C"+act.curAct.id.substring(1,3)+"/"+act.curAct.id;						// Asset path + name
		$("#hm-overlay").off("click");																// Remove click handler because of recursion		
		$("#hm-overlay").off("mouseover");															// Mouseover		
		$("#hm-overlay").off("mouseout");															// Mouseout		
		if (act.curAct.type == "dragsort")			this.DragSort();								// Dragsort
		else if (act.curAct.type == "click")		this.Click();									// Click 
		else if (act.curAct.type == "placevalue")	this.Placevalue();								// Placevalue 
		else if (act.curAct.type == "rollover")		this.Rollover();								// Rollover
		else if (act.curAct.type == "wordform")		this.Wordform();								// Wordform
		else if (act.curAct.type == "wordform2")	this.Wordform2();								// Wordform2
		else if (act.curAct.type == "models")		this.Models();									// Models
		else if (act.curAct.type == "dragdigits")	this.DragDigits();								// Dragdigits
		else if (act.curAct.type == "robot")		this.RobotGame();								// Robot game
	
		$("#hm-overlay").on("click", (e)=>{															// ON OVERLAY CLICK
			let x=e.offsetX/$("#hm-overlay").width();												// Get x pos
			let y=e.offsetY/$("#hm-overlay").height();												// Y
			trace(x.toFixed(2),y.toFixed(2));														// Log
			});
	}


	RobotGame(which=0)																			// ROBOTGAME INTERACTION
	{
		let i,o,str="";
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes
		str+=`<img src="${this.path}-back${which+1}.png" style="width:100%">`;						// Add back
		act.curAct.items=[];																		// Clear items
		if (which == 0) {
			act.curAct.items.push({ sx:3,	 sy:90, 	ex:28,	 ey:27, 	wid:5 });
			act.curAct.items.push({ sx:8,	 sy:90, 	ex:28,	 ey:39, 	wid:5 });
			act.curAct.items.push({ sx:13,	 sy:90, 	ex:28,	 ey:50, 	wid:5 });
			act.curAct.items.push({ sx:18,	 sy:90, 	ex:28,	 ey:61, 	wid:5 });
			act.curAct.items.push({ sx:23,	 sy:90, 	ex:28,	 ey:73, 	wid:5 });
			act.curAct.items.push({ sx:28,	 sy:90, 	ex:38, 	 ey:27, 	wid:5 });
			act.curAct.items.push({ sx:38.5, sy:90, 	ex:38,	 ey:39, 	wid:5 });
			act.curAct.items.push({ sx:48,	 sy:90, 	ex:40,	 ey:50, 	wid:5 });
			act.curAct.items.push({ sx:53,   sy:90, 	ex:39.5, ey:61, 	wid:5 });
			act.curAct.items.push({ sx:59,	 sy:90, 	ex:40,	 ey:73, 	wid:5 });
			}
		else if (which == 1) {
			act.curAct.items.push({ sx:3,	 sy:90, 	ex:23,   ey:31, 	wid:5 });
			act.curAct.items.push({ sx:8,	 sy:90, 	ex:23,   ey:45, 	wid:5 });
			act.curAct.items.push({ sx:13,	 sy:90, 	ex:23,   ey:58, 	wid:5 });
			act.curAct.items.push({ sx:18,	 sy:90, 	ex:34,   ey:19.5, 	wid:5 });
			act.curAct.items.push({ sx:23,	 sy:90, 	ex:23,   ey:73, 	wid:5 });
			act.curAct.items.push({ sx:28,	 sy:90, 	ex:32.5, ey:45, 	wid:5 });
			act.curAct.items.push({ sx:35.5, sy:90, 	ex:31,	 ey:73, 	wid:5 });
			act.curAct.items.push({ sx:46,	 sy:88, 	ex:46,	 ey:70, 	wid:10 });
			}

		for (i=0;i<act.curAct.items.length;++i) {													// For each item
			o=act.curAct.items[i];																	// Point at items
			o.status=false;																			// Reset status
			str+=`<img id="hm-act-${i}" src="${this.path}-${which*20+i}.png" style="position:absolute;left:${o.sx}%;top:${o.sy}%;height:${o.wid}%">`;	
			}
		str+=`<div id="hm-robot" style="position:absolute;left:69%;top:6%;width:25%"></div>`;		// Holds robot

		$("#hm-overlay").html(str);																	// Add items to markup														111110000
		for (i=0;i<act.curAct.items.length;++i) {
			$("#hm-act-"+i ).draggable({															// Make item draggable
				stop:(e,ui)=>{																		// On drag stop
					let j=e.target.id.substring(7);													// Get index
					let o=act.curAct.items[j];														// Point at item
					if ((Math.abs(ui.position.left/w*100-o.ex) < 10) && (Math.abs(ui.position.top/h*100-o.ey) < 20)) { // If correct
						o.status=true;																// Set status
						$("#hm-act-"+j).css({ left:o.ex+"%", top:o.ey+"%"});						// Move in place
						for (j=0;j<act.curAct.items.length;++j)	if (!act.curAct.items[j].status) break;	// Go through status
							if (j == act.curAct.items.length) this.Done(act.curAct);				// All correct!, so handle done 
							Sound("img/tada.mp3");													// Correct sound
							$("#hm-robot").append(`<img src="${this.path}-8${e.target.id.substring(7)}.png" style="width:100%;position:absolute">`);		// Add it	
							if ((e.target.id.substring(7) == 0) && which)	$("#hm-robot").append(`<img src="${this.path}-89.png" style="width:100%;position:absolute">`);	// Kludge	
							if ((e.target.id.substring(7) == 2) && (which))	$("#hm-robot").append(`<img src="${this.path}-88.png" style="width:100%;position:absolute">`);		// Kludge
							}
						else{																		// Wrong
							o.status=false;															// Set status
							$("#hm-act-"+j).css({ left:o.sx+"%", top:o.sy+"%" });					// Move back
							Sound("img/error1.mp3");												// Incorrect sound
						}
					}
				});
			}
			
		this.OnClick(.82,.86,.1,.05,()=>{															// On help
			TimedPopUp("The object of the game is to enter missing digits and values.<br>For the missing information in each row, drag the answers in the correct box.",-1)
			});
		this.OnClick(.73,.95,.1,.05,()=>{ this.RobotGame(0);		});								// Switch to game 1
		this.OnClick(.89,.95,.1,.05,()=>{ this.RobotGame(1);		});								// Switch to game 2
	}


	Click(num=0)																				// CLICK INTERACTION
	{
		let o=this.curAct.items[num];																// Point at item (defaults to first)
		this.OnClick(o.sx,o.sy,o.wid,o.hgt,()=>{													// On click subroutine
			Sound("ding");																			// Ding			
			this.Done();																			// Handle done
			},()=>{	this.Failure(); }																// Handle failure
		);
	}

	Models()																					// MODELS INTERACTION
	{
		let i,str="";	
		let ones=0,tens=0,hundreds=0,thousands=0;
		let n=Math.floor(Math.random()*2999)+1000;												// Get random number from 1000-3999							

		if (act.curAct.back)	str+=`<img src="${this.path}-${act.curAct.back}" style="width:100%">`;	// Add back
		str+=`<div id="hm-act1000" style="position:absolute;left:6%;top:32%;width:15%"></div>	
			<div id="hm-act100"  style="position:absolute;left:23%;top:32%;width:15%"></div>	
			<div id="hm-act10"   style="position:absolute;left:39%;top:32%;width:15%"></div>	
			<div id="hm-act0"    style="position:absolute;left:55%;top:32%;width:15%;height:100%"></div>	
			<div id="hm-actv"    style="position:absolute;left:76%;top:55%"></div>	
			<div style="position:absolute;left:74%;top:30%">Use blocks to<br>represent ${n}.
			</div>`;	
	
		this.OnClick(.62,.24,.10,.1,()=>{	ones=Math.min(ones+1,9);	 	 	draw(); });			// On click ones
		this.OnClick(.45,.24,.10,.1,()=>{	tens=Math.min(tens+1,9);	 	 	draw(); });			// Tens
		this.OnClick(.29,.24,.10,.1,()=>{	hundreds=Math.min(hundreds+1,9); 	draw(); })			// Hundreds
		this.OnClick(.13,.24,.10,.1,()=>{	thousands=Math.min(thousands+1,9);	draw(); })			// Thousands
			
		$("#hm-overlay").html(str);																	// Add items to markup														
		this.OnClick(.88,.74,.15,.05, ()=>{ 														// On done button
			if (thousands*1000+hundreds*100+tens*10+ones == n)	this.Success(true);					// Success animation
			else							this.Failure(true);										// Failure animation
			});													
		this.OnClick(.83,.953,.15,.05)																// On new problem
		this.OnClick(.13,.62,.5,.05,()=>{ ones=tens=hundreds=thousands=0;  draw(); })				// On erase button

		function draw() {																			// DRAW ICONS
			str="";
			Sound("click");																			// Click
			$("#hm-actv").html(thousands*1000+hundreds*100+tens*10+ones);							// Show number							
			for (i=0;i<ones;++i)																	// For each one
				str+=`<img src="img/unitblock.png" style="width:15%;margin:0 15% 10% 15%">`; 		// Add image
			$("#hm-act0").html(str); str="";														// Add items to markup														
			for (i=0;i<tens;++i)																	// For each one
				str+=`<img src="img/bar.png" style="width:10%;margin:0 4% 10% 4%">`;				// Add image
			$("#hm-act10").html(str); str="";														// Add items to markup														
			for (i=0;i<hundreds;++i)																// For each one
				str+=`<img src="img/block.png" style="width:33%;margin:0 10% 10% 1%">`;				// Add image
			$("#hm-act100").html(str);	str="";														// Add items to markup														
			for (i=0;i<thousands;++i)																// For each one
			str+=`<img src="img/cube.png" style="width:33%;margin:0 10% 10% 1%">`;					// Add image
			$("#hm-act1000").html(str);	str="";														// Add items to markup														
			}
	}

	Wordform2()																					// WORDFORM INTERACTION
	{
		let str="";
		let words=["250:two hundred fifty",
				"532:five hundred thirty two",
				"1,998:one thousand, nine hundred ninety eight",
				"3,422:three thousand, four hundred twenty two",
				"998:nine hundred ninety eight",
				"697:six hundred ninety seven",
				"4,001:four thousand one",
				"622:six hundred twenty two"
				];
		let n=Math.floor(Math.random()*words.length);												// Get random word
		this.correct=words[n].split(":")[0];														// Save correct answer
		if (act.curAct.back)	str+=`<img src="${this.path}-${act.curAct.back}" style="width:100%">`;	// Add back
		str+=`<div style="position:absolute;;left:8%;top:55%">${words[n].split(":")[1]}</div>		
		<div style="position:absolute;cursor:pointer;left:81%;top:55%">${words[n].split(":")[0]}</div>`;		
		$("#hm-overlay").html(str);																	// Add items to markup														
		this.OnClick(.88,.23,.15,.05)																// On click enter button
	}
	
	Wordform()																					// WORDFORM INTERACTION
	{
		let str="";
		let words=["27250:twenty-seven thousand, two hundred fifty",
				"24532:twenty-four thousand, five hundred thirty two",
				"99998:ninety-nine thousand, nine hundred ninety eight",
				"15422:fifteen thousand, four hundred twenty two",
				"9636:nine thousand, six hundred thirty six",
				"197:one hundred ninety seven",
				"2001:two thousand one",
				"652:six hundred fifty two"
				];
		let n=Math.floor(Math.random()*words.length);												// Get random word
		this.correct=words[n].split(":")[0];														// Save correct answer
		
		if (this.curAct.data == 1) {																// If expanded
			this.correct=n=Math.floor(Math.random()*9999)+200;										// Get random number from 200-9999							
			words[0]=this.correct+":";																// Add correct
			if (n > 999) words[0]+=Math.floor(n/1000)+",000 + ";									// Add thousands
			if (n > 99)  words[0]+=Math.floor(n%1000/100)+"00 + ";									// Hundreds
			if (n > 9)   words[0]+=Math.floor(n%100/10)+"0 + ";										// Tens
			words[0]+=n%10;																			// Ones
			n=0;
			}
		if (act.curAct.back)	str+=`<img src="${this.path}-${act.curAct.back}" style="width:100%">`;	// Add back
		str+=`<div style="position:absolute;cursor:pointer;left:10%;top:53%">${words[n].split(":")[1]}</div>		
			<input id="hm-act" style="font-size:1.6vw;font-weight:bold;width:11vw;padding:5px;position:absolute;left:30%;top:64%">`;		
		$("#hm-overlay").html(str);																	// Add items to markup														
		this.OnClick(.64,.68,.1,.05,()=>{															// On click enter button
			if ($("#hm-act").val() == this.correct)	this.Success(true);								// Success animation
			else									this.Failure();									// Failure notice
			});																
		this.OnClick(.51,.42,.1,.05);																// On click done button
	}
	
	
	Rollover()																					// PLACEVALUE INTERACTION
	{
		let i,n,o,str="";
		let places=["ones","tens","hundreds","thousands","ten thousands"];							// Place names
		let num=Math.floor(Math.random()*99999+10000);												// Get random number from 10000-99999							
		if (act.curAct.back)	str+=`<img src="${this.path}-${act.curAct.back}" style="width:100%">`;	// Add back
		for (i=0;i<act.curAct.items.length;++i) {													// For each item
			o=act.curAct.items[i];																	// Point at items
			if (o.src == "div")	{																	// If a div
				n=(""+num).substring(5-i,4-i);														// Isolate digit	
				if (i == 3) n+=",";																	// Add comma		
				str+=`<div id="hm-act-${i}" style="position:absolute;cursor:pointer;left:${o.ex*100}%;top:${o.ey*100}%;width:${o.wid*100}%">${n}</div>`;
				}
			}
		$("#hm-overlay").html(str);																	// Add items to markup														
		
		for (i=0;i<act.curAct.items.length;++i) {													// For each item
			this.OnOver("hm-act-"+i,(n)=>{															// OnOver routine
				let dig=(""+num).substring(5-n,4-n);
				let pv=n*10
				let msg=`<div style="display:inline-block;color:#fff;width:3vw;height:2.5vw;text-align:center;border-radius:99px;background-color:#185b9d;padding-top:.5vw">
				${dig}</div> &nbsp;is in the ${places[n]} place, it's place value is ${dig*Math.pow(10,n)}`;
				PopUp(msg,"hm-overlay");															// Show popup
				},(n)=>{ $("#popupDiv").remove(); });												// Kill popup						
			}
		
		this.OnClick(.78,.75,.11,.05);																// On click done button
	}

	Placevalue()																				// PLACEVALUE INTERACTION
	{
		let i,str="";
		let num=Math.floor(Math.random()*499+100);													// Get random number from 100-4S99							
		let ones=num%10;																			// Isolate ones
		let tens=Math.floor(num%100/10);															// Tens
		let hundreds=Math.floor(num/100);															// Hundreds
		if (act.curAct.back)	str+=`<img src="${this.path}-${act.curAct.back}" style="width:100%">`;		// Add back
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
		this.OnClick(.9,.73,.1,.05);																// On click done button
		}

	DragSort()																					// DRAGSORT INTERACTION
	{
		let i,o,str="";
		let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes
		if (act.curAct.back)	str+=`<img src="${this.path}-${act.curAct.back}" style="width:100%">`;	// Add back
		for (i=0;i<act.curAct.items.length;++i) {													// For each item
			o=act.curAct.items[i];																	// Point at items
			o.status=false;																			// Reset status
			str+=`<img id="hm-act-${i}" src="${this.path}-${i}.png" style="position:absolute;left:${o.sx}%;top:${o.sy}%;width:${o.wid}%">`;
			}
		$("#hm-overlay").html(str);																	// Add items to markup														
		for (i=0;i<act.curAct.items.length;++i) {
			$("#hm-act-"+i ).draggable({															// Make item draggable
				stop:(e,ui)=>{																		// On drag stop
					let j=e.target.id.substring(7);													// Get index
					let o=act.curAct.items[j];														// Point at item
					if ((Math.abs(ui.position.left/w*100-o.ex) < o.wid*.8) && (Math.abs(ui.position.top/h*100-o.ey) < o.wid*.8)) { // If correct
						o.status=true;																// Set status
						$("#hm-act-"+j).css({ left:o.ex+"%", top:o.ey+"%"});						// Move in place
						for (j=0;j<act.curAct.items.length;++j)	if (!act.curAct.items[j].status) break;		// Go through status
							if (j == act.curAct.items.length) this.Done(act.curAct);				// All correct!, so gandle done 
							Sound("img/tada.mp3");													// Correct sound
							}
						else{																		// Wrong
							o.status=false;															// Set status
							$("#hm-act-"+j).css({ left:o.sx+"%", top:o.sy+"%" });					// Move back
							Sound("img/error1.mp3");												// Incorrect sound
						}
					}
				});
			}
	}

	DragDigits()																				// DRAGDIGITS INTERACTION
	{
		let i,o,str="";

		if (act.curAct.back)	str+=`<img src="${this.path}-${act.curAct.back}" style="width:100%">`;	// Add back
		for (i=0;i<10;++i) {															// For each item
			str+=`<div id="hm-act-${i}" style="position:absolute;left:0;top:0;width:10%>`;
			}
		$("#hm-overlay").html(str);																	// Add items to markup														
/*	
		for (i=0;i<act.curAct.items.length;++i) {
			$("#hm-act-"+i ).draggable({															// Make item draggable
				stop:(e,ui)=>{																		// On drag stop
					let j=e.target.id.substring(7);													// Get index
					let o=act.curAct.items[j];														// Point at item
					if ((Math.abs(ui.position.left/w*100-o.ex) < o.wid*.8) && (Math.abs(ui.position.top/h*100-o.ey) < o.wid*.8)) { // If correct
						o.status=true;																// Set status
						$("#hm-act-"+j).css({ left:o.ex+"%", top:o.ey+"%"});						// Move in place
						for (j=0;j<act.curAct.items.length;++j)	if (!act.curAct.items[j].status) break;		// Go through status
							if (j == act.curAct.items.length) this.Done(act.curAct);				// All correct!, so gandle done 
							Sound("img/tada.mp3");													// Correct sound
							}
						else{																		// Wrong
							o.status=false;															// Set status
							$("#hm-act-"+j).css({ left:o.sx+"%", top:o.sy+"%" });					// Move back
							Sound("img/error1.mp3");												// Incorrect sound
						}
					}
				});
			}
		*/
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

	OnClick(x, y, wid, hgt, success, failure=()=>{})												// REACT TO A MOUSE CLICK
	{
		$("#hm-overlay").on("click", (e)=>{
			if (!success) success=()=> { Sound("ding"); act.Done(); };									// Default success
			let x1=e.offsetX/$("#hm-overlay").width();													// Get x pos
			let y1=e.offsetY/$("#hm-overlay").height();													// Y
			if ((Math.abs(x-x1) < wid) && (Math.abs(y-y1) < hgt)) success();							// If in range, run success callback
			else 												  failure();							// Run failure callback
			});
	}

	Done()																							// HANDLE DONE WITH INTERACTION
	{
		if (act.curAct.doneAnimation) 	act.Success("play",()=>{ next(act.curAct)} );					// Show success animation, then handle done
		else							next();															// Handle done

		function next() {																				// HANDLE DONE NEXT MOVE
			if (act.curAct.done == "next") 			$("#hm-pageNext").trigger("click");					// Go onto next page
			else if (act.curAct.done && act.curAct.done.match(/play/i)) {								// If play
				let off=act.curAct.done.match(/play\+(\d*)/);											// Get offset, if set
				if (off && off[1])	vid.RunPlayer("seek",vid.curTime+(off[1]-0));						// Seek there	
				$("#hm-overlay").html("");																// Claar overlay
				$("#hm-play").trigger("click");															// Resume playing
				}
			else if (act.curAct.done == "repeat")	act.Run(act.curAct.id);								// Recurse
			}	
	}

	Success(animation, callback)																		// PLAY SUCCESS ANIMATION
	{
		Sound("img/yea.mp3");																			// Yea sound
		$("#hm-success").remove();																		// Remove old image																								
		let pics=["thumbsup","ribbon","checkbox","heart","accept"];										// Possible images
		let pic=pics[Math.floor(Math.random()*pics.length)];		
		if (animation) {																				// if an animatiom
			$("#hm-overlay").append(`<img id="hm-success" src="img/${pic}.png" style="left:50%;top:50%;position:absolute;width:0;z-index:99">`);
			let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes

			$("#hm-success").animate({ width:"50%", left:(w/2-w/4)+"px", top:((h-(w/2))/2)+"px"},1000, done());	// Zoom icon out
		
		function done() {																				// WHEN ANIMATION IS FINISHED	
			setTimeout(()=>{																			// Wait 
				$("#hm-success").fadeOut(500, ()=>{ $("#hm-success").remove();	});						// Fade out icon
				if (callback) callback(); }, 1500); }													// Run callback if set
			}

	}

	Failure(animation, callback)																	// PLAY FAILURE ANIMATION
	{
		let snds=["sorry","error1","error2","error3","error4"];											// Possible sounds
		let snd=snds[Math.floor(Math.random()*snds.length)];											// Pick one	
		Sound("img/"+snd+".mp3");																		// Play it
		let pics=["sadface","oops","redcheck","thumbdown","exclaim"];										// Possible images
		let pic=pics[Math.floor(Math.random()*pics.length)];		
		if (animation) {																				// if an animatiom
			$("#hm-overlay").append(`<img id="hm-success" src="img/${pic}.png" style="left:50%;top:50%;position:absolute;width:0;z-index:99">`);
			let w=$("#hm-overlay").width(), h=$("#hm-overlay").height();								// Get container sizes

			$("#hm-success").animate({ width:"50%", left:(w/2-w/4)+"px", top:((h-(w/2))/2)+"px"},1000, done());	// Zoom icon out
		
		function done() {																				// WHEN ANIMATION IS FINISHED	
			setTimeout(()=>{																			// Wait 
				$("#hm-success").fadeOut(500, ()=>{ $("#hm-success").remove();	});						// Fade out icon
				if (callback) callback(); }, 1500); }													// Run callback if set
			}


	}


} // App class closure
