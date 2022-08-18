// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

let modelURL = 'https://teachablemachine.withgoogle.com/models/ezH802a7a/';

function preload() {
    classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {}

function classifyStol(img){
  return classifier.predict(img, gotResult);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  if (error) {
    console.error(error);
    alert(error);
    return error
  }

  console.log(results);
  const label = results[0].label;
  const confidence = nf(results[0].confidence, 0, 2);

  // TODO: I need a way to send error message back to "hvitevarer.js"

  const obj_stol = {
    "category" : label,
    "confidence" : confidence
  }

  return obj_stol;
}




