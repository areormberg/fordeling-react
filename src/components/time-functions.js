export function minsToTime(mins){
	if (mins<0){
		mins += (60*24);
	}
	return leadingZero((Math.floor(mins/60))) + ":" + leadingZero(mins%60);
}

function leadingZero(n){
		return ("0" + n).slice (-2); 
}


export function scheduleConflict(event1, event2){
	return(
		(event1.start > event2.start &&
		event1.start < event2.end) ||
		(event1.end >= event2.start &&
		event1.end < event2.end)
	);
}