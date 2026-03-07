const steps = ['Call or Text', 'Confirm Scope & Schedule', 'We Clean + You See the Difference'];

export default function ProcessSteps() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="glass-card p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-sky-300">Step {index + 1}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{step}</h3>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-300">We can share before/after photos on request.</p>
    </div>
  );
}
