// Dependencies
var Planet			= require("./Planet.js");
var Renderer		= require("./Renderer.js");

var renderer		= new Renderer();

self.onmessage = function(event) {
	
	switch (event.data.type) {
		
		case "setPlanet":
			renderer.setPlanet(new Planet(event.data.planet.seed, event.data.planet.detail));
			break;
			
		case "setWindow":
			renderer.setWindow(event.data.window);
			break;
			
		case "setViewport":
			renderer.setViewport(event.data.viewport);
			break;
			
		case "render":
			renderer.render(event.data.angle, new Uint8ClampedArray(event.data.buffer));
			self.postMessage({
				type: "render",
				buffer: event.data.buffer
			}, [event.data.buffer]);
			break;
			
		default:
			self.postMessage({
				type: "error",
				message: "Unknown message type"
			});
			break;
			
	}
};
