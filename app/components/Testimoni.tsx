"use client";

import React, { useState, useEffect, useRef } from "react";

interface TestimoniProps {
  name: string;
  role: string;
  review: string;
  avatar?: string;
  category: string;
}

const TestimoniCard: React.FC<TestimoniProps & { index: number }> = ({
  name,
  role,
  review,
  avatar,
  category,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`shadow-2xl rounded-2xl p-8 md:p-10 border-4 border-zinc-800 h-full flex flex-col min-h-[400px] transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Category Badge */}
      <div className="flex items-center space-x-2 mb-6">
        {category === "USER" && (
          <>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm text-gray-400 uppercase tracking-wider">
              Sebagai Pengguna
            </span>
          </>
        )}
        {category === "HR" && (
          <>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-400 uppercase tracking-wider">
              Sebagai HR
            </span>
          </>
        )}
        {category === "FREELANCER" && (
          <>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="text-sm text-gray-400 uppercase tracking-wider">
              Sebagai Freelancer
            </span>
          </>
        )}
      </div>

      {/* Review Text */}
      <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 flex-grow">
        {review}
      </p>

      {/* User Info */}
      <div className="flex items-center space-x-4 mt-auto">
        {/* {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hijautua to-hijaubiru flex items-center justify-center text-white font-bold">
            {name.substring(0, 2).toUpperCase()}
          </div>
        )} */}
        <div>
          <p className="font-semibold text-white text-base">{name}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

interface TestimoniSectionProps {
  testimonials?: TestimoniProps[];
}

const TestimoniSection: React.FC<TestimoniSectionProps> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeaderVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  const defaultTestimonials: TestimoniProps[] = [
    {
      name: "Anisa Rahma",
      role: "Software Engineer",
      review:
        "GajiBersih sangat membantu saya memahami kontrak kerja pertama saya. Fitur analisis kontraknya detail dan mudah dipahami, terutama bagian tentang hak cuti dan benefit yang sering terlewat.",
      category: "USER",
    },
    {
      name: "Budi Prasetyo",
      role: "Product Manager",
      review:
        "Kalkulator gaji bersihnya akurat banget! Sekarang saya bisa lebih percaya diri dalam negosiasi gaji karena tahu persis berapa yang akan saya terima setelah dipotong pajak dan BPJS.",
      category: "USER",
    },
    {
      name: "Citra Handayani",
      role: "HR Manager di Tech Startup",
      review:
        "Sebagai HR, GajiBersih membantu kami menjelaskan struktur gaji kepada kandidat dengan lebih transparan. Kandidat jadi lebih paham dan percaya dengan tawaran kami.",
      category: "HR",
    },
    {
      name: "Dimas Putra",
      role: "Freelance Developer",
      review:
        "Fitur perbandingan tawaran kerja sangat berguna saat saya dapat beberapa project sekaligus. Saya bisa membandingkan rate, benefit, dan workload dengan mudah.",
      category: "FREELANCER",
    },
    {
      name: "Eka Putri",
      role: "Marketing Specialist",
      review:
        "Sebagai fresh graduate, GajiBersih membantu saya memahami hak dan kewajiban dalam kontrak kerja. Sekarang saya tahu apa yang harus saya tanyakan saat interview!",
      category: "USER",
    },
    {
      name: "Fahmi Akbar",
      role: "Business Analyst",
      review:
        "Proses upload dokumen mudah dan cepat. Hasil analisisnya juga detail dan profesional. AI-nya bahkan bisa mendeteksi klausul yang berpotensi merugikan.",
      category: "USER",
    },
  ];

  const displayTestimonials = testimonials || defaultTestimonials;

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev + 3 >= displayTestimonials.length ? 0 : prev + 3
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev - 3 < 0 ? Math.max(0, displayTestimonials.length - 3) : prev - 3
    );
  };

  const visibleTestimonials = displayTestimonials.slice(
    currentIndex,
    currentIndex + 3
  );

  return (
    <section className="relative bg-hijaubiru text-white py-16 md:py-24 px-6 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,158,116,0.1)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with handwriting style */}
        <div
          ref={headerRef}
          className={`text-center mb-16 md:mb-20 transition-all duration-1000 ease-out ${
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-4 relative inline-block">
            <span className="font-serif italic">Beberapa kata dari mereka</span>
            {/* Decorative arrow */}
            <svg
              className="absolute -right-8 md:-right-16 top-0 w-12 h-12 md:w-16 md:h-16 text-gray-600 hidden md:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
                strokeDasharray="4 4"
              />
            </svg>
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div
          className={`flex justify-center items-center space-x-4 mb-12 transition-all duration-700 ease-out ${
            isHeaderVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"
            aria-label="Previous testimonials"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"
            aria-label="Next testimonials"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <TestimoniCard
              key={`${currentIndex}-${index}`}
              {...testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center space-x-2 mt-12">
          {Array.from({
            length: Math.ceil(displayTestimonials.length / 3),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentIndex / 3) === index
                  ? "bg-hijautua w-8"
                  : "bg-zinc-700"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { TestimoniCard, TestimoniSection };
export type { TestimoniProps, TestimoniSectionProps };
