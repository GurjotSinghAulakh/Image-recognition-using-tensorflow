// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

// defining global variable picture & maxPredictions & model;
let maxPredictions, model, labelContainer;

// Model: Secundo sine bilder 
const ai_model_URL = 'https://teachablemachine.withgoogle.com/models/ZL010TeHk/';

async function init() {
    // load the model and metadata
    const modelURL = ai_model_URL + "model.json";
    const metadataURL = ai_model_URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { 
        // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
    console.log("Innit kjører")
}


function loadFile(event) {
    let image_object = document.getElementById("imageUploaded")
    let image_url = URL.createObjectURL(image_object.files[0])

    document.getElementById("imagePreview").src = image_url;
    
    init().then(() => {
        predict();
    })
}

async function predict() {
    var image = document.getElementById('imagePreview');

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(image, false);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

