/*
this file is for testing out new ideas

var fs = require("fs")
var path = require("path")

function outputAllImages(startPath, filters){
  console.log("Funksjonen kjører")
  //const results = fs.readFileSync

  if(!fs.existsSync(startPath)) return console.log("no dir ", startPath)

  const files = fs.readdirSync(startPath)
  files.forEach(file => {
    const filename = path.join(startPath, file);
    const stat = fs.lstatSync(filename); // check what type of file the file is.
    
    //if (stat.isDirectory()) outputAllImages(filename, filter) //Recursive (go to each file)

    //if the file ends with filters (.jpg/.jpeg/.png)
    filters.forEach(filter => {
      if(filename.endsWith(filter)) console.log("--found: ", filename)
    })
  })
}


  console.log("hallo verden")

  const imageFolderPath = [path.resolve(__dirname, "bilder")] 
  const imagesFormats = [".jpg", ".jepg", ".png"]

  outputAllImages(imageFolderPath, imagesFormats)
  */

let img;

function start(){
  for (let i = 1; i<3; i++){
    img = "./bilder/sofa/1.jpg"
    classifyObj()
  }
}



// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;
let classifierStol;

// Checks wgich appliance is being classified and returns the correct object
let modelURLHvitevarer = "https://teachablemachine.withgoogle.com/models/ZL010TeHk/";
//let modelURLStol = 'https://teachablemachine.withgoogle.com/models/ezH802a7a/';


/**
 * It loads the model from the URL we specified earlier
 */
function preload() {
    classifier = ml5.imageClassifier(modelURLHvitevarer + 'model.json');
    //classifierStol = ml5.imageClassifier(modelURLStol + 'model.json');
}


/**
 * The setup() function is called once when the program starts. It's used to define initial environment
 * properties such as screen size and background color and to load media such as images and fonts as
 * the program starts. There can only be one setup() function for each program and it shouldn't be
 * called again after its initial execution
 */

function setup() {
  createCanvas(300, 300);  
}


/**
 * It loads the image, then runs the classifier on it, and then runs the gotResult function
 */

function classifyObj(){
  img = loadImage(img);
  classifier.predict(img, gotResult);
}


function gotResult(error, results) {
  const label = results[0].label;
  const confidence = nf(results[0].confidence, 0, 2);

  // Display error in the console, and return
  if (error) {
    console.error(error);
    alert(error);
    return
  }


  document.getElementById("classified_item").innerHTML = "Category:  " + (label) + "\n";
  document.getElementById("classified_confidence").innerHTML = "Confidence: " + nf(confidence, 0, 2);
  
  // Stol
  if (label == "Sofa"){
    let stol_underC = classifierStol.predict(img)


    stol_underC.then(function(results){

      if (results[0].confidence < 0.8){
        document.getElementById("usikker").append(img,results[0].confidence,results[0].label)
        alert("Vi gjenkjente ikke hvilken stol du har valgt, prøv igjen.") 
      }
      else {
        document.getElementById("sikker").append(img,results[0].confidence,results[0].label)
      }
    });
  }

}

