///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// KEYTERMS CLASS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Keyterms  {																					

	constructor()   																			// CONSTRUCTOR
	{
	}

	Show(term)
	{
		let h=$("#hm-overlay").height();															// Get container height
		$("#hm-terms").remove();																	// Kill old one
		vid.RunPlayer("pause");																		// Pause video
		$("#hm-play").prop("src","img/playbut.png");												// Play icon button
		let str=`<div id="hm-terms" class="hm-terms">
			<img src="img/closebut.png" onclick="$('#hm-terms').remove()" title="Close / Cerrar"style="width:16px;float:right;margin:-16px 32px;cursor:pointer">
			<img src="assets/terms/${"place value"}.png" style="width:40%;position:absolute;right:80px;top:40px">
			<div style="width:calc(50% - 72px">
			<b style="color:#185b9d;font-size:1.4vw">ENGLISH -</b> &nbsp; <b style="color:#000;font-size:1.4vw;margin-bottom:8px">${"Place value"}</b>
			<div style="height:${h*.26}px;overflow-y:auto">Determines the value of a digit in a number, based on the location of the digit.
			</div>
			<b style="color:#185b9d;font-size:1.5vw">SPANISH -</b> &nbsp; <b style="color:#000;font-size:1.4vw">valor posicional</b>
			<br><br>
			<div style="height:${h*.26}px;overflow-y:auto">Determina el valor en un numero, de acuerda a la ubicacion de dichao digito.
			</div>
		</div>`;
			
		$("#hm-video").append(str.replace(/\t|\n|\r/g,""));											// Add markup
	}

} // App class closure
