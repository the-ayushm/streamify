import { useEffect, useRef } from "react";

export default function VideoTest() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {

    const startCamera = async () => {
    
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if(videoRef.current){
        videoRef.current.srcObject = stream;
      }
    };

    startCamera();

  }, []);

  return (

    <div>

      <h1>My Camera</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "400px",
          borderRadius: "10px",
          transform: "scaleX(-1)"
        }}
      />

    </div>
  );
}