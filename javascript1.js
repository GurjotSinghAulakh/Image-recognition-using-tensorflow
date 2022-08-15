// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

let modelURL = 'https://teachablemachine.withgoogle.com/models/vih153yuj/';

function preload() {
    classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function uploadImage(){
  let image_object = document.getElementById("imageUploaded")
  let image = URL.createObjectURL(image_object.files[0])
  img = image;
  document.getElementById("bildeKontainer").innerHTML = '<img src="'+img+'" class="product_img" />';

  classifyVideo();
}


function setup() {
  createCanvas(300, 300);  
}

function classifyVideo(){
  img = loadImage(img);
  classifier.predict(img, gotResult);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  } else {
    // The results are in an array ordered by confidence.
    console.log(results);
    document.getElementById("classified_item").innerHTML = "Category:  " + results[0].label + "\n";
    document.getElementById("classified_confidence").innerHTML = "Confidence: " + nf(results[0].confidence, 0, 2);
  }
}
