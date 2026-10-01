export default function TravelMarquee() {
  const images = [
    { url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80", title: "Global Flights" },
    { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80", title: "Passport & Documents" },
    { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", title: "Paris, France" },
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", title: "Tropical Getaway" },
    { url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80", title: "Scenic Mountains" },
    { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", title: "Kyoto, Japan" },
    { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80", title: "World Tourism" }
  ];

  return (
    <div className="travel-marquee-container">
      <div className="marquee-header">
        <span className="marquee-tag">✈️ POPULAR DESTINATIONS & TRAVEL SHOWCASE</span>
      </div>
      <div className="marquee-track-wrapper">
        <div className="marquee-track">
          {images.concat(images).map((img, index) => (
            <div key={index} className="marquee-card">
              <img src={img.url} alt={img.title} />
              <div className="marquee-caption">{img.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
