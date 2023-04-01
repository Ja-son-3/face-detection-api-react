import { useRef, useEffect } from "react"
import * as faceapi from 'face-api.js'
import "./app.css"

const App = () => {
  const imgRef = useRef()
  const canvasRef = useRef()

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imgRef.current, 
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks()
    .withFaceExpressions()

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current)
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    })

    const resized = faceapi.resizeResults(detections,{
      width: 940,
      height: 650,
    })

    faceapi.draw.drawDetections(canvasRef.current, resized)
    faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
  }
  useEffect(()=>{
    const loadModels = () =>{
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
      .then(handleImage)
      .catch((e)=> console.log(e))
    }

    imgRef.current && loadModels()
  },[])
  return (
    <div className="app">
      <img 
        crossOrigin="anonymous"
        ref={imgRef} 
        src="https://images.pexels.com/photos/9371782/pexels-photo-9371782.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" 
        alt="" 
        width="940" 
        height="650" 
      />
      <canvas ref={canvasRef} width="940" height="650"></canvas>
    </div>
  )
}

export default App