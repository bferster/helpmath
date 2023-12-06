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
	}

	LogIn(name, password)																		// LOG IN
	{
	}

	Draw()																						// DRAW MODULE
	{
		let str="Now editing module "+this.module
		str+=`<br><br><div id="hm-goback" class="hm-bs">Return to modules</div>`
		$("#hm-main").html(str.replace(/\t|\n|\r/g,""));											// Add cards
		$("#hm-goback").on("click",()=>{ $("#hm-main").fadeOut(()=>{ $("#hm-module").fadeIn(); }) })	// Go back
	}

} // App class closure
