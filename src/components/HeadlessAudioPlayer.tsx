import clsx from "clsx";
import styles from "./HeadlessAudioPlayer.module.css";
import {
  ComponentProps,
  ForwardedRef,
  createContext,
  createElement,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const AudioPlayerContext = createContext<any>({});

export function AudioPlayer({
  src,
  children,
  as,
  className,
  preload = "metadata",
}: {
  src: string;
  as?: any;
  className?: string;
  children: React.ReactNode;
  preload?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleEnded = () => {
    setIsPlaying(false);
  };
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    console.log("duration", audioRef.current?.duration);
    setDuration(audioRef.current?.duration || 0);
  };

  const setTime = (time: number) => {
    if (!audioRef.current) return;
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const tag = as || "div";
  const element = createElement(
    tag,
    {
      className: clsx(
        className,
        "flex items-center py-2 px-2 gap-x-2 rounded-full bg-gray-100 max-w-s"
      ),
    },
    children
  );

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTime,
        volume,
        isPlaying,
        duration,
        setVolume,
        setTime,
        onPlayPauseClick: (
          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
          if (!audioRef.current) return;
          if (!isPlaying) {
            audioRef.current.play();
            setIsPlaying(true);
          } else if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        },
      }}
    >
      {element}
      <audio
        src={src}
        ref={audioRef}
        preload={preload}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}

export function PlayButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isPlaying, onPlayPauseClick } = useAudioPlayer();
  const content = children || (
    <span className="bg-gray-800 stroke-gray-800">
      {!isPlaying ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </span>
  );
  return (
    <button
      className={clsx(className, "py-2 px-2 hover:bg-gray-300 rounded-full")}
      role="switch"
      aria-checked={isPlaying}
      onClick={onPlayPauseClick}
    >
      {content}
    </button>
  );
}

export function ProgressBar({ className }: { className?: string }) {
  const { currentTime, setTime, duration } = useAudioPlayer();
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(parseFloat(e.target.value));
  };
  return (
    <input
      className={clsx(className, styles.range)}
      type="range"
      min={0}
      max={duration}
      value={currentTime}
      onChange={handleTimeChange}
    />
  );
}

export function ProgressTime({
  className,
  as,
}: {
  className?: string;
  as?: any;
}) {
  const { duration, currentTime } = useAudioPlayer();
  const content = (
    <>
      {`${Math.trunc(currentTime)}s`}/{`${Math.trunc(duration)}s`}
    </>
  );
  if (as) return createElement(as, { className }, content);
  return <span className={clsx(className, "text-xs")}>{content}</span>;
}

export function Volume({ className }: { className?: string }) {
  const { volume, setVolume } = useAudioPlayer();
  return (
    <input
      className={className}
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={volume}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
    />
  );
}

AudioPlayer.PlayButton = PlayButton;
AudioPlayer.ProgressTime = ProgressTime;
AudioPlayer.ProgressBar = ProgressBar;
AudioPlayer.Volume = Volume;
