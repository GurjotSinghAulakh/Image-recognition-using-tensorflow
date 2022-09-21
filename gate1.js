// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

let model_dictionary = [
    {
        "label": "Sofa",
        "modelURL": "https://teachablemachine.withgoogle.com/models/eCG1GaW07/"
    },
    {
        "label": "Stol",
        "modelURL": "https://teachablemachine.withgoogle.com/models/GGrDbyj_b/"
    }
]

// global classification results, we will use this to check if what AI guessed was right, based on human input.
let classified_category_label;
let classified_category_highest_probability;
let classified_underCategory_label;
let classified_underCategory_highest_probability;

/******************************* Super Class *************************************/

class Obj_UnderCategory {

    // "label", "link til modelen"
    constructor(_label, _modelURL) {
        this.modelURL = _modelURL;

        // Må fjernes etter testinga er ferdig
        this.label = _label;
        this.model;
    }

    predictObj(){
        this.init().then(() => {
            this.predict();
        })
    }

    // method
    async init() {

        console.log(this.label + " er initiert!")

        // load the model and metadata
        const modelURL = this.modelURL + "model.json";
        const metadataURL = this.modelURL + "metadata.json";

        // load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        this.maxPredictions = model.getTotalClasses();


        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "";
        for (let i = 0; i < this.maxPredictions; i++) {
            // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }

        console.log(this.label + " er ferdig!")
    }

    async predict() {

        var image = document.getElementById('imagePreview');
        var select = document.getElementById("select_under_category");

        // emptying the select box
        select.innerHTML = "";

        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(image, false);

        // Finding the right perdiction
        let highest_probability = 0;
        let label = "";

        for (let i = 0; i < this.maxPredictions; i++) {
            labelContainer.childNodes[i].innerHTML = prediction[i].className + ": " + prediction[i].probability.toFixed(2);

            // Adding options to the select box
            var opt = document.createElement('option');
            opt.value = prediction[i].className;
            opt.innerHTML = prediction[i].className;
            select.appendChild(opt);

            // Finding the right perdiction (max-perdiction value)
            if(prediction[i].probability > highest_probability){
                highest_probability = prediction[i].probability;
                label = prediction[i].className;
            }
        }

        // Choosing the right option from the select dropdown
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].value === label) {
                select.options[i].selected = "selected";
            }
        }

        // asserting/editing global variables
        classified_underCategory_highest_probability = highest_probability;
        classified_underCategory_label = label;
    }
}

class UnderCategory_Sofa extends Obj_UnderCategory {

    constructor(_label, _modelURL){
        super(_label, _modelURL);
        // console.log('We are '+_sofaProbability.toFixed(2)+' confident it is a Sofa');
    }
}

class UnderCategory_Stol extends Obj_UnderCategory {

    constructor(_label, _modelURL){
        super(_label, _modelURL);
        // console.log('We are '+_sofaProbability.toFixed(2)+' confident it is a Sofa');
    }
}

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
    var select = document.getElementById("select_category");

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(image, false);

    // Finding the right perdiction
    let highest_probability = 0;
    let label = "";


    for (let i = 0; i < maxPredictions; i++) {
        // creating div elements for perdiction_classnames
        labelContainer.childNodes[i].innerHTML = prediction[i].className + ": " + prediction[i].probability.toFixed(2);

        // Adding options to the select box
        var opt = document.createElement('option');
        opt.value = prediction[i].className;
        opt.innerHTML = prediction[i].className;
        select.appendChild(opt);

        // Finding the right perdiction (max-perdiction value)
        if(prediction[i].probability > highest_probability){
            highest_probability = prediction[i].probability;
            label = prediction[i].className;
        }
    }

    // Choosing the right option from the select dropdown
    for (i = 0; i < select.length; i++) {
        if (select.options[i].value === label) {
            select.options[i].selected = "selected";
        }
    }

    // asserting/editing global variables
    classified_category_highest_probability = highest_probability;
    classified_category_label = label;

    // finding undercategory
    for (let i = 0; i < model_dictionary.length; i++){
        if (label === "Sofa" && label === model_dictionary[i].label){
            let sofa = new UnderCategory_Sofa(model_dictionary[i].label, model_dictionary[i].modelURL);
            sofa.predictObj();
        }

        if (label === "Stol" && label === model_dictionary[i].label){
            let stol = new UnderCategory_Stol(model_dictionary[i].label, model_dictionary[i].modelURL);
            stol.predictObj();
        }
    }
}

function changed_select(option) {
    var label = option;

     // finding undercategory
    for (let i = 0; i < model_dictionary.length; i++){
        if (label === "Sofa" && label === model_dictionary[i].label){
            let sofa = new UnderCategory_Sofa(model_dictionary[i].label, model_dictionary[i].modelURL);
            sofa.predictObj();
        }

        if (label === "Stol" && label === model_dictionary[i].label){
            let stol = new UnderCategory_Stol(model_dictionary[i].label, model_dictionary[i].modelURL);
            stol.predictObj();
        }
    }

}