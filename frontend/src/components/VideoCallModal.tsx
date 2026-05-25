// import { PhoneOff } from "lucide-react";

// type Props = {
//   localVideoRef: React.RefObject<HTMLVideoElement | null>;
//   remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
//   onEndCall: () => void;
// };

// export default function VideoCallModal({
//   localVideoRef,
//   remoteVideoRef,
//   onEndCall
// }: Props) {

//   return (

//     <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

//       {/* Remote Video */}
//       <video
//         ref={remoteVideoRef}
//         autoPlay
//         muted
//         playsInline
//         className="w-full h-full object-cover"
//       />

//       {/* Local Video */}
//       <video
//         ref={localVideoRef}
//         autoPlay
//         muted
//         playsInline
//         className="absolute top-4 right-4 w-64 rounded-xl border-2 border-white"
//         style={{
//           transform: "scaleX(-1)"
//         }}
//       />

//       {/* End Call Button */}
//       <button
//         onClick={onEndCall}
//         className="absolute bottom-10 bg-red-500 p-4 rounded-full cursor-pointer"
//       >
//         <PhoneOff className="text-white" />
//       </button>

//     </div>

//   );
// }

import { useState } from "react";
import { PhoneOff, Volume2, VolumeX } from "lucide-react";

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
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setIsMuted(remoteVideoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

      {/* Remote Video — muted by default so browser autoplay works */}
      <video
        ref={remoteVideoRef}
        autoPlay
        muted   // FIX: must be muted for autoplay policy; user can unmute below
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local Video (picture-in-picture) */}
      <video
        ref={localVideoRef}
        autoPlay
        muted   // always muted to avoid echo
        playsInline
        className="absolute top-4 right-4 w-48 md:w-64 rounded-xl border-2 border-white shadow-lg"
        style={{ transform: "scaleX(-1)" }}
      />

      {/* Controls */}
      <div className="absolute bottom-10 flex items-center gap-4">
        {/* Unmute remote audio button */}
        <button
          onClick={toggleMute}
          className="bg-gray-700 hover:bg-gray-600 p-4 rounded-full cursor-pointer transition-colors"
          title={isMuted ? "Unmute remote audio" : "Mute remote audio"}
        >
          {isMuted
            ? <VolumeX className="text-white" />
            : <Volume2 className="text-white" />
          }
        </button>

        {/* End call */}
        <button
          onClick={onEndCall}
          className="bg-red-500 hover:bg-red-600 p-4 rounded-full cursor-pointer transition-colors"
          title="End call"
        >
          <PhoneOff className="text-white" />
        </button>
      </div>

      {/* Hint if remote video is muted */}
      {isMuted && (
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          🔇 Remote audio muted — tap speaker to unmute
        </div>
      )}
    </div>
  );
}