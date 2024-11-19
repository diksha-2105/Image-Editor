const fileInput = document.querySelector("#imageFileInput");
const canvas = document.querySelector("#canvas");
const canvasCtx = canvas.getContext("2d");
const brightnessInput = document.querySelector("#brightness");
const saturationInput = document.querySelector("#saturation");
const blurInput = document.querySelector("#blur");
const inversionInput = document.querySelector("#inversion");

let originalImage = null; // To store the original image
let currentImage = null; 

const settings = {};
let image = null;

function resetSettings() {
  settings.brightness = "100";
  settings.saturation = "100";
  settings.blur = "0";
  settings.inversion = "0";
   
  brightnessInput.value = settings.brightness;
  saturationInput.value = settings.saturation;
  blurInput.value = settings.blur;
  inversionInput.value = settings.inversion;


updateSetting();
}

function updateSetting(key, value) {
  if (!image) return;

  settings[key] = value;
  renderImage();
}

function generateFilter() {
  const { brightness, saturation, blur, inversion } = settings;

  return `brightness(${brightness}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%)`;
}

function renderImage() {
  canvas.width = image.width;
  canvas.height = image.height;

  canvasCtx.filter = generateFilter();
  canvasCtx.drawImage(image, 0, 0);
}

brightnessInput.addEventListener("change", () =>
  updateSetting("brightness", brightnessInput.value)
);
saturationInput.addEventListener("change", () =>
  updateSetting("saturation", saturationInput.value)
);
blurInput.addEventListener("change", () =>
  updateSetting("blur", blurInput.value)
);
inversionInput.addEventListener("change", () =>
  updateSetting("inversion", inversionInput.value)
);

fileInput.addEventListener("change", () => {
  image = new Image();

  image.addEventListener("load", () => {
    resetSettings();
    renderImage();
  });

  image.src = URL.createObjectURL(fileInput.files[0]);

});

function saveAndClear() {
  if (!image) {
    alert("No image to save!");
    return;
  }

  // Prompt the user for a filename
  const filename = prompt("Enter a name for your image file:", "edited-image");

  if (!filename) {
    alert("Save canceled. No name provided.");
    return; // Exit if no name is provided
  }

  // Create a link element to download the canvas content as an image
  const link = document.createElement("a");
  link.download = `${filename}.png`; // Use the user-provided name
  link.href = canvas.toDataURL("image/png"); // Convert canvas to a data URL
  link.click(); // Trigger the download

  // Clear the canvas and reset settings
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas content
  image = null; // Reset the image reference
  fileInput.value = ""; // Clear file input for new upload
  resetSettings(); // Reset filters and sliders
}

resetSettings();