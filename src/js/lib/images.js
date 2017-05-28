let Images = {};

Images.resizeUploaded = (imageCode, wWidth) => {
	let canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		img = new Image(),
		targetImageWidth = wWidth * 0.475;

	return new Promise((resolve, reject) => {
		img.src = imageCode;
		img.onload = () => {

			// If the image doesn't need to be resized (has less width than targeted)
			// return the imageCode
			if (img.width < targetImageWidth) {
				resolve(imageCode);
			} else {

				// Set image size basing on target width
				canvas.width = targetImageWidth;
				canvas.height = canvas.width * (img.height / img.width);

				// Draw source image into the off-screen canvas
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// Send a base64 coded new image
				resolve(canvas.toDataURL());
			}
		};
	});
};

Images.splitToParts = (resizedImgCode, tilesX, tilesY) => {
	let canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		img = new Image(),
		imgParts = [],
		singleWidth = 0,
		singleHeight = 0;

	return new Promise((resolve, reject) => {

		// Prepare image to split into parts
		img.src = resizedImgCode;
		img.onload = () => {

			// Convert image (base64) to parts (single puzzles), using canvas
			singleWidth = img.width / tilesX;
			singleHeight = img.height / tilesY;

			for (let y = 0; y < tilesY; y++) {
				for (let x = 0; x < tilesX; x++) {
					
					canvas.width = singleWidth;
					canvas.height = singleHeight;
					
					// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
					// sx, sy = calculate dynamically (source image)
					// dx, dy = 0 (we don't want to move the clipped image on new canvas)
					ctx.drawImage(img, x * singleWidth, y * singleHeight, singleWidth, singleHeight, 0, 0, singleWidth, singleHeight);

					// Store every image part in the array
					imgParts.push(canvas.toDataURL());
				}
			}

			let data = {
				list: imgParts,
				singleWidth: singleWidth,
				singleHeight: singleHeight
			};

			resolve(data);
		};
	});
};

export default Images;