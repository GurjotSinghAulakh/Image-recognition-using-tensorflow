// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;
let classifierStol;

// A variable to hold the image we want to classify
let img;

// Checks wgich appliance is being classified and returns the correct object
let modelURLHvitevarer = 'https://teachablemachine.withgoogle.com/models/vnHMtHbDj/';
let modelURLStol = 'https://teachablemachine.withgoogle.com/models/ezH802a7a/';


/**
 * It loads the model from the URL we specified earlier
 */
function preload() {
    classifier = ml5.imageClassifier(modelURLHvitevarer + 'model.json');
    classifierStol = ml5.imageClassifier(modelURLStol + 'model.json');
}

// 
/**
 * It takes the image uploaded by the user, and puts it into the img variable
 */
function uploadImage(){
  let image_object = document.getElementById("imageUploaded")
  let image = URL.createObjectURL(image_object.files[0])
  img = image;
  document.getElementById("bildeKontainer").innerHTML = '<img src="'+img+'" class="product_img" />';

  classifyObj();
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

  if (confidence < 0.8){
    alert("Vi gjenkjente ikke objektet, prøv igjen.")
    console.log(label, confidence)
    return;
  }
  
  // Stol
  if (label == "Stol"){
    let stol_underC = classifierStol.predict(img)


    stol_underC.then(function(results){

      if (results[0].confidence < 0.8){

        document.getElementById("classified_item").innerHTML = "Category:  " + (label) + "\n";
        document.getElementById("classified_confidence").innerHTML = "Confidence: " + nf(confidence, 0, 2);
        alert("Vi gjenkjente ikke hvilken stol du har valgt, prøv igjen.") 
      }
      else {
        document.getElementById("classified_item").innerHTML = "Category:  " + (results[0].label) + "\n";
        document.getElementById("classified_confidence").innerHTML = "Confidence: " + nf((results[0].confidence), 0, 2);
      }
    });
  }
}



// function classifyStol(img){
//   return classifierStol.predict(img, gotResult);
// }



//-----------------------------------finding the under-category----------------------------------

