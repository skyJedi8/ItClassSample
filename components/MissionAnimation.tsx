'use client';

export default function MissionAnimation() {
  return (
    <div className="mission-animation" aria-label="Operation Clean Freedom precision service animation">
      <div className="mission-grid" />
      <div className="mission-ring ring-one" />
      <div className="mission-ring ring-two" />
      <div className="mission-scan" />
      <div className="mission-center">
        <span className="mission-kicker">VETERAN-OWNED</span>
        <strong>PRECISION EXTERIOR CARE</strong>
        <small>Scope confirmed • Property protected • Results verified</small>
      </div>
      <span className="mission-node node-one" />
      <span className="mission-node node-two" />
      <span className="mission-node node-three" />
    </div>
  );
}
