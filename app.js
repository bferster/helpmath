///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN APP CLASS
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
		this.course={name: "HelpMath", version:.9, modules:[]};										// Course data
		this.LoadConfig("project.json");															// Load config file and set up project
		this.language="English";																	// Language
	}

	LogIn(name, password)																		// LOG IN
	{
		this.ShowModules();																			// Show list of modules
	}

	LoadConfig(name)																			// LOAD CONFIG FILE
	{
		let i,j,k,l,n;
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
				for (k=0;k<7;++k) {																	// For each topic
					this.course.modules[i].lessons[j].topics.push({ name: "Topic "+(k+1), id:"0"+((i+1)*1000000+(j+1)*10000+(k+1)*100), pages:[] }); 		
					for (l=0;l<Math.random()*8+4;++l) {												// For each page
						this.course.modules[i].lessons[j].topics[k].pages.push({ name: "Page "+(l+1), id:"0"+((i+1)*1000000+(j+1)*10000+(k+1)*100+(l+1)) }); 	
						}
					}
				}
		o=this.course.modules[0].lessons;														
		o[0].name="Place Value";	o[1].name="Addition and Subtraction";	
		o[2].name="Multiplication";	o[3].name="Division";	
		o[4].name="Fractions";		o[5].name="Decinmals and Money";	
		o[6].name="Measurement";	o[7].name="Geometry";	
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
		$("#hm-main").css("display","block");														// Remove grid styling
		$("#hm-main").html(str.replace(/\t|\n|\r/g,""));											// Add markup
		$("#hm-lesson-"+app.lesson).css("background-color","#a7cea7");
	
		$("[id^=hm-module-]").on("click", function(e) {												// ON MODULE SELECT
			Sound("click");																			// Click sound
			app.module=e.target.id.substring(10);													// Get module index
			app.ShowModules(app.module-0+1)
			});

		$("[id^=hm-lesson-]").on("click", function(e) {												// ON LESSON SELECT
			Sound("click");																			// Click sound
			app.lesson=e.target.id.substring(10);													// Get lesson index
			app.topic=0;																			// Reset topic
			app.ShowLesson();																		// Show lesson
			});
	}
	
	ShowLesson()																				// SHOW LESSON
	{
		let les=app.course.modules[app.module].lessons[app.lesson];									// Point at lesson
		$("#hm-main").html(`<div id="hm-left" class="hm-left"></div><div id="hm-right" class="hm-right"></div>`);
		let str=`<img src="img/logo.png" style="width:100px"><br><br>
				<img id="hm-topicTri" src="img/triangle.png" style="position:absolute;left:36px">
				<div id="hm-topic-0" class="hm-topicbut">${trans("Your world")}</div>
				<div id="hm-topic-1" class="hm-topicbut">${trans("Learn it!")}</div>
				<div id="hm-topic-2" class="hm-topicbut">${trans("Play it!")}</div>
				<div id="hm-topic-3" class="hm-topicbut">${trans("Important words!")}</div>
				<div id="hm-topic-4" class="hm-topicbut">${trans("Try it!")}</div>
				<div id="hm-topic-5" class="hm-topicbut">${trans("Practice test")}</div>
				<div id="hm-topic-6" class="hm-topicbut">${trans("Final quiz")}</div>
				<div id="hm-done" class="hm-topicbut">${trans("Done")}</div>`;
			$("#hm-left").html(str.replace(/\t|\n|\r/g,""));										// Add left side markup

			str=`<img src="video.png" style="width:100%;border-radius:12px;max-height:calc(100vh - 180px); >
			<div id="hm-playerControl">
					<div id="hm-timeSlider" class="hm-timeSlider"></div>
					<img id="hm-play" src="img/playbut.png"  title="Play lesson" style="vertical-align:-8px">
					<div id="hm-keyterms" class="hm-topicbut" style="position:absolute;left:268px;top:calc(100vh - 80px)">${trans("Keyterms")}</div>
					<div id="hm-formulas" class="hm-topicbut" style="position:absolute;left:390px;top:calc(100vh - 80px)">${trans("Formulas")}</div>
					<img src="img/blilogo.png"style="width:175px;position:absolute;left:32px;bottom:32px">
					<div id="hm-audioSlider" title="Adjust volume" class="hm-audioSlider"></div>
					<img src="img/speaker.png" title="Adjust volume" style="position:absolute; left:calc(100% - 185px); top:calc(100vh - 60px)">
					<img src="img/language.png" title="Set language" style="position:absolute; left:calc(100% - 230px); top:calc(100vh - 60px)">
					<img src="img/helpicon.png" title="Get help" style="position:absolute; left:calc(100% - 275px); top:calc(100vh - 60px)">
					<img src="img/calculator.png" title="Use calculator" style="position:absolute; left:calc(100% - 318px); top:calc(100vh - 60px)">
					<img src="img/notepad.png" title="Take notes" style="position:absolute; left:calc(100% - 360px); top:calc(100vh - 60px)">
					<div class="hm-lessonTitle">${trans(les.name)}</div>
					<div id="hm-pageback" style="width:60%;margin-left:20%;height:24px"></div>`;
					$("#hm-right").html(str.replace(/\t|\n|\r/g,""));											// Add right side markup

		this.DrawPageBar(les.topics[app.topic].pages);												// Draw page bar
		$("#hm-main").css("display","grid");
		$("#hm-timeSlider").slider({});																// Init timeslider
		$("#hm-audioSlider").slider({ value:50});													// Init audioslider
		$("#hm-topic-"+app.topic).css("background-color","#009900");								// Higlight current topic
		$("#hm-topicTri").css("top",app.topic*41+184+"px");											// Triangle
	
		$("#hm-play").on("click",()=>{
			$("#hm-play").prop("src",$("#hm-play").prop("src").match(/play/i) ? "img/pausebut.png" : "img/playbut.png");
			});
	
		$("#hm-done").on("click",()=>{
			app.ShowModules(app.module);															// PICK A MODULE
			});
		
		$("[id^=hm-topic-]").on("click", function(e) {												// ON TOPIC SELECT
			Sound("click");																			// Click sound
			app.topic=e.target.id.substring(9);														// Get module index
			app.ShowLesson()
			});
		}
	
	DrawPageBar(pages)																			// DRAW PAGE NAVIGATION BAR
	{
		let i;
		if (!pages.length)	return;																	// Quit if none
		let pct=100/(pages.length+1);																// Pct of bar per page
		let slop=50/pages.length;
		let str=`<div id="hm-pageBack" class="hm-page" style="background-color:#185b9d;cursor:pointer;width:16px;border-radius:12px 0 0 12px"><</div>`
		for (i=0;i<pages.length;++i)																// For each page
			str+=`<div id="hm-page-${i}" class="hm-page" style="width:calc(${pct}% - ${slop}px)" - >${i+1}</div>`;
		str+=`<div id="hm-pageNext" class="hm-page" style="background-color:#185b9d;cursor:pointer;width:16px;border-radius:0 12px 12px 0">></div>`
		$("#hm-pageback").html(str.replace(/\t|\n|\r/g,""));										// Add markup
		
		$("#hm-page-0").css("background-color","#6cbe6f");
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
