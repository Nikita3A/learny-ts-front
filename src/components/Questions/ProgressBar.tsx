import React, { memo } from 'react';

type Status = 'unanswered' | 'correct' | 'wrong';

interface ProgressBarProps {
  total: number;
  currentIndex: number;
  statuses: Status[]; // length === total
  onJump?: (index: number) => void;
}

const ProgressBar = ({ total, currentIndex, statuses, onJump }: ProgressBarProps) => {
  const answeredCount = statuses.filter((s) => s !== 'unanswered').length;

  return (
    <div className="w-full">
      {/* Start-aligned on small screens so initial view shows question 1,
          center on md+ when the row fits */}
      <div className="overflow-x-auto no-scrollbar px-2 flex items-stretch md:justify-center">
        <div className="inline-flex gap-3 py-2 w-max">
          {Array.from({ length: total }).map((_, i) => {
            const status = statuses[i] ?? 'unanswered';
            const base = 'flex items-center justify-center rounded-md text-base cursor-pointer select-none';
            const sizeCls = 'w-8 h-8 md:w-8 md:h-8 lg:w-8 lg:h-8';
            const cls =
              i === currentIndex
                ? `${base} ${sizeCls} ring-3 ring-green`
                : status === 'correct'
                  ? `${base} ${sizeCls} bg-green text-white`
                  : status === 'wrong'
                    ? `${base} ${sizeCls} bg-red text-white`
                    : `${base} ${sizeCls} bg-darkGray text-white/90`;
            return (
              <button
                key={i}
                className={cls}
                onClick={() => onJump?.(i)}
                aria-current={i === currentIndex ? 'step' : undefined}
                aria-label={`Question ${i + 1} ${status}`}
              >
                <span className="font-semibold text-sm md:text-base lg:text-lg">{i + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 text-center text-sm text-gray-300">
        <span className="font-medium">{answeredCount}</span>/<span className="text-white/70">{total}</span> answered
      </div>
    </div>
  );
};

export default memo(ProgressBar);
