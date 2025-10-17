interface AnalysisDetailCardProps {
  title: string;
  clauses?: string;
  aiExplanation: string;
  recommendation?: string;
}

export default function AnalysisDetailCard({
  title,
  clauses,
  aiExplanation,
  recommendation,
}: AnalysisDetailCardProps) {
  return (
    <div
      className="bg-gradient-hijau p-6 rounded-2xl relative overflow-hidden"
      style={{
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Decorative corner element */}
      <div
        className="absolute -right-6 -top-6 rounded-full opacity-10"
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "white",
        }}
      />

      {/* Title */}
      <h3
        className="text-white font-bold mb-4 relative z-10"
        style={{
          fontSize: "19px",
          fontStyle: "italic",
          lineHeight: "1.3",
        }}
      >
        {title}
      </h3>

      {/* Clauses (if provided) */}
      {clauses && (
        <div
          className="mb-4 p-3 rounded-lg relative z-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          }}
        >
          <p
            className="text-white"
            style={{
              fontSize: "12px",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            {clauses}
          </p>
        </div>
      )}

      {/* AI Explanation Section */}
      <div
        className="bg-white rounded-xl p-4 mb-3 relative z-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h4
          className="font-bold mb-2"
          style={{
            fontSize: "14px",
            color: "#213813",
          }}
        >
          Penjelasan AI
        </h4>
        <p
          className="text-hijautua"
          style={{
            fontSize: "12px",
            lineHeight: "1.6",
          }}
        >
          {aiExplanation}
        </p>
      </div>

      {/* Recommendation (if provided) */}
      {recommendation && (
        <div
          className="bg-white rounded-xl p-4 relative z-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h4
            className="font-bold mb-2"
            style={{
              fontSize: "14px",
              color: "#213813",
            }}
          >
            Rekomendasi
          </h4>
          <p
            className="text-hijautua"
            style={{
              fontSize: "12px",
              lineHeight: "1.6",
            }}
          >
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
