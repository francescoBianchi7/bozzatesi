//Handle Image Input
function handleImageInput(event){
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file){
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgMain = document.getElementById("img-main");
            imgMain.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
//Compute Color for Labels
function computeColorforLabels(className){
    if(className == 'person'){
        color=[85, 45, 255,200];
      }
}

function drawBoundingBox(predictions, image){
    predictions.forEach(
        prediction => {
            const bbox = prediction.bbox;
            const x = bbox[0];
            const y = bbox[1];
            const width = bbox[2];
            const height = bbox[3];
            const className = prediction.class;
            const confScore = prediction.score;
            const color = computeColorforLabels(className)
            console.log(x, y, width, height, className, confScore);
            let point1 = new cv.Point(x, y);
            let point2 = new cv.Point(x+width, y+height);
            cv.rectangle(image, point1, point2, color, 2);
            const text = `${className} - ${Math.round(confScore*100)/100}`;
            const font =  cv.FONT_HERSHEY_TRIPLEX;
            const fontsize = 0.70;
            const thickness = 1;
            //Get the size of the text
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const textMetrics = context.measureText(text);
            const twidth = textMetrics.width;
            console.log("Text Width", twidth);
            cv.rectangle(image, new cv.Point(x, y-20), new cv.Point(x + twidth + 150,y), color, -1);
            cv.putText(image, text, new cv.Point(x, y-5), font, fontsize, new cv.Scalar(255, 255, 255, 255), thickness);
        }
    )
}
function OpenCVReady(){
    cv["onRuntimeInitialized"]=()=>{
        console.log("OpenCV Ready");
        let imgMain = cv.imread("img-main");
        cv.imshow("main-canvas", imgMain)
        imgMain.delete();

        //Handle Image Input
        //Object Detection Image

        console.log("Object Detection Image");
            const image = document.getElementById("selected-img");
            let inputImage = cv.imread(image);
            cocoSsd.load().then(model => {
                model.detect(image).then(predictions =>{
                    console.log("Predictions", predictions)
                    console.log("Length of Predictions", predictions.length)
                    if (predictions.length > 0){
                        drawBoundingBox(predictions, inputImage);
                        cv.imshow("main-canvas", inputImage)
                        inputImage.delete();
                    }
                    else{
                        cv.imshow("main-canvas", inputImage);
                        inputImage.delete();
                    }
                })
            })
    }
}