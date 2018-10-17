export function getGradientByDate(date){
	let dayOfYear = date._d.getDate() + (date._d.getMonth() * 30);
	
	const summer1 = [252, 197, 45];
	const summer2 =	[100, 201, 252];
	const fall1 = [249, 192, 19];
	const fall2 = [244, 83, 96];
	const spring1 = [0, 250, 154]; //mediumspringgreen
	const spring2 = [0, 128, 128]; //teal
	const winter1 = [208, 244, 239];
	const winter2 = [116, 197, 252];

	let color1 = interpolate3i(summer1, fall1, 0.9);
	let color2 = interpolate3i(summer2, fall2, 0.9);

	return `linear-gradient(to top left, rgb(${color2[0]},${color2[1]},${color2[2]}), rgb(${color1[0]},${color1[1]},${color1[2]}))`;
}

function interpolate3i(a, b, amount){
	let c = [0,0,0];
	c = c.map((val, i) => {
		val = (b[i] - a[i]) * amount;
		val < 0 ? val += b[i] : val -= a[i];
		return val;
	});
	return c;
}