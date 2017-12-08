Role ={
	OWLServer	: 0,
	OWLBox		: 1,
	OWLUser		: 2,
	OWLSwitchBox: 3
}

MessageType ={
	REGISTRATION	: 1,
	REQUEST			: 2,
	RESPONSE		: 3,
	UPDATE 			: 4,
	CONNECTIVITY 	: 5 
}

Message ={
	FAILED 					: 0,
	SUCCESSFUL				: 1,
	DO_NOT_CARE				: 2,
	REQUEST_NOT_RECOGNIZED 	: 3,
	RESOURCE_NOT_RECOGNIZED : 4,
	RESOURCE_UNREACHABLE	: 5,
	UNREGISTERED_ID			: 6,
	ARE_YOU_ALIVE			: 7,
	YES_IAM_ALIVE			: 8,
	KEEP_ALIVE				: 9,
	KEPT_ALIVE				: 10,
	SCHEDULE_ADD			: 11,
	SCHEDULE_REMOVE			: 12,
	SCHEDULE_RETURN			: 13
}

class Operation{
	TURN_OFF		: 0,
	TURN_ON			: 1,
	TOGGLE_STATE	: 2,
	RETURN_STATE	: 3,
	REGISTER		: 4,
	SPEED_DN		: 5,
	SPEED_UP		: 6,
	//7 - 9 For Future Use	
	SPEED_MIN		: 10,
	SPEED_MIN_1		: 11,
	SPEED_MIN_2		: 12,
	SPEED_MIN_3		: 13,
	SPEED_MIN_4		: 14,
	SPEED_MIN_5		: 15,
	SPEED_MIN_6		: 16,
	SPEED_MIN_7		: 17,
	SPEED_MIN_8		: 18,
	SPEED_MAX		: 19,
	//20 - 29 For Future Use
	RES_NOT_RECOGNIZED 	: 30,
	RES_NOT_REACHABLE  	: 31
}

State ={
	OFF : 0,	
	ON	: 1,
	UK	: 2,	//UnKnown state
	UR	: 3		//UnRecognized resource i.e. UnRegistered
}

ResourceType = {
    ceilingFan		:	1, //{value: 1, name: "ceilingFan", imageName: "ceilingFan"}, 
	bracketFan		:	2,
	pedestalFan		:	3,
	exhaustFan		:	4,
	tubeLight		:	5,
	bulb			:	6,
	energySaverBulb	:	7,
	ledBulb			:	8,
	chandelier		:	9,
	teleVision		:	10,
	plasmaTV		:	11,
	ledTV			:	12,
	airConditioner	:	13,
	microwaveOven	:	14,
	oven			:	15,
	refrigerator	:	16,
	freezer			:	17,
	dispenser		:	18,
	waterPump		:	19,
	motor			:	20,
	socket			:	21,
	geyser			:	22,
	thermometer		:	23,
	remote_control	:	24,
	video_camera	:	25		 
}

OwlMessage ={
	role,			
	msgType;		
	instIdOrSocStrg,	//OWLBoxID to contact
	message,
	resourceID,
	operation,
	day,
	month,
	year,
	hr,
	min,
	sec,
	repeatPattern,
	forNdays,		//Including the 1st day, 0Means Continue Indefinitely
	schedule
}

parseOwlMessage(receivedMsg){ // receivedMsg is an string
	alert(receivedMsg);
	recs = receivedMsg.split("::");	// RECordS
	reqs = recs[0].split(":");			// REQuestS
	//OwlMessage owlMsg = new OwlMessage();
	owlMsg = new Object();
	owlMsg.role = parseInt(reqs[0]);
	owlMsg.msgType = parseInt(reqs[1]);
	owlMsg.instIdOrSocStrg = reqs[2];
	owlMsg.message = parseInt(reqs[3]);
	
	if(owlMsg.message==Message.SCHEDULE_RETURN){
		var Schedule = [];
		if(reqs.length>6){ // reqs[4] means no schedule for the resource
			Schedule[0] = reqs[4]+":"+reqs[5]+":"+reqs[6]+":"+reqs[7]+":"+
							reqs[8]+":"+reqs[9]+":"+reqs[10]+":"+reqs[11]+":"+
							reqs[12]+":"+reqs[13];
		} else{
			Schedule[0] = reqs[4]+":"+reqs[5]+":"+"0"+":"+"0"+":"+"0"+":"+"0"+":"+
												"0"+":"+"0"+":"+"0"+":"+"0";
		}
		
		for(int i=1; i<recs.length; i++){
			var reqs1 = recs[i].split(":");
			if(reqs1.length>2)
				Schedule[i] = recs[i];
			else{
				Schedule[i] = reqs1[0]+":"+reqs1[1]+":"+"0"+":"+"0"+":"+"0"+":"+"0"+":"+
						"0"+":"+"0"+":"+"0"+":"+"0";
			}
		}
		owlMsg.schedule = Schedule;
		
		return owlMsg;
	} // else move forward and parse other types of messages
	int addParms = 0;	//Additional Parameters
	if( owlMsg.message==Message.SCHEDULE_ADD || 
			owlMsg.message==Message.SCHEDULE_REMOVE ){
		owlMsg.day = parseInt(reqs[4]);
		owlMsg.month = parseInt(reqs[5]);
		owlMsg.year = parseInt(reqs[6]);
		owlMsg.hr = parseInt(reqs[7]);
		owlMsg.min = parseInt(reqs[8]);
		owlMsg.sec = parseInt(reqs[9]);
		owlMsg.repeatPattern = reqs[10];
		owlMsg.forNdays = parseInt(reqs[11]);
		
		addParms = 8;
	}
	
	int j=0;
	owlMsg.resourceID = [];	//new int[(reqs.length-4-addParms)/2];
	owlMsg.operation = [];//new int[(reqs.length-4-addParms)/2];
	for (int i=4+addParms; i<reqs.length; i=i+2) {
			owlMsg.resourceID[j] = parseInt(reqs[i]);
			owlMsg.operation[j] = parseInt(reqs[i+1]);
			j++;
	}

	return owlMsg;	//owlMsg is an object
}

// creates a string for transmission, don't forget to append "\n" when sending data over TCP
// myOWLmsg is an object
constructOwlMessage(myOWLmsg){ 
	response = myOWLmsg.role + ":" +
				myOWLmsg.msgType + ":" +
				myOWLmsg.instIdOrSocStrg + ":" +
				myOWLmsg.message;
	
	if(myOWLmsg.message == Message.SCHEDULE_ADD || myOWLmsg.message == Message.SCHEDULE_REMOVE ){
		response = response + 	":" + myOWLmsg.day + 
								":" + myOWLmsg.month +
								":" + myOWLmsg.year +
								":" + myOWLmsg.hr +
								":" + myOWLmsg.min +
								":" + myOWLmsg.sec +
								":" + myOWLmsg.repeatPattern +
								":" + myOWLmsg.forNdays;							
	}
	
	if(myOWLmsg.resourceID.length!=0){
	for(int i=0; i<myOWLmsg.resourceID.length; i++)
		response = response + ":" + myOWLmsg.resourceID[i] + ":" + myOWLmsg.operation[i];
	}

	return response;
}