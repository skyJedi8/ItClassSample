'use client';

import { useEffect, useState } from 'react';

type AnimationType = 'window' | 'gutter' | 'pressure';

const bubbles = [
  [12, 18, 24], [24, 62, 14], [36, 34, 18], [48, 76, 26], [58, 22, 12],
  [69, 54, 20], [78, 28, 16], [86, 72, 22], [18, 82, 10], [43, 50, 15],
  [63, 86, 13], [91, 45, 11]
];

const leaves = [
  [10, 22, -12], [20, 58, 18], [33, 34, -28], [45, 70, 10], [56, 26, 34],
  [66, 54, -16], [75, 18, 24], [84, 67, -35], [28, 82, 12], [58, 88, -20]
];

export default function ServiceAnimation({ type }: { type: AnimationType }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setCycle((value) => value + 1), 6500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div key={cycle} className="service-animation" aria-label={`${type} cleaning demonstration`}>
      {type === 'window' && (
        <div className="window-animation">
          <div className="window-grid" />
          {bubbles.map(([left, top, size], index) => (
            <span
              key={index}
              className="clean-bubble"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${index * 90}ms` }}
            />
          ))}
          <div className="squeegee"><span /></div>
          <div className="clean-sparkle" aria-hidden="true">✦</div>
        </div>
      )}

      {type === 'gutter' && (
        <div className="gutter-animation">
          <div className="roof-edge" />
          <div className="gutter-channel" />
          {leaves.map(([left, top, rotate], index) => (
            <span
              key={index}
              className="gutter-leaf"
              style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${rotate}deg)`, animationDelay: `${index * 110}ms` }}
            >◆</span>
          ))}
          <div className="air-stream"><span /><span /><span /></div>
          <div className="flow-check">FLOW RESTORED</div>
        </div>
      )}

      {type === 'pressure' && (
        <div className="pressure-animation">
          <div className="concrete-dirty" />
          <div className="concrete-clean" />
          <div className="washer-wand" />
          <div className="spray-fan" />
          <div className="clean-line" />
          <div className="pressure-label">CONTROLLED CLEANING PASS</div>
        </div>
      )}
    </div>
  );
}
