interface QuestionCardProps {
  question: string;
  category: string;
  priority: "high" | "medium" | "low";
  onClick: () => void;
}

const priorityConfig = {
  high: {
    bgColor: "#FFE5E5",
    badgeColor: "#FF4444",
    badgeText: "Penting",
  },
  medium: {
    bgColor: "#FFF4E5",
    badgeColor: "#FFB800",
    badgeText: "Perlu",
  },
  low: {
    bgColor: "#E5F4E5",
    badgeColor: "#4CAF50",
    badgeText: "Opsional",
  },
};

export default function QuestionCard({
  question,
  category,
  priority,
  onClick,
}: QuestionCardProps) {
  const config = priorityConfig[priority];

  return (
    <div
      className="p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-200 relative overflow-hidden"
      style={{
        backgroundColor: config.bgColor,
        border: `2px solid ${config.badgeColor}20`,
        filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
      }}
      onClick={onClick}
    >
      {/* Decorative background element */}
      <div
        className="absolute -right-6 -top-6 rounded-full opacity-10"
        style={{
          width: "80px",
          height: "80px",
          backgroundColor: config.badgeColor,
        }}
      />

      {/* Priority Badge & Category */}
      <div className="flex justify-between items-start mb-3 relative z-10">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full text-white"
          style={{
            backgroundColor: config.badgeColor,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {config.badgeText}
        </span>
        <span
          className="text-xs font-medium text-hijautua opacity-70"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {category}
        </span>
      </div>

      {/* Question Text */}
      <p
        className="text-hijautua font-medium leading-relaxed relative z-10"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {question}
      </p>

      {/* Tap indicator */}
      <div className="flex justify-end mt-3 relative z-10">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: config.badgeColor,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
