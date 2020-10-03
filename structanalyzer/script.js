let data = [];

function analyze() {
	resetDisplay();

	let timer = new Date().getTime();
	let start = timer;

	let file = document.getElementById("filein").files[0];
	let fr = new FileReader();
	fr.readAsArrayBuffer(file);
	fr.onload = function(e) {
		data = Array.from(new Int8Array(e.target.result));
		//console.log("prepared file in " + (new Date().getTime() - timer) + "ms");
		timer = new Date().getTime();

		if (document.getElementById("showhexdump").checked) {
			document.getElementById("data").style.display = "block";
			hexDump(data);
			//console.log("showed hex dump in  " + (new Date().getTime() - timer) + "ms");
			timer = new Date().getTime();
		}

		let size = getSize();
		//console.log("found size in " + (new Date().getTime() - timer) + "ms");
		timer = new Date().getTime();

		let palette = getPalette();
		//console.log("found palette in " + (new Date().getTime() - timer) + "ms");
		timer = new Date().getTime();

		let blockCount = getBlockCount(palette.length, size[0]*size[1]*size[2]);
		//console.log("found block count in " + (new Date().getTime() - timer) + "ms");
		timer = new Date().getTime();

		let repeated = []

		for (i = 0; i < palette.length; i++)
			for (j = i+1; j < palette.length; j++)
				if (palette[i] == palette[j] && !repeated.includes(i)) {
					//console.log(i + " " + palette[i] + " " + palette[j] + " " + blockCount[i] + " " + blockCount[j]);
					blockCount[i] += blockCount[j];
					repeated.push(j);
				}

		palette = [...new Set(palette)];

		let newBlockCount = []
		for (i = 0; i < blockCount.length; i++) if (!repeated.includes(i)) newBlockCount.push(blockCount[i]);
		//console.log("fixed block count in " + (new Date().getTime() - timer) + "ms");
		timer = new Date().getTime();

		document.getElementById("properties").style.display = "block";

		document.getElementById("sizeHolder").innerHTML = size[0] + "x" + size[1] + "x" + size[2] + "<br>";

		for (let i = 0; i < palette.length; i++) document.getElementById("blocksHolder").innerHTML += "<li>" + newBlockCount[i] + " x " + palette[i] + "</li>";

		//console.log("All done in " + (new Date().getTime() - start) + "ms");
	}
}

function getSize() {
	let size = [0, 0, 0];
	let ptr = null;

	let target = "size";
	for (let i = 0; i < data.length; i++) {
		let score = 0;
		for (let j = 0; j < target.length; j++) {
			if (data[i+j] == target.charCodeAt(j)) score++;
		}
		if (score == target.length) {
			ptr = i;
			break;
		}
	}
	if (ptr == null) {
		console.log("error, couldn't find size!");
		return;
	}

	for (let i = 0; i < 4; i++) {
		size[0] += data[ptr+9+i]*Math.pow(16,3-i);
		size[1] += data[ptr+13+i]*Math.pow(16,3-i);
		size[2] += data[ptr+17+i]*Math.pow(16,3-i);
	}
	return size;
}

function getPalette() {
	let palette = [];
	let len = null;

	let ptr = null;

	let target = "palette";
	for (let i = 0; i < data.length; i++) {
		let score = 0;
		for (let j = 0; j < target.length; j++)
			if (data[i+j] == target.charCodeAt(j)) score++;

		if (score == target.length) {
			ptr = i;
			break;
		}
	}
	if (ptr == null) {
		console.log("error, couldn't find palette!");
		return;
	}

	for (let i = 0; i < 4; i++) len += data[ptr+8+i]*Math.pow(16,3-i);

	for (let n = 0; n < len; n++) {
		for (let i = ptr; i < data.length; i++) {
			if (data[i] == "N".charCodeAt(0)) {
				ptr = i;
				break;
			}
		}

		ptr += 4;
		nameLength = data[ptr]*16+data[ptr+1];
		palette.push("");
		for (let j = 0; j < nameLength; j++) palette[n] += String.fromCharCode(data[ptr+2+j]);
	}

	return palette;
}

function getBlockCount(states, blocks) {
	let blockCount = [];
	for (i = 0; i < states; i++) blockCount.push(0);

	let ptr = 83;
	for (n = 0; n < blocks; n++) {
		let target = "state";
		for (let i = ptr; i < data.length; i++) {
			let score = 0;
			for (let j = 0; j < target.length; j++)
				if (data[i+j] == target.charCodeAt(j)) score++;

			if (score == target.length) {
				ptr = i;
				break;
			}
		}

		let state = 0;
		for (let i = 0; i < 4; i++) state += data[ptr+5+i]*Math.pow(16,3-i);
		blockCount[state]++;

		ptr += 8;
	}

	return blockCount;
}

function hex(n, d, prefix=true) {
	let padding = "";
	for (let i = 0; i < d; i++) padding += "0";
	return (prefix ? "0x" : "") + (padding + n.toString(16)).substr(-d);
}

function hexDump(data) {
	for (let i = 0; i < data.length%12; i++) data.push(0);

	for (let i = 0; i < data.length / 12; i++) {
		let line = hex(i*12,4) + ": ";

		for (let j = 0; j < 12; j++) line += hex(data[i*12+j],2,false) + " ";

		line += "| ";

		for (let j = 0; j < 12; j++) {
			let c = data[i*12+j];
			if ((c >= 97 && c <= 122) || (c >= 48 && c <= 57) || (c >= 65 && c <= 90))
				line += String.fromCharCode(c);
			else
				line += ".";
		}

		line += "<br>";
		document.getElementById("dataHolder").innerHTML += line;
	}
}

function resetDisplay() {
	document.getElementById("dataHolder").innerHTML = "";
	document.getElementById("sizeHolder").innerHTML = "";
	document.getElementById("blocksHolder").innerHTML = "";
}
