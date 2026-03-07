export default function ProcessSteps() {
  const steps = ['Call or Text', 'Confirm Scope & Schedule', 'We Clean + You See the Difference'];

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-200">Step {index + 1}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{step}</h3>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-300">Before/after photos are available on request for full transparency.</p>
    </div>
  );
}
