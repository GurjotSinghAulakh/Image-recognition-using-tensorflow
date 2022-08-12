function hei(e){
    var btnUpload = document.getElementById("imageFile")
    console.log(btnUpload)
    var uploadedFile = URL.createObjectURL(btnUpload.files[0]);
    document.getElementById("bilde").innerHTML = '<img src="'+uploadedFile+'" />'
}