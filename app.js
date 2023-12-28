///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN APP CLASS																			GLOBALS: app, vid, act
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class App  {																					

	constructor()   																			// CONSTRUCTOR
	{
		app=this;
		this.userID="";																				// User ID
		this.module='0';																			// Module id
		this.lesson='0';																			// Current lesson
		this.topic='0';																				// Current topic
		this.page='0';																				// Current page
		this.id="";																					// Position id
		this.course={name: "HelpMath", version:.9, modules:[]};										// Course data
		this.LoadConfig("project.json");															// Load config file and set up project
		this.language="English";																	// Language
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
		o.push({ name: "Math Foundations 1", id: "01000000", lessons:[], title:"Counting on Numbers" });	// Add modules
		o.push({ name: "Math Foundations 2", id: "02000000", lessons:[], title:"Module 2" });
		o.push({ name: "Math Foundations 3", id: "03000000", lessons:[], title:"Module 3"});
		o.push({ name: "Numbers make sense", id: "04000000", lessons:[], title:"Module 4" });
		o.push({ name: "Algebra - From ABC to XYZ", id: "05000000", lessons:[], title:"Module 5 "});
		o.push({ name: "Geometry - Go figure", id: "06000000", lessons:[], title:"Module 6" }),
		o.push({ name: "Data Analysis - How likely!", id:"07000000", lessons:[], title:"Module 7" });

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
			}
	
		this.ExtractData();			
		o=this.course.modules[0].lessons;
		o.push({ name:"Addition and Subtraction", topics:[]} );	
		o.push({ name:"Multiplication", topics:[] });	
		o.push({ name:"Division", topics:[] });	
		o.push({ name:"Fractions", topics:[] });	
		o.push({ name:"Decimals and Money", topics:[] });	
		o.push({ name:"Measurement", topics:[] });	
		o.push({ name:"Geometry", topics:[] });	
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
			app.topic=app.page="0";																	// Reset topic/page
			app.ShowLesson();																		// Show lesson
			});
	}
	
	ShowLesson()																				// SHOW LESSON
	{
//this.topic=2;	
		if (!app.course.modules[app.module].lessons[app.lesson])	return;							// Quit if no lesson
		curLesson=app.course.modules[app.module].lessons[app.lesson];								// Point at lesson
		if (!curLesson.topics[app.topic])							return;							// Quit if no topic
		curPage=curLesson.topics[app.topic].pages[app.page];										// Point at page

		$("#auth-start").val(curPage.start); $("#auth-end").val(curPage.end);$("#auth-name").val(curPage.name);	 //  For authoring

		let str=`<img src="img/logo2.png" style="float:left;height:5vw;margin:16px 0 0 16px">
			<img id="hm-close" src="img/closebut.png" title="Close / Cerrar"style="width:20px;float:right;margin:16px 16px 0 0;cursor:pointer">
			<div style="text-align:center;width:calc(16% - 16px);position:absolute;left:32px;top:20vw">
				<div id="hm-mapbut" class="hm-topicbut">${trans("Map")}</div>
				<div id="hm-keyterms" class="hm-topicbut">${trans("Keyterms")}</div>
				<!-- div id="hm-formulas" class="hm-topicbut">${trans("Formulas")}</div -->
				<div id="hm-spanish" class="hm-topicbut"  title="Hear page in Spanish">Habla paginá</div>
			</div>
			<div style="text-align:center;width:84%;padding-top:12px;margin-bottom:16px;">
				<div class="hm-lessonTitle"<div>${trans(app.course.modules[app.module].title)}</div>
				<div class="hm-lessonSubTitle">${trans(curLesson.name)}: ${trans(curLesson.topics[app.topic].name)}</div>
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
			vid.RunPlayer($("#hm-play").prop("src").match(/pause/i) ? "play" : "pause");			// Control video
			});
	
		$("#hm-close").on("click",()=>{	app.ShowModules(app.module); });							// PICK A MODULE
		$("#hm-next").on("click",()=>{ $("#hm-pageNext").trigger("click"); });						// NEXT
		$("#hm-mapbut").on("click",()=>{ app.ShowTopicMenu() });									// TOPICS MENU
		$("#hm-keyterms").on("click",()=>{ key.Show() });											// KEY TERMS MENU
//act.Run("T00-00-02-09-00");	
	}
	
	DrawPageBar(pages)																			// DRAW PAGE NAVIGATION BAR
	{
		let i;
		if (!pages.length)	return;																	// Quit if none
		let pct=100/(pages.length);																	// Pct of bar per page
		let slop=50/(pages.length-1);
		let str=`<div id="hm-pageBack" class="hm-page" style="background-color:#185b9d;cursor:pointer;width:16px;border-radius:12px 0 0 12px"><</div>`
		for (i=1;i<pages.length;++i)																// For each page
			str+=`<div id="hm-page-${i}" class="hm-page" style="width:calc(${pct}% - ${slop}px); 
				background-color:${pages[i].status ? "#6cbe6f" : "#aaa"}">${i}</div>`;
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
			app.PreviousPage();																		// Go to prevous page
			});
		$("#hm-pageNext").on("click", function(e) {													// ON FORWARD
			Sound("click");																			// Click sound
			app.NextPage();																			// Go to next page
			});
	}

	NextPage()																					// GO ON TO NEXT PAGE IN LESSON
	{
		if (app.page < app.course.modules[app.module].lessons[app.lesson].topics[app.topic].pages.length-1)	// If still in this lesson
			app.page++;																				// Advance to next page																		
		else if (app.topic < app.course.modules[app.module].lessons[app.lesson].topics.length-1)	// If not last topic
			app.page=0,app.topic++;																	// Advance to next topic																	
		else if (app.lesson < app.course.modules[app.module].lessons.length-1)						// If not last lesson
			app.page=0,app.topic=0,app.lesson++;													// Advance to next lesson																	
		else if (app.module < app.course.modules.length-1)											// If not last module
			app.page=0,app.topic=0,app.lesson=0,app.module++;										// Advance to next module																	
		app.ShowLesson();																			// Show page
	}

	PreviousPage()																				// GO ON TO PREVIOUS PAGE IN LESSON
	{
		app.page=Math.max(0,app.page-1)																// Dec
		app.ShowLesson();																			// Show page
	}

	ShowTopicMenu()																				// SHOW TOPIC MENU
	{
		$("#hm-map").remove();																		// Kill old one
		$("#hm-mapbut").css("background-color","#009900");											// Hilite button
		let str=`<div id="hm-map" class="hm-terms">
			<img src="img/closebut.png" onclick="$('#hm-map').remove()" title="Close / Cerrar"style="width:16px;float:right;margin:-16px -16px;cursor:pointer">
				<div id="hm-mapData">
					<div style="width:100%;margin:-18px 0 16px 0;color:#185b9d;font-family:ComicSans,sans-serif;font-size:2vw;text-align:center"><b>The Map</b></div>
					<div style="position:absolute;left:50%;top:calc(2vw + 24px);height:calc(100% - 2vw - 48px);background-color:#185b9d;width:1px"></div>
					<div id="hm-dataLeft" style="position:absolute;height:100%;top:1.2vw;display:flex;justify-content:center;flex-direction:column">
						<div>
							<div class="hm-topicbut" id="hm-topic-0">${trans("Your World")}</div>
							<div class="hm-topicbut" id="hm-topic-1">${trans("Important words")}</div>
							<div class="hm-topicbut" id="hm-topic-2">${trans("Learn it")}</div>
							<div class="hm-topicbut" id="hm-topic-3">${trans("Try it")}</div>
							<div class="hm-topicbut" id="hm-topic-4">${trans("Play it")}</div>
							<div class="hm-topicbut" id="hm-topic-5">${trans("Practice test")}</div>
							<div class="hm-topicbut" id="hm-topic-6">${trans("Final quiz")}</div>
						</div>
					</div>
				<div id="hm-dataRight" style="position:absolute;width:50%;height:100%;top:1.2vw;display:flex;justify-content:center;flex-direction:column;right:-24px"></div>
			</div>`

		$("#hm-video").append(str.replace(/\t|\n|\r/g,""));											// Add markup

		$("[id^=hm-topic-]").on("click", function(e) {												// ON TOPIC SELECT
			Sound("click");																			// Click sound
			app.topic=e.target.id.substring(9);														// Get module index
			$("[id^=hm-topic-]").css("background-color","#185b9d;");								// Reset all
			$("#hm-topic-"+app.topic).css("background-color","#009900");							// Hilite button
			app.page=0;																				// Start on 1st page
			if ((app.topic == 1) || (app.topic == 2) || (app.topic == 5))	pages();				// Has specific pages
			else 															app.ShowLesson()		// Go to topic
			});

		function pages() {																			// SHOW PAGES
			let i, str="<div>";
			let o=curLesson.topics[app.topic];														// Point at topic
			for (i=1;i<o.pages.length;++i) {														// For each page
				if (o.pages[i].name)																// Skip practices
					str+=`<div class="hm-termitem" id="hm-topicpage-${i}">${trans((o.pages[i].name))}</div>`;// Add item
					}
			str+="</div>";	
			$("#hm-dataRight").html(str.replace(/\t|\n|\r/g,""));									// Add markup

			$("[id^=hm-topicpage-]").on("click", function(e) {										// ON TOPIC SELECT
				Sound("click");																		// Click sound
				app.page=e.target.id.substring(13);													// Get module index
				app.ShowLesson()																	// Go to to page
				});
		
			}
		}

	ExtractData()																				// GET COURSE DATA
	{
		this.course.modules[0]={ name:"Math Foundations 1", title:"Counting on Numbers",
			lessons:[{ name: "Place Value",	topics:[
					{ name: "Real World", pages:[
						{name:"Intro",start:4,end:11.61,status:0,links:[],id:"00-00-00-04"},
						{name:"2",start:18.6,end:143.8,status:0,links:[],id:"00-00-00-04"},
						{name:"3",start:150,end:242.5,status:0,links:[],id:"00-00-00-04"},
						{name:"4",start:245,end:300,status:0,triggers:[{time:54.5,id:"T00-00-00-03-00"}],links:[],id:"00-00-00-04"},
						{name:"5",start:310,end:338,status:0,links:[
							{name:"place value",start:21,end:29,x:0.65,y:0.1},
							{name:"compare",start:21,end:29,x:0.22,y:0.17},
							{name:"order",start:21,end:29,x:0.32,y:0.17},
							{name:"round",start:21,end:29,x:0.47,y:0.17},
							{name:"whole numbers",start:21,end:29,x:0.61,y:0.17}],triggers:[],id:"T00-00-00-00-00"}	
						]},	// TOPIC
					{ name: "Important Words", pages:[						
						{name:"Intro",start:4,end:12.6,status:0,links:[],id:"00-00-01-00",triggers:[]},
						{name:"Place-value chart/models",start:13.6,end:72.1,status:0,links:[],id:"00-00-01-01",triggers:[]},
						{name:"Place-value ones",start:75.6,end:79.4,status:0,triggers:[{time:3.6,id:"T00-00-01-02-00"}],links:[],id:"00-00-01-02"},
						{name:"Place-value tens",start:86.35,end:90.64,status:0,triggers:[{time:4,id:"T00-00-01-03-00"}],links:[],id:"00-00-01-03"},
						{name:"Place-value hundred",start:94.29,end:98.41,status:0,triggers:[{time:4,id:"T00-00-01-04-00"}],links:[],id:"00-00-01-04"},
						{name:"Ones / tens / hundreds places ",start:103.29,end:156.67,status:0,triggers:[{time:"53",id:"T00-00-01-05-00"}],links:[],id:"00-00-01-05"},
						{name:"Ones / tens / hundreds places ",start:160,end:182,status:0,links:[],id:"00-00-01-06",triggers:[{time:"22",id:"T00-00-01-06-00"}]},
						{name:"Ones / thousands groups",start:185.5,end:223,status:0,links:[],id:"00-00-01-07",triggers:[]},
						{name:"Word form",start:225.7,end:262,status:0,links:[],id:"00-00-01-08",triggers:[{time:"26",id:"T00-00-01-08-00"}]},
						{name:"",start:263.56,end:286,status:0,links:[],id:"00-00-01-09",triggers:[{time:"22.04",id:"T00-00-01-09-00"}]},
						{name:"Standard and expanded form",start:288.06,end:360.38,status:0,links:[],id:"00-00-01-10",triggers:[{time:"64.97",id:"T00-00-01-10-00"}]},
						{name:"",start:362,end:380.5,status:0,links:[],id:"00-00-01-11",triggers:[{time:"18",id:"T00-00-01-11-00"}]},
						{name:"Rounding",start:382.64,end:404.82,status:0,links:[],triggers:[],id:"00-00-01-12"}
						]},	// TOPIC
					{ name: "Learn It!", pages:[						
						{name:"Introduction",start:4,end:12.6,status:0,links:[],triggers:[],id:"00-00-02-00"},
						{name:"Word form",start:18.1,end:73.6,status:0,links:[],triggers:[],id:"00-00-02-01"},
						{name:"Standard form",start:75.77,end:134.37,status:0,links:[],triggers:[],id:"00-00-02-02"},
						{name:"",start:136.98,end:163.44,status:0,links:[],triggers:[{time:"26.36",id:"T00-00-02-03-00"}],id:"00-00-02-03"},
						{name:"Using models to represent models",start:165.79,end:231.56,status:0,links:[],triggers:[],id:"00-00-02-04"},
						{name:"",start:233.49,end:274.53,status:0,links:[],triggers:[{time:"40.94",id:"T00-00-02-05-00"}],id:"00-00-02-05"},
						{name:"",start:277.1,end:339,status:0,links:[],triggers:[{time:"625",id:"T00-00-02-06-00"}],id:"00-00-02-06"},
						{name:"",start:341.55,end:414.76,status:0,links:[],id:"00-00-02-07",triggers:[{time:"37.4",id:"T00-00-02-07-00"},
							{time:"65.13",id:"T00-00-02-07-01"}]},
						{name:"Writing numbers",start:417.95,end:473,status:0,links:[],triggers:[],id:"00-00-02-08"},
						{name:"",start:476.38,end:499.09,status:0,links:[],triggers:[],id:"00-00-02-09"},
						{name:"Expanded form",start:500.97,end:583.1,status:0,links:[],triggers:[],id:"00-00-02-10"},
						{name:"",start:585.79,end:622.71,status:0,links:[],triggers:[{time:"11.82",id:"T00-00-02-11-00"},
							{time:"37.10",id:"T00-00-02-11-01"}],id:"00-00-02-11"},
						{name:"",start:623.95,end:655.12,status:0,links:[],triggers:[{time:"30.97",id:"T00-00-02-12-00"}],id:"00-00-02-12"},
						{name:"Round whole Numbers Using a number line",start:658.67,end:737,status:0,links:[],triggers:[{time:"65.02",id:"T00-00-02-13-00"}],id:"00-00-02-13"},
						{name:"Rounding using rules",start:740.01,end:794.55,status:0,links:[],triggers:[],id:"00-00-02-14"},
						{name:"Rounding rules",start:797.2,end:825.69,status:0,links:[],triggers:[],id:"00-00-02-15"},
						{name:"",start:828.02,end:880.93,status:0,links:[],triggers:[{time:"24.71",id:"T00-00-02-16-00"}],id:"00-00-02-16"},
						{name:"",start:882.41,end:898.65,status:0,links:[],triggers:[{time:"16.44",id:"T00-00-02-17-00"}],id:"00-00-02-17"},
						{name:"Rounding to hundreds",start:899.81,end:958.92,status:0,links:[],triggers:[],id:"00-00-02-18"},
						{name:"",start:961.29,end:977.67,status:0,links:[],triggers:[{time:"16.98",id:"T00-00-02-19-00"}],id:"00-00-02-19"},
						{name:"Rounding to thousands",start:978.68,end:1040.82,status:0,links:[],triggers:[],id:"00-00-02-20"},
						{name:"",start:1043.25,end:1058.73,status:0,links:[],triggers:[{time:"15.28",id:"T00-00-02-21-00"}],id:"00-00-02-21"},
						{name:"",start:1060.82,end:1092.37,status:0,links:[],triggers:[{time:"31.75",id:"T00-00-02-22-00"}],id:"00-00-02-22"},
						{name:"Comparing numbers",start:1093.65,end:1157.59,status:0,links:[],triggers:[{time:"23.61",id:"T00-00-02-23-00"}],id:"00-00-02-23"},
						{name:"",start:1160.65,end:1175.36,status:0,links:[],triggers:[{time:"17.57",id:"T00-00-02-24-00"}],id:"00-00-02-24"},
						{name:"Comparison ",start:1176.46,end:1207.52,status:0,links:[],triggers:[],id:"00-00-02-25"},
						{name:"",start:1209.71,end:1251.88,status:0,links:[],triggers:[{time:"14.22",id:"T00-00-02-26-00"}],id:"00-00-02-26"},
						{name:"",start:1254.23,end:1269.89,status:0,links:[],triggers:[{time:"13.39",id:"T00-00-02-27-00"}],id:"00-00-02-27"},
						{name:"Compare",start:1270.65,end:1336.92,status:0,links:[],triggers:[],id:"00-00-02-28"},
						{name:"",start:1338.91,end:1389.07,status:0,links:[],triggers:[{time:"15.8",id:"T00-00-02-29-00"},
							{time:"40.81",id:"T00-00-02-29-01"}],id:"00-00-02-29"},
						{name:"",start:1390.65,end:1417.17,status:0,links:[],triggers:[{time:"26.32",id:"T00-00-02-30-00"}],id:"00-00-02-30"},
						{name:"",start:1418.13,end:1432.25,status:0,links:[],triggers:[{time:"13.92",id:"T00-00-02-31-00"}],id:"00-00-02-31"},
						]},	// TOPIC
					{ name: "Try It!", pages:[						
						{ name: "Introduction", start:4,  end:12.6, status:0 },
						{ name: "?", start:4,  end:12.6, status:0 },
					]},	// TOPIC
						{ name: "Play It!", pages:[						
						{ name: "Introduction", start:4,  end:12.6, status:0 },
						{ name: "?", start:4,  end:12.6, status:0 },
					]},	// TOPIC
					{ name: "Practice Test", pages:[						
						{ name: "Introduction", start:4,  end:12.6, status:0 },
						{ name: "?", start:4,  end:12.6, status:0 },
					]},	// TOPIC
					{ name: "Final Quiz", pages:[						
						{ name: "Introduction", start:4,  end:12.6, status:0 },
						{ name: "?", start:4,  end:12.6, status:0 },
					]}], // TOPICS END
					
			}],  // LESSON END
		}	// MODULES
			
	}	


 
} // App class closure
