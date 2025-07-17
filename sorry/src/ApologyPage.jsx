import React, { useState, useEffect, useRef } from "react";

const ApologyPage = () => {
  const [scaleIndex, setScaleIndex] = useState(0);
  const [showApologyGIF, setShowApologyGIF] = useState(false);
  const [hearts, setHearts] = useState([]);
  const audioRef = useRef(null);
  const apologyAudioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const scaleSteps = [1, 1.5, 2, 3, 4, 5, 999];
  const currentScale = scaleSteps[scaleIndex];

  const handleNoClick = () => {
    if (scaleIndex < scaleSteps.length - 1) {
      setScaleIndex(scaleIndex + 1);
    }
  };

  const handleYesClick = () => {
    if (audioRef.current) audioRef.current.pause();
    setShowApologyGIF(true);
    if (apologyAudioRef.current) {
      apologyAudioRef.current.play().catch((e) => console.log("Apology audio failed", e));
    }
  };

  // Autoplay background music from 1:30 on first interaction
  useEffect(() => {
    const enableAudio = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.currentTime = 26;
        audioRef.current.play().catch((err) => console.log("Audio blocked:", err));
        setHasInteracted(true);
      }
    };
    window.addEventListener("click", enableAudio);
    return () => window.removeEventListener("click", enableAudio);
  }, [hasInteracted]);

  // Spawn floating hearts every second
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 100,
          delay: Math.random() * 3,
          size: Math.random() * 1.5 + 1,
        },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-red-100 flex flex-col items-center justify-center text-center p-4">
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/love.mp3" type="audio/mpeg" />
      </audio>

      {/* Apology Music */}
      <audio ref={apologyAudioRef} loop>
        <source src="/apology.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Hearts */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute text-pink-400 animate-float"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}rem`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {!showApologyGIF ? (
        <>
          <img
            src="/sorry.gif"
            alt="Sorry"
            className="w-48 h-48 object-contain mb-6 rounded-xl shadow-lg"
          />
          <h1 className="text-4xl font-bold text-pink-700 mb-4">
            I'm Really Sorry 😔
          </h1>
          <div className="flex gap-4 flex-wrap items-center justify-center mt-6">
            {currentScale !== 999 && (
              <button
                className="bg-red-400 text-white rounded-full px-4 py-2 text-lg transition-all duration-300"
                onClick={handleNoClick}
              >
                No Forgiveness 💔
              </button>
            )}
            <button
              onClick={handleYesClick}
              style={{ transform: `scale(${currentScale})` }}
              className="bg-pink-600 text-white rounded-full px-6 py-3 text-xl font-semibold transition-all duration-500"
            >
              OK I Forgive You ❤️
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/apology-final.gif"
            alt="Apology Accepted"
            className="w-[300px] h-auto rounded-2xl shadow-xl mt-6"
          />
          <h2 className="text-3xl text-pink-700 font-bold mt-4">
            Thank you for forgiving me 💖
          </h2>
        </div>
      )}
    </div>
  );
};

export default ApologyPage;
