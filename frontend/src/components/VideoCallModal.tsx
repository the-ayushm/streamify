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

  // ✅ Local video attach
  useEffect(() => {
    const video = localVideoRef.current;

    if (!video || !localStream) return;

    if (video.srcObject !== localStream) {
      video.srcObject = localStream;
    }

    video.play().catch((err) => {
      console.error("LOCAL VIDEO PLAY FAILED", err);
    });

  }, [localStream]);

  // ✅ Remote video attach
  useEffect(() => {
    const video = remoteVideoRef.current;

    if (!video || !remoteStream) return;

    // ✅ Baar baar srcObject reset mat karo
    if (video.srcObject !== remoteStream) {
      video.srcObject = remoteStream;
    }

    const playVideo = async () => {
      try {
        await video.play();
        console.log("REMOTE VIDEO PLAYING");
      } catch (err) {
        console.error("REMOTE PLAY FAILED", err);
      }
    };

    playVideo();

  }, [remoteStream]);

  // ✅ Modal hidden
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

      {/* ✅ Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover bg-black"
      />

      {/* ✅ Local Video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-4 right-4 w-64 rounded-xl border-2 border-white bg-black"
        style={{
          transform: "scaleX(-1)",
        }}
      />

      {/* ✅ End Call Button */}
      <button
        onClick={onEndCall}
        className="absolute bottom-10 bg-red-500 p-4 rounded-full cursor-pointer hover:bg-red-600 transition"
      >
        <PhoneOff className="text-white" />
      </button>

    </div>
  );
}