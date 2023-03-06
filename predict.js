// Replace the "Functional" with "Model" in model.json file
// stop at 46 min
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
    model = await tf.loadLayersModel('./tfjs-models/VGG16/model.json')
    $('.progress-bar').hide()
})()

$("#predict-button").click(async function () {
    let image = $("#selected-image").get(0);
    // we do this because Model expect the image data to be organized in this way

    let tensor = tf.browser.fromPixels(image) // Create tensor object form the image
        .resizeNearestNeighbor([224, 224]) // resize the image
        .toFloat() // tensor type 32
    // .expandDims() // expand dimession to be in rank 4

    // Define the RGB from image net
    let meanImageNetRGB = {
        red: 123.68,
        green: 116.779,
        blue: 103.939
    }

    // Create 1d tensor [R,G,B]
    let indices = [
        tf.tensor1d([0], "int32"),
        tf.tensor1d([1], "int32"),
        tf.tensor1d([2], "int32"),
    ]


    let centeredRGB = {
        red: tf.gather(tensor, indices[0], 2).sub(tf.scalar(meanImageNetRGB.red)).reshape([50176]),
        green: tf.gather(tensor, indices[1], 2).sub(tf.scalar(meanImageNetRGB.green)).reshape([50176]),
        blue: tf.gather(tensor, indices[2], 2).sub(tf.scalar(meanImageNetRGB.blue)).reshape([50176]),
    }

    let processedTensor = tf.stack([
        centeredRGB.red, centeredRGB.green, centeredRGB.blue
    ], 1).reshape([224, 224, 3]).reverse(2).expandDims()

    // data is async func which will load the value from the tensor as array after the computation complete
    let prediction = await model.predict(processedTensor).data()

    // return the top 5 from the returned data
    let top5 = Array.from(prediction).map(function (p, i) {
        return {
            probability: p,
            className: IMAGENET_CLASSES[i]
        }
    }).sort(function (a, b) {
        return b.probability - a.probability
    }).slice(0, 5)

    $("#prediciton-list").empty();
    top5.forEach(function (p) {
        $("#prediction-list").append(`<li>#${p.className}</li>`)
    })

    console.log('done')
})