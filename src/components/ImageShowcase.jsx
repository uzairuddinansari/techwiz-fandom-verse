import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../styles/ImageShowcase.css";

const images = [
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7zDMYnGheNT1l7pEW3R5N3Uf4--yCjRprCG9W5WQ58g&s=10", name: "Your Website", description: "A modern digital experience built for your users." },
  { src: "https://images.unsplash.com/photo-1779896411942-ea4ca54de043?q=80&w=1170&auto=format&fit=crop", name: "Your Website", description: "Powerful tools and beautiful experiences in one place." },
  { src: "https://images.unsplash.com/photo-1789349050760-cc196eed88b1?q=80&w=1170&auto=format&fit=crop", name: "Your Website", description: "Designed to be fast, smooth and easy to use." }
];

function ImageShowcase() {
  const [current, setCurrent] = useState(0);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.fromTo(imageRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });

    gsap.fromTo(".showcase-content-item", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" });
  }, [current]);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.12,
      duration: 0.7,
      ease: "power3.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.7,
      ease: "power3.out"
    });
  };

  const item = images[current];

  return (
    <section className="image-showcase">
      <div className="image-showcase-media" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img ref={imageRef} src={item.src} alt={item.name} />

        <div className="image-showcase-overlay"></div>
      </div>

      <div ref={contentRef} className="image-showcase-content">
        <span className="showcase-content-item">FEATURED</span>
        <h2 className="showcase-content-item">{item.name}</h2>
        <p className="showcase-content-item">{item.description}</p>
      </div>

      <div className="showcase-indicators">
        {images.map((_, index) => (
          <span key={index} className={index === current ? "active" : ""}></span>
        ))}
      </div>
    </section>
  );
}

export default ImageShowcase;
