function normalize(val) {
  val = val/255;
  if (val > 0.03928) {
    return ((val+0.055)/1.055) ** 2.4;
  } else {
    return val/12.92;
  }
}

const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};

function calculate() {
  const app = require("photoshop").app;
  var c = app.foregroundColor;
  var R = 0;
  var G = 0;
  var B = 0;
  if (c.hsb.hue == undefined) {
    R = HSBToRGB(c.hsb.hue, s.hsb.saturation, s.hsb.brightness);
  } else {
    R = c.rgb.red.toFixed(2);
    G = c.rgb.green.toFixed(2);
    B = c.rgb.blue.toFixed(2);
  }
  var L = 0.2126 * normalize(R) + 0.7152 * normalize(G) + 0.0722 * normalize(B);
  L = Math.round(L*10000)/100;
  document.getElementById("details").innerHTML = "r: " + Math.round(R) + " g: " + Math.round(G) + " b: " + Math.round(B) + "<br>L: " + L;
}

//const eventHandler = (event, descriptor) => console.log(event, descriptor)
//require("photoshop").action.addNotificationListener(['all'], eventHandler);

const onSet = (_, descriptor) => {
  if(descriptor._target?.[0]._ref === "color" && descriptor._target?.[0]._property === "foregroundColor") {
    calculate()
  }
}

require("photoshop").action.addNotificationListener(['set'], onSet);
calculate();