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

class Gate2Sofa{
    constructor(_sofaProbability){
        console.log('We are '+_sofaProbability.toFixed(2)+' confident it is a Sofa');
        this.modelURLSofa = "https://teachablemachine.withgoogle.com/models/eCG1GaW07/";
        this.model;
    }

    predictSofa(){
        this.init_Sofa().then(() => {
            this.predict();
        })
    }

    // metod
    async init_Sofa() {

        console.log("Sofa er initiert!")

        // load the model and metadata
        const modelURL = this.modelURLSofa + "model.json";
        const metadataURL = this.modelURLSofa + "metadata.json";
    
        // load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        this.maxPredictionsSofa = model.getTotalClasses();
    
        
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < this.maxPredictionsSofa; i++) { 
            // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }

        console.log("Sofa er ferdig!")
    }

    async predict() {
        console.log("Starter sofa-prediction...")
        var image = document.getElementById('imagePreview');
    
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(image, false);

        console.log("sofa perdiction:")
        console.log(prediction)

        for (let i = 0; i < this.maxPredictionsSofa; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }
}


async function predict() {
    var image = document.getElementById('imagePreview');

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(image, false);

    // finner størst sannsynlighet:
    let storst_sannsynlight = 0;
    let storst_sannsynlight_label = "";
    

    for (i=0; i<maxPredictions; i++){
        if(prediction[i].probability > storst_sannsynlight){
            storst_sannsynlight = prediction[i].probability;
            storst_sannsynlight_label = prediction[i].className;
        }
    }

    //console.log(storst_sannsynlight_label + " med sikkerhet på " + storst_sannsynlight + "%")
    console.log(prediction)

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    
    if (storst_sannsynlight_label == "Sofa"){
        let sofa = new Gate2Sofa(storst_sannsynlight);
        sofa.predictSofa();
    }
}

