const TRUST_LOGOS = ["TATA", "Infosys", "Wipro", "Tech Mahindra", "HCL", "Accenture", "Cognizant"];

export default function TrustStrip() {
  return (
    <div className="mt-4 pb-4 text-center">
      <p className="text-[12.5px] text-ink-500 font-medium mb-3">
        Trusted by 10,000+ Users &amp; 500+ Companies
      </p>
      <div className="flex items-center justify-center flex-wrap gap-6">
        {TRUST_LOGOS.map((logo) => (
          <span key={logo} className="text-[12.5px] font-bold text-ink-300 tracking-wide uppercase">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
