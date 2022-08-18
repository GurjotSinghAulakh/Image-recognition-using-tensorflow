// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;


let modelURL = 'https://teachablemachine.withgoogle.com/models/Em3j0Intk/';

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
  // Display error in the console, and return
  if (error) {
    console.error(error);
    alert(error);
    return
  }

  console.log(results);
  const label = results[0].label;
  const confidence = nf(results[0].confidence, 0, 2);

  if (confidence < 0.8){
    alert("Vi gjenkjente ikke objektet, prøv igjen.")
    console.log(label, confidence)
    return;
  }

  if (label == "stol"){
    let obj_stol = classifyStol(img);
    // trenger å jobbe litt mer med å catche og ta imot problemer her!
    try{
      document.getElementById("classified_item").innerHTML = "Category:  " + obj_stol.c + "\n";
      document.getElementById("classified_confidence").innerHTML = "Confidence: " + nf(results[0].confidence, 0, 2);
    }catch(error){
      alert("Det skjedde noe feil")
    }

}



  
}


//-----------------------------------finding the under-category----------------------------------

