// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

// defining global variable picture & maxPredictions & model;
let picture;
let maxPredictions;
let model;


// Model: Secundo sine bilder 
const ai_model_URL = 'https://teachablemachine.withgoogle.com/models/ZL010TeHk/';

async function init() {
    // load the model and metadata
    const modelURL = ai_model_URL + "model.json";
    const metadataURL = ai_model_URL + "metadata.json";


    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)

    model = await tmImage.load(modelURL, metadataURL);
    // The same as gotResualts? 
    maxPredictions = model.getTotalClasses();

    console.log("Innit kjører")
    uploadImage();
}

function uploadImage(){
    // Getting the image from the HTML    
    let image_object = document.getElementById("imageUploaded")
    let image = URL.createObjectURL(image_object.files[0])
    var img = new Image();
    img.src = image;
    
    // createing a tmImage file (It has more data than normal image)
    picture = new tmImage.load(img);

    console.log(img)

    // append elements to the DOM
    document.getElementById("bildeKontainer").append = img;


    labelContainer = document.getElementById("label-container");
    
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    loop();

}

async function loop() {
    await predict();
}

async function predict() {

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(picture);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

