function createFilter(){
	d3.queue()
		.defer(d3.json, "term6.json")
		.await(ready);

	function ready(error, dataTerm6){
		console.log("Merge data: all votes in legco term 6 so far (up tp March 22th 2018)");
		console.log(dataTerm6);

		processFilterData(dataTerm6);
	}
}
function processFilterData(data){
	var meetingDates = [];
	var choiceOfMotion;
	data["legcohk-vote"]['meeting'].forEach(function(d){
		meetingDates.push(d['_start-date']);
	})
	console.log(meetingDates);

	d3.select("#meetingDates").selectAll("option")
		.data(meetingDates)
		.enter().append("option").attr("value", function(d, i){
			//get the index of meeting
			return i;
		})
		.html(function(d){return d;})

	var choiceOfMeetingDate; //is the int of index of meeting
	d3.select("#meetingDates").on("change", function(){
		//remove motions select
		d3.select("#motions").selectAll("option").remove();
		choiceOfMeetingDate = d3.select(this).property('value');
		var votes = data["legcohk-vote"]['meeting'][choiceOfMeetingDate]['vote']
		
		var motionNameChi = [];
		votes.forEach(function(d){motionNameChi.push(d["motion-ch"]);})
		d3.select("#motions").selectAll("option")
			.data(motionNameChi).enter()
			.append("option").attr("value", function(d, i){
				return i; //index of vote on that meeting
			})
			.html(function(d){return d;});

		var choiceOfMotion_index;

		function printInfo(choiceOfMotion){
			//console.log(choiceOfMotion);

			d3.select(".motionInfo").select(".motion-ch").html("Motion Name (Chinese): " + choiceOfMotion["motion-ch"]);
			d3.select(".motionInfo").select(".motion-en").html("Motion Name (English): " + choiceOfMotion["motion-en"]);
			d3.select(".motionInfo").select(".vote-date").html("Date-Time of Vote: " + choiceOfMotion["vote-date"] + " - " + choiceOfMotion["vote-time"] );
			d3.select(".motionInfo").select(".vote-result").html("Result: "+choiceOfMotion["vote-summary"]["overall"]["result"]);
			d3.select(".motionInfo").select(".mover").html("Motion mover: " + choiceOfMotion["mover-en"] + ", " + choiceOfMotion["mover-ch"]);
			var sepFlag = choiceOfMotion["vote-separate-mechanism"];
			d3.select(".motionInfo").select(".voteSepMech").html("Vote Seperate Mechanism: " + sepFlag);
			var temp1 = choiceOfMotion["vote-summary"]["geographical-constituency"];
			var temp2 = choiceOfMotion["vote-summary"]["functional-constituency"];
			if (sepFlag === "Yes"){
				d3.select(".motionInfo").select(".geo-con").html("Geographical Constituency Vote: " + "Obstain: "+ temp1["abstain-count"] + " | Vote Count: " + temp1["vote-count"] + 
															" | Yes: " + temp1["yes-count"] + " | No: " + temp1["no-count"] + " | Vote Count: " +temp1["vote-count"]+ " | Present Count: " + temp1["present-count"])
															.style("visibility", "visible");
				d3.select(".motionInfo").select(".func-con").html("Functional Constituency Vote: " + "Obstain: "+ temp2["abstain-count"] + " | Vote Count: " + temp2["vote-count"] + 
															" | Yes: " + temp2["yes-count"] + " | No: " + temp2["no-count"] + " | Vote Count: " +temp2["vote-count"]+ " | Present Count: " + temp2["present-count"])
															.style("visibility", "visible");
				d3.select(".motionInfo").select(".all-con").html("");
			} else{
				var temp = choiceOfMotion["vote-summary"]["overall"];
				d3.select(".motionInfo").select(".all-con").html("Vote: " + "Obstain: "+ temp["abstain-count"] + " | Vote Count: " + temp["vote-count"] + 
															" | Yes: " + temp["yes-count"] + " | No: " + temp["no-count"] + " | Vote Count: " +temp["vote-count"]+ " | Present Count: " + temp["present-count"])
															.style("visibility", "visible");
				d3.select(".motionInfo").select(".geo-con").html("");
				d3.select(".motionInfo").select(".func-con").html("");
			}
		}

		function printAbsentMember(choiceOfMotion){
			console.log(choiceOfMotion);
			var members =choiceOfMotion["individual-votes"]["member"];
			var absents = [];
			members.forEach(function(d){
				if (d["vote"][0] === "Absent"){
					absents.push(d);
				}
			});
			console.log("Absent members"+absents);
			var tempString = "";
			absents.forEach(function(d){
				tempString += d["_name-en"] + ", " + d["_name-ch"] + "&#9;";
			})
			d3.select(".motionInfo").select(".absentMember").html("Absent Member: " + tempString)
															.style("visibility", "visible");
		}
		//if there only one vote on the chosen date
		if (data["legcohk-vote"]['meeting'][choiceOfMeetingDate]['vote'].length === 1) {
			choiceOfMotion = data["legcohk-vote"]['meeting'][choiceOfMeetingDate]['vote'][0];
			printInfo(choiceOfMotion);
			printAbsentMember(choiceOfMotion);
		}
		//else select motion
		d3.select("#motions").on("change", function(){
			choiceOfMotion_index = d3.select(this).property('value');
			choiceOfMotion = data["legcohk-vote"]['meeting'][choiceOfMeetingDate]['vote'][choiceOfMotion_index];
			printInfo(choiceOfMotion);
			printAbsentMember(choiceOfMotion);
		});


	});	
}