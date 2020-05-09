var vertices = [];
var triangles = [];

function loadModel(file) {
	readFile(file).then(function(result) {
		let lines = result.split("\n");
		for (let i = 0; i < lines.length; i++) {
			let params = lines[i].split(" ");

			switch (params[0]) {
				case "v":
					let x = parseFloat(params[1]);
					let y = parseFloat(params[2]);
					let z = parseFloat(params[3]);

					vertices.push(new vector3(x,y,z));
					break;
				case "f":
					let triangle = [0,0,0];
					triangle[0] = parseInt(params[1])-1;
					triangle[1] = parseInt(params[2])-1;
					triangle[2] = parseInt(params[3])-1;

					triangles.push(triangle);
			}
		}
	});
}
