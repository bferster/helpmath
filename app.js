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
	}

	LogIn(name, password)																		// LOG IN
	{
		this.ShowModules();																			// Show list of modules
	}

	LoadConfig(name)																			// LOAD CONFIG FILE
	{
		let i,j;
		let o=this.course.modules;																	// Point at module array
		o.push({ name: "Math Foundations 1", id: "1000000", lessons:[] });							// Add modules
		o.push({ name: "Math Foundations 2", id: "02000000", lessons:[] });
		o.push({ name: "Math Foundations 3", id: "03000000", lessons:[]});
		o.push({ name: "Numbers make sense", id: "04000000", lessons:[] });
		o.push({ name: "Algebra - From ABC to XYZ", id: "05000000", lessons:[] });
		o.push({ name: "Geometry - Go figure", id: "06000000", lessons:[] }); 
		o.push({ name: "Data Analysis - How likely!", id:"07000000", lessons:[] });
	
		for (i=0;i<this.course.modules.length;++i) 	{												// For each module in course	
			o=this.course.modules[i].lessons;														// Point at lessons in module
			for (j=1;j<Math.random()*6+4;++j) 
				o.push({ name: "Lesson "+j, id:"0"+(i+1)*1000000+j*10000, topics:[] });				// Add lessons
			}
	}

	ShowModules(module=0)																		// SHOW MODULES TO PICK
	{
		let o,i;
		let str=`<div class="hm-module">
				<img src="img/logo.png" style="margin:48px 0 24px 0;width:20%"><br>
				<span style="font-size:2vw;font-weight:500">Choose your course</span><br><br>`;		// Title
		for (i=0;i<this.course.modules.length;++i) 													// For each module in course	
			str+=`<div class="hm-modbut" style="background-color:#${ module == (i+1) ? "009900" : "#85b9d"}" id="hm-module-${i}">${this.course.modules[i].name}</div>`;	// Add to menu
		if (module != 0) {
			str+=`<p style="font-size:2vw;font-weight:500">and your lesson</p><div>`;				// Sub title
			for (i=0;i<this.course.modules[module-1].lessons.length;++i) {							// For each lesson in module
				o=this.course.modules[module-1].lessons[i];											// Point at lessons in module
				str+=`<div class="hm-lessonbut" id="hm-lesson-${i}">${o.name}</div>`;				// Add lesson as option
				}
			str+="</div";																			// Close lesson div																
			}
		str+="</div>";																				// Close module div
		$("#hm-screen").html(str.replace(/\t|\n|\r/g,""));											// Add markup
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
			app.ShowLesson()
			});
	}
	
	ShowLesson()																				// SHOW LESSON
	{
		let str=`<div style="width:25%;position:absolute;left:48px;top:40px">
		<img src="img/logo.png" style="width:128px"><br><br>
		<img id="hm-topicTri" src="img/triangle.png" style="position:absolute;left:-9px">
		<div id="hm-topic-0" class="hm-topicbut">Your world</div>
		<div id="hm-topic-1" class="hm-topicbut">Learn it!</div>
		<div id="hm-topic-2" class="hm-topicbut">Play it!</div>
		<div id="hm-topic-3" class="hm-topicbut">Important words</div>
		<div id="hm-topic-4" class="hm-topicbut">Try it!</div>
		<div id="hm-topic-5" class="hm-topicbut">Practice test</div>
		<div id="hm-topic-6" class="hm-topicbut">Final quiz</div>
		<div id="hm-done" class="hm-topicbut">Quit</div>

		</div>
		<img src="video.png" class="hm-video"><br>
			<div id="hm-timeSlider" class="hm-timeSlider"></div>
			<img id="hm-play" src="img/playbut.png"  title="Play lesson" style="vertical-align:-7px">
			<div id="hm-keyterms" class="hm-topicbut" style="position:absolute;left:calc(25% - 48px);top:calc(100vh - 72px)">Keyterms</div>
			<div id="hm-formulas" class="hm-topicbut" style="position:absolute;left:calc(25% + 80px);top:calc(100vh - 72px)">Formulas</div>
			<img src="img/blilogo.png" style="width:15vw;position:absolute;left:40px;bottom:32px">
			<div id="hm-audioSlider"  title="Adjust volume" class="hm-audioSlider"></div>
			<img src="img/speaker.png"  title="Adjust volume" style="position:absolute; left:calc(100% - 185px); top:calc(100vh - 60px)">
			<img src="img/language.png"  title="Set language" style="position:absolute; left:calc(100% - 230px); top:calc(100vh - 60px)">
			<img src="img/helpicon.png"  title="Get help" style="position:absolute; left:calc(100% - 275px); top:calc(100vh - 60px)">
			<img src="img/calculator.png"  title="Use calculator" style="position:absolute; left:calc(100% - 318px); top:calc(100vh - 60px)">
			<img src="img/notepad.png"  title="Take notes" style="position:absolute; left:calc(100% - 360px); top:calc(100vh - 60px)">
			`;
		$("#hm-screen").html(str.replace(/\t|\n|\r/g,""));											// Add markup
		$("#hm-timeSlider").slider({});																// Init timeslider
		$("#hm-audioSlider").slider({ value:50});													// Init audioslider
		$("#hm-topic-"+app.topic).css("background-color","#009900");								// Higlight current topic
		$("#hm-topicTri").css("top",app.topic*37+167+"px");											// Triangle
	
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
	
	Draw()																						// DRAW MODULE
	{
		let str="Now editing module "+this.module
		str+=`<br><br><div id="hm-goback" class="hm-bs">Return to modules</div>`
		$("#hm-main").html(str.replace(/\t|\n|\r/g,""));											// Add markupo
		$("#hm-goback").on("click",()=>{ $("#hm-main").fadeOut(()=>{ $("#hm-module").fadeIn(); }) })	// Go back
	}

} // App class closure
