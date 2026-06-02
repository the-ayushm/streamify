import { useEffect } from "react";
import { PhoneOff } from "lucide-react";

type Props = {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
  isVisible: boolean;
};

export default function VideoCallModal({
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  onEndCall,
  isVisible,
}: Props) {

  useEffect(() => {
    const video = localVideoRef.current;
    if (!video || !localStream) return;
    video.srcObject = localStream;
    video.play().catch(() => {});
  }, [localStream, isVisible]);

  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video || !remoteStream) return;
    video.srcObject = remoteStream;

    const tryPlay = () => {
      video.play().catch(err => {
        console.error("REMOTE PLAY FAILED", err);
      });
    };

    // wait for tracks to be ready
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }
  }, [remoteStream, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

      {/* Remote Video — NOT muted */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover bg-black"
      />

      {/* Local Video — muted to avoid echo */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-4 right-4 w-64 rounded-xl border-2 border-white bg-black"
        style={{ transform: "scaleX(-1)" }}
      />

      <button
        onClick={onEndCall}
        className="absolute bottom-10 bg-red-500 p-4 rounded-full cursor-pointer hover:bg-red-600 transition"
      >
        <PhoneOff className="text-white" />
      </button>

    </div>
  );
}