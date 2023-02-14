// display selected image
$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL)
        $("#prediction-list").empty()
    }

    let file = $("#image-selector").prop('files')[0]
    reader.readAsDataURL(file)
})

// load the model
let model
(async function () {
    // model = await tf.loadLayersModel('http://localhost:81/tfjs-models/VGG16/model.json')
    $('.progress-bar').hide()
})()

$("#predict-button").click(async function () {
    let image = $("#selected-image").get(0);
    // we do this because Model expect the image data to be organized in this way
    let tensor = tf.fromPixels(image) // Create tensor object form the image
    .resizeNearestNeighbor([224, 224]) // resize the image
    .toFloat() // tensor type 
    .expandDims() // expand dimession to be in rank 4
})