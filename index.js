const video = document.getElementById("videoElm");
const startFaceDetection = async () => {
  await faceapi.nets.faceLandmark68Net.loadFromUri("./weights");
  await faceapi.nets.faceRecognitionNet.loadFromUri("./weights");
  await faceapi.nets.tinyFaceDetector.loadFromUri("./weights");
  await faceapi.nets.faceExpressionNet.loadFromUri("./weights");

  navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
    video.srcObject = stream;
  });
  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas
        .getContext("2d")
        .clearRect(0, 0, displaySize.width, displaySize.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
  });
};

startFaceDetection();
