import React, { memo } from 'react';

type Status = 'unanswered' | 'correct' | 'wrong';

interface ProgressBarProps {
  total: number;
  currentIndex: number;
  statuses: Status[]; // length === total
  onJump?: (index: number) => void;
}

const ProgressBar = ({ total, currentIndex, statuses, onJump }: ProgressBarProps) => {
  return (
    <div className="flex items-center gap-2" role="list" aria-label="Question progress">
      {Array.from({ length: total }).map((_, i) => {
        const status = statuses[i] ?? 'unanswered';
        const base = 'w-8 h-6 rounded flex items-center justify-center text-xs cursor-pointer';
        const cls =
          i === currentIndex
            ? `${base} ring-2 ring-green`
            : status === 'correct'
              ? `${base} bg-green`
              : status === 'wrong'
                ? `${base} bg-red`
                : `${base} bg-gray-600`;
        return (
          <button
            key={i}
            className={cls}
            onClick={() => onJump?.(i)}
            aria-current={i === currentIndex ? 'step' : undefined}
            aria-label={`Question ${i + 1} ${status}`}
          >
            {i + 1}
          </button>
        );
      })}
      <div className="ml-auto text-sm text-gray-300">
        {statuses.filter((s) => s !== 'unanswered').length}/{total} answered
      </div>
    </div>
  );
};

export default memo(ProgressBar);
