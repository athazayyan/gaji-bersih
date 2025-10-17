"use client";

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
}

export default function SegmentedControl({
  options,
  selectedIndex,
  onSelectionChange,
}: SegmentedControlProps) {
  return (
    <div
      className="flex p-1 bg-gradient-hijaumuda"
      style={{
        borderRadius: "30px",
        width: "100%",
        height: "50px",
      }}
    >
      {options.map((option, index) => (
        <button
          key={option}
          onClick={() => onSelectionChange(index)}
          className={`flex-1 text-sm font-medium transition-all duration-300 ${
            selectedIndex === index
              ? "bg-white text-green-800"
              : "text-white hover:text-gray-200"
          }`}
          style={{
            borderRadius: selectedIndex === index ? "20px" : "0",
            border: selectedIndex === index ? "1px solid white" : "none",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
