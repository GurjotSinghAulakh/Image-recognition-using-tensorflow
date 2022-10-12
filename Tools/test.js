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

var workbook = XLSX.utils.book_new();
var msg = [];


/******************************* Super Class *************************************/

class Obj_UnderCategory {

    // "label", "link til modelen"
    constructor(_label, _modelURL, _probability) {
        this.modelURL = _modelURL;

        // Brukes for å lage et array for excel sheet
        this.label = _label;
        this.probability = _probability;
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

        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(image, false);

        // Finding the right perdiction
        let undercategory_highest_probability = 0;
        let undercategory_label = "";

        for (let i = 0; i < this.maxPredictions; i++) {
            labelContainer.childNodes[i].innerHTML = prediction[i].className + ": " + prediction[i].probability.toFixed(2);

            // Adding options to the select box
            var opt = document.createElement('option');
            opt.value = prediction[i].className;
            opt.innerHTML = prediction[i].className;
            select.appendChild(opt);

            // Finding the right perdiction (max-perdiction value)
            if(prediction[i].probability > undercategory_highest_probability){
              undercategory_highest_probability = prediction[i].probability;
                undercategory_label = prediction[i].className;
            }
        }

        // Choosing the right option from the select dropdown
        for (let i = 0; i < select.length; i++) {
            if (select.options[i].value === undercategory_label) {
                select.options[i].selected = "selected";
            }   
        }
      
        // første 
      msg.push([this.label, this.probability, undercategory_label, undercategory_highest_probability])

    }
}

class UnderCategory_Sofa extends Obj_UnderCategory {

    constructor(_label, _modelURL, _probability){
        super(_label, _modelURL, _probability);
        // console.log('We are '+_sofaProbability.toFixed(2)+' confident it is a Sofa');
    }
}

class UnderCategory_Stol extends Obj_UnderCategory {

    constructor(_label, _modelURL, _probability){
        super(_label, _modelURL, _probability);
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

    console.log(label);
    console.log(highest_probability)

    // Choosing the right option from the select dropdown
    for (i = 0; i < select.length; i++) {
        if (select.options[i].value === label) {
            select.options[i].selected = "selected";
        }
    }

    // finding undercategory
    for (let i = 0; i < model_dictionary.length; i++){
        if (label === "Sofa" && label === model_dictionary[i].label){
            let sofa = new UnderCategory_Sofa(model_dictionary[i].label, model_dictionary[i].modelURL, highest_probability); // trenger å add highest prob...
            sofa.predictObj();
            return;
        }

        if (label === "Stol" && label === model_dictionary[i].label){
            let stol = new UnderCategory_Stol(model_dictionary[i].label, model_dictionary[i].modelURL, highest_probability);
            stol.predictObj();
            return;
        }
    }

    msg.push([label, highest_probability, null, null]);
}

async function startTest() {
  for (let i=1; i<10; i++){
    document.getElementById("imagePreview").src = "./test_images/sofa/"+i+".jpg";
    await init().then(() => {
        predict();
    })
    console.warn(i)
  }
  
  // FEIL: vi får 7/9 på excel sheet 
  // problemet: lagres før arrayet er ferdig fylt.
  // må fine ut hvor vi har async await feil.
  // husk: kommenter inn globale linjen 18, som lager en workbook.
  /*
  worksheet = XLSX.utils.aoa_to_sheet(msg);
  workbook.SheetNames.push("First");
  workbook.Sheets["First"] = worksheet;
  
  // (C3) TO BINARY STRING
  var xlsbin = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "binary"
  });
  
  // (C4) TO BLOB OBJECT
  var buffer = new ArrayBuffer(xlsbin.length),
      array = new Uint8Array(buffer);
  for (var i=0; i<xlsbin.length; i++) {
    array[i] = xlsbin.charCodeAt(i) & 0XFF;
  }
  var xlsblob = new Blob([buffer], {type:"application/octet-stream"});
  delete array; delete buffer; delete xlsbin;


  // (C5) "FORCE DOWNLOAD"
  var url = window.URL.createObjectURL(xlsblob),
  anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "demo.xlsx";
  anchor.click();
  window.URL.revokeObjectURL(url);
  delete anchor;

  console.log(msg)
  */
}

function lastNedExcelSheet(){
  worksheet = XLSX.utils.aoa_to_sheet(msg);
  workbook.SheetNames.push("First");
  workbook.Sheets["First"] = worksheet;
  
  // (C3) TO BINARY STRING
  var xlsbin = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "binary"
  });
  
  // (C4) TO BLOB OBJECT
  var buffer = new ArrayBuffer(xlsbin.length),
      array = new Uint8Array(buffer);
  for (var i=0; i<xlsbin.length; i++) {
    array[i] = xlsbin.charCodeAt(i) & 0XFF;
  }
  var xlsblob = new Blob([buffer], {type:"application/octet-stream"});
  delete array; delete buffer; delete xlsbin;


  // (C5) "FORCE DOWNLOAD"
  var url = window.URL.createObjectURL(xlsblob),
  anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "demo.xlsx";
  anchor.click();
  window.URL.revokeObjectURL(url);
  delete anchor;
}