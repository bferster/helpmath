///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN APP CLASS																			GLOBALS: app, vid, act
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class App  {																					

	constructor()   																			// CONSTRUCTOR
	{
		app=this;
		this.userID="";																				// User ID
		this.module=0;																				// Module id
		this.lesson=0;																				// Current lesson
		this.topic=0;																				// Current topic
		this.page=0;																				// Current page
		this.id="";																					// Position id
		this.course={name: "HelpMath", version:.9, modules:[]};										// Course data
		this.LoadConfig("project.json");															// Load config file and set up project
		this.language="English";																	// Language
		this.topics=["Your world","Learn it!","Play it!","Try it!","Practice test","Quiz"];			// Topic names
		vid=new Video();																			// Load video module
		act=new Interact();																			// Load interaction module
		key=new Keyterms();																			// Load keyterms module
	}

	LogIn(name, password)																		// LOG IN
	{
		this.ShowModules();																			// Show list of modules
	}

	LoadConfig(name)																			// LOAD CONFIG FILE
	{
		let i,j,k,l,n,n2;
		let o=this.course.modules;																	// Point at module array
		o.push({ name: "Math Foundations 1", id: "01000000", lessons:[] });							// Add modules
		o.push({ name: "Math Foundations 2", id: "02000000", lessons:[] });
		o.push({ name: "Math Foundations 3", id: "03000000", lessons:[]});
		o.push({ name: "Numbers make sense", id: "04000000", lessons:[] });
		o.push({ name: "Algebra - From ABC to XYZ", id: "05000000", lessons:[] });
		o.push({ name: "Geometry - Go figure", id: "06000000", lessons:[] }); 
		o.push({ name: "Data Analysis - How likely!", id:"07000000", lessons:[] });

		for (i=0;i<this.course.modules.length;++i) 	{												// For each module in course	
			n=Math.random()*6+4;
			if (!i) n=8;
			for (j=0;j<n;++j) {																		// For each lesson
				this.course.modules[i].lessons.push({ name: "Lesson "+(j+1), id:"0"+((i+1)*1000000+(j+1)*10000), topics:[] });				
				this.course.modules[i].lessons[j].title="Lesson Title";
				for (k=0;k<7;++k) {																	// For each topic
					this.course.modules[i].lessons[j].topics.push({ name: "Topic "+(k+1), id:"0"+((i+1)*1000000+(j+1)*10000+(k+1)*100), pages:[] }); 		
					n2=Math.random()*8+4
					if (!i) n2=5;
					for (l=0;l<n2;++l) {															// For each page
						this.course.modules[i].lessons[j].topics[k].pages.push({ name: "Page "+(l+1), id:"0"+((i+1)*1000000+(j+1)*10000+(k+1)*100+(l+1)), start:0, end:400, links:[] }); 	
						}
					}
				}
		o=this.course.modules[0].lessons;
		o[0].title="Counting on Numbers";														
		o[0].name="Place Value";	o[1].name="Addition and Subtraction";	
		o[2].name="Multiplication";	o[3].name="Division";	
		o[4].name="Fractions";		o[5].name="Decinmals and Money";	
		o[6].name="Measurement";	o[7].name="Geometry";
		o[0].topics[0].pages[0].start=4;	o[0].topics[0].pages[0].end=11.613; o[0].topics[0].pages[0].status=0;
		o[0].topics[0].pages[1].start=18.6;	o[0].topics[0].pages[1].end=143.8;	o[0].topics[0].pages[1].status=0;
		o[0].topics[0].pages[2].start=150;	o[0].topics[0].pages[2].end=242.5;	o[0].topics[0].pages[2].status=0;
		o[0].topics[0].pages[3].start=245;	o[0].topics[0].pages[3].end=300; 	o[0].topics[0].pages[3].status=0;
		o[0].topics[0].pages[3].triggers=[{ time:299.5-245, id:"C0-L0-T0-A1" }];
		o[0].topics[0].pages[4].start=310;	o[0].topics[0].pages[4].end=338;	o[0].topics[0].pages[4].status=0;
		o[0].topics[0].pages[4].links[0]={name:"place value", start:21, end:29, x:.65, y:.10 };
		o[0].topics[0].pages[4].links[1]={name:"compare", start:21, end:29, x:.22, y:.17 };
		o[0].topics[0].pages[4].links[2]={name:"order", start:21, end:29, x:.32, y:.17 };
		o[0].topics[0].pages[4].links[3]={name:"round", start:21, end:29, x:.47, y:.17 };
		o[0].topics[0].pages[4].links[4]={name:"whole numbers", start:21, end:29, x:.61, y:.17 };
	}

	}

	ShowModules(module=0)																		// SHOW MODULES TO PICK
	{
		let o,i;
		let str=`<div class="hm-module">
		<img src="img/logo.png" style="margin:48px 0 24px 0;width:20%"><br>
		<span style="font-size:2vw;font-weight:500">Choose your course</span><br><br>`;			// Title
		for (i=0;i<this.course.modules.length;++i) 													// For each module in course	
			str+=`<div class="hm-modbut" style="background-color:#${ module == (i+1) ? "009900" : "#85b9d"}" id="hm-module-${i}">${trans(this.course.modules[i].name)}</div>`;	// Add to menu
		if (module != 0) {
			str+=`<p style="font-size:2vw;font-weight:500">and your lesson</p><div>`;				// Sub title
			for (i=0;i<this.course.modules[module-1].lessons.length;++i) {							// For each lesson in module
				o=this.course.modules[module-1].lessons[i];											// Point at lessons in module
				str+=`<div class="hm-lessonbut" id="hm-lesson-${i}">${(i+1)}: ${trans(o.name)}</div>`; // Add lesson as option
				}
			str+="</div";																			// Close lesson div																
			}
		str+="</div>";																				// Close module div
		$("#hm-main").html(str.replace(/\t|\n|\r/g,""));											// Add markup
		$("#hm-lesson-"+app.lesson).css("background-color","#a7cea7");
	
		$("[id^=hm-module-]").on("click", function(e) {												// ON MODULE SELECT
			Sound("click");																			// Click sound
			app.module=e.target.id.substring(10);													// Get module index
			app.ShowModules(app.module-0+1);														// Show module picker
			});

		$("[id^=hm-lesson-]").on("click", function(e) {												// ON LESSON SELECT
			Sound("click");																			// Click sound
			app.lesson=e.target.id.substring(10);													// Get lesson index
			app.topic=app.page=0;																	// Reset topic/page
			app.ShowLesson();																		// Show lesson
			});
	}
	
	ShowLesson()																				// SHOW LESSON
	{
		curLesson=app.course.modules[app.module].lessons[app.lesson];								// Point at lesson
		curPage=curLesson.topics[app.topic].pages[app.page];										// Point at page
		

/*		let str=`<img src="img/logo.png" style="width:3vw"><br><br>
				<img id="hm-topicTri" src="img/triangle.png" style="position:absolute;left:36px">
		$("#hm-left").html(str.replace(/\t|\n|\r/g,""));										// Add left side markup
*/
			let str=`<img src="img/logo2.png" style="float:left;height:5vw;margin:16px 0 0 16px">
			<img id="hm-close" src="img/closebut.png" title="Close / Cerrar"style="width:20px;float:right;margin:16px 16px 0 0;cursor:pointer">
	
			<div style="text-align:center;width:calc(16% - 16px);position:absolute;left:32px;top:20vw">
				<div id="hm-map" class="hm-topicbut">${trans("Map")}</div>
				<div id="hm-keyterms" class="hm-topicbut">${trans("Keyterms")}</div>
				<!-- div id="hm-formulas" class="hm-topicbut">${trans("Formulas")}</div -->
				<div id="hm-spanish" class="hm-topicbut"  title="Hear page in Spanish">Habla paginá</div>
			</div>
			
			<div style="text-align:center;width:84%;padding-top:12px;margin-bottom:16px;">
				<div class="hm-lessonTitle"<div>${trans(curLesson.title)}</div>
				<div class="hm-lessonSubTitle">${trans(curLesson.name)}: ${trans(app.topics[app.topic])}</div>
			</div>
			<div id="hm-screen" class="hm-screen">
				<div id="hm-video" class="hm-video"></div>
				<img id="hm-next" src="img/next.png" class="hm-next" title="Next / proxima">

				<div id="hm-playerControl">
					<div id="hm-timeSlider" class="hm-timeSlider"></div>
					<img id="hm-play" src="img/playbut.png"  title="Play lesson" style="vertical-align:-8px;cursor:pointer;">
				</div>
		<div id="hm-pages" style="margin-top:8px;width:100%;text-align:center"></div>
		</div>`
		$("#hm-main").html(str.replace(/\t|\n|\r/g,""));											// Add  markup
		
		vid.RunPlayer("init");																		// Init video player
		this.DrawPageBar(curLesson.topics[app.topic].pages);												// Draw page bar
		curPage.status=1;
		str=`<div id="hm-appControls" style="position:absolute;left:30px;top:calc(100vh - 64px);width:calc(100% - 80px)">
			<div style="float:right;margin-top:4px">
				<img src="img/notepad.png" title="Take notes"class="hm-iconButton">
				<img src="img/calculator.png" title="Use calculator" class="hm-iconButton">
				<div id="hm-audioSlider" title="Adjust volume" class="hm-audioSlider"></div>
				<img src="img/helpicon.png" title="Get help" class="hm-iconButton"">
			</div>
		</div>`;
		$("#hm-main").append(str.replace(/\t|\n|\r/g,""));											// Add right side markup
		$("#hm-main").css("display","block");
		$("#hm-timeSlider").slider({																// Init timeslider
			slide:(event, ui)=>{																	// When dragging, seek player
				let time=ui.value/100*vid.dur+vid.start;											// Get time
				vid.RunPlayer("seek", time); 
				},		
			stop:()=>{ vid.ResetTriggers();	}														// After a drag, reset triggers live
			});	
		$("#hm-audioSlider").slider({ 																// Init audioslider
			value:vid.volume,																		// Default middle
			stop:(event, ui)=>{	vid.RunPlayer("volume", ui.value); } 								// After a drag, set player volume (0-100)
			});	
		$("#hm-topic-"+app.topic).css("background-color","#009900");								// Higlight current topic
		$("#hm-topicTri").css("top",app.topic*41+184+"px");											// Triangle

		$("#hm-play").on("click",()=>{
			$("#hm-play").prop("src",$("#hm-play").prop("src").match(/play/i) ? "img/pausebut.png" : "img/playbut.png");
			vid.RunPlayer($("#hm-play").prop("src").match(/play/i) ? "play" : "pause");				// Control video
			});
	
		$("#hm-close").on("click",()=>{	app.ShowModules(app.module); });							// PICK A MODULE
			
		$("#hm-next").on("click",()=>{ $("#hm-pageNext").trigger("click") });						// NEXT

		$("[id^=hm-topic-]").on("click", function(e) {												// ON TOPIC SELECT
			Sound("click");																			// Click sound
			app.topic=e.target.id.substring(9);														// Get module index
			app.ShowLesson()
			});

		$("#hm-keyterms").on("click",()=>{ key.Show() });											// KEY TERMS MENU
		}
	
	DrawPageBar(pages)																			// DRAW PAGE NAVIGATION BAR
	{
		let i;
		if (!pages.length)	return;																	// Quit if none
		let pct=100/(pages.length+1);																// Pct of bar per page
		let slop=50/pages.length;
		let str=`<div id="hm-pageBack" class="hm-page" style="background-color:#185b9d;cursor:pointer;width:16px;border-radius:12px 0 0 12px"><</div>`
		for (i=0;i<pages.length;++i)																// For each page
			str+=`<div id="hm-page-${i}" class="hm-page" style="width:calc(${pct}% - ${slop}px); 
				background-color:${pages[i].status ? "#6cbe6f" : "#aaa"}">${i+1}</div>`;
		str+=`<div id="hm-pageNext" class="hm-page" style="background-color:#185b9d;cursor:pointer;width:16px;border-radius:0 12px 12px 0">></div>`
		$("#hm-pages").html(str.replace(/\t|\n|\r/g,""));											// Add markup
		
		$("#hm-page-"+app.page).css("background-color","#009900");
		
		$("[id^=hm-page-]").on("click", function(e) {												// ON TOPIC SELECT
			Sound("click");																			// Click sound
			app.page=e.target.id.substring(8);														// Get module index
			app.ShowLesson()
			});
		$("#hm-pageBack").on("click", function(e) {													// ON BACK
			Sound("click");																			// Click sound
			app.page=Math.max(0,app.page-1)															// Dec
			app.ShowLesson()
			});
		$("#hm-pageNext").on("click", function(e) {													// ON FORWARD
			Sound("click");																			// Click sound
			app.page=Math.min(app.page+1,pages.length-1)											// Inc
			app.ShowLesson()
			});
	}


} // App class closure
