// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;
let classifierStol;

// A variable to hold the image we want to classify
let img;

// Checks wgich appliance is being classified and returns the correct object
let modelURLHvitevarer = 'https://teachablemachine.withgoogle.com/models/ZL010TeHk/';

//let modelURLStol = 'https://teachablemachine.withgoogle.com/models/ezH802a7a/';
//let modelURLSofa = "https://teachablemachine.withgoogle.com/models/eCG1GaW07/";


let antall_bilder;
let antall_godkjent;
let antall_underSytti;


function preload() {
    classifier = ml5.imageClassifier(modelURLHvitevarer + 'model.json');
    
    //classifierStol = ml5.imageClassifier(modelURLStol + 'model.json');
    //classifierSofa = ml5.imageClassifier(modelURLSofa + 'model.json');
}


async function start() {

    for (let i = 1; i<1000; i++){
        img = "bilder/sofa/"+i+".jpg"
        await classifyObj()   
    }
    let sikkehet = (antall_godkjent/1000) * 100;

    console.log("Antall godkjente: " + antall_godkjent)
    console.log("Sikkerhet : " + sikkehet + "%" )
}


function uploadImage(){
  let image_object = document.getElementById("imageUploaded")
  let image = URL.createObjectURL(image_object.files[0])
  img = image;
  document.getElementById("bildeKontainer").innerHTML = '<img src="'+img+'" class="product_img" />';

  classifyObj();
}



function setup() {
  //createCanvas(300, 300);  
}



function classifyObj(){
  img = loadImage(img);
  classifier.predict(img, gotResult);
}


function gotResult(error, results) {
  const label = results[0].label;
  const confidence = nf(results[0].confidence, 0, 2);

  console.log(results)

  if (error) {
    console.error(error);
    alert(error);
    return
  }

  if (confidence < 0.7){
    console.log(label, confidence)
    antall_underSytti ++;
  }

  document.getElementById("classified_item").innerHTML = "Category:  " + (label) + "\n";
  document.getElementById("classified_confidence").innerHTML = "Confidence: " + nf(confidence, 0, 2);
  
  // sjekker om vi fikk riktig svar: 
  if (label == "Sofa"){
    antall_godkjent ++
  }else{
    console.log("fail")
  }



  // sjekker under-kategorier
  /*
  // Stol
  if (label == "Sofa"){
    let stol_underC = classifierStol.predict(img)


    stol_underC.then(function(results){

      if (results[0].confidence < 0.7){
        alert("Vi gjenkjente ikke hvilken type sofa du har valgt, prøv igjen.") 
      }
      else {
        document.getElementById("classified_item").innerHTML = "Category:  " + (results[0].label) + "\n";
        document.getElementById("classified_confidence").innerHTML = "Confidence: " + nf((results[0].confidence), 0, 2);
      }
    });
  }
  */
}
