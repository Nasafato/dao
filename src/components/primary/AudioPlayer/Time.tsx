import { useDaoStore } from "../../../state/store";

interface Props {
  isBeginning?: boolean;
  children: (time: number) => JSX.Element;
}

export function Time({ isBeginning = false, children }: Props) {
  const duration = useDaoStore((state) => state.audioDuration);
  const visualProgress = useDaoStore((state) => state.visualProgress);
  return children(isBeginning ? visualProgress * duration : duration);
}

export function TimeRemaining({ children }: Props) {
  return (
    <Time>
      {(time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return (
          <>
            `${minutes}:${seconds.toString().padStart(2, "0")}`
          </>
        );
      }}
    </Time>
  );
}
