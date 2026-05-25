import { PhoneOff } from "lucide-react";

type Props = {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  onEndCall: () => void;
};

export default function VideoCallModal({
  localVideoRef,
  remoteVideoRef,
  onEndCall
}: Props) {

  return (

    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local Video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-4 right-4 w-64 rounded-xl border-2 border-white"
        style={{
          transform: "scaleX(-1)"
        }}
      />

      {/* End Call Button */}
      <button
        onClick={onEndCall}
        className="absolute bottom-10 bg-red-500 p-4 rounded-full cursor-pointer"
      >
        <PhoneOff className="text-white" />
      </button>

    </div>

  );
}