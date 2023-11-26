import React from "react";
import ReactTimeAgo from "react-time-ago";


export default function LastSeen({ date }: { date: Date }) {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const seconds = date.getUTCSeconds();
	const milliseconds = date.getUTCMilliseconds();
	const utcDate = new Date(year, month, day, hours, minutes, seconds, milliseconds);
	return <ReactTimeAgo date={utcDate} locale="en-US"  className="text-xs"/>;
}
