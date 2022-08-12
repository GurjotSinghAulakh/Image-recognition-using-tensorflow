
$("#upload_file").on("change", function(e){
    var ext = $("#upload_file").val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
        $(".error_msg").text("Not an Image...");
    } else {
        $(".error_msg").text("");
        $(".button_outer").addClass("file_uploading");
        setTimeout(function(){
            $(".button_outer").addClass("file_uploaded");
        },3000);
        var uploadedFile = URL.createObjectURL(e.target.files[0]);
        setTimeout(function(){
            $("#uploaded_view").append('<img src="'+uploadedFile+'" />').addClass("show");
        },3500);
    }
});

$(".file_remove").on("click", function(e){
    $("#uploaded_view").removeClass("show");
    $("#uploaded_view").find("img").remove();
    $(".button_outer").removeClass("file_uploading");
    $(".button_outer").removeClass("file_uploaded");
});