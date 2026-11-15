import ImageSlot from "@/components/ImageSlot";
import SectionTitle from "@/components/SectionTitle";
import { assetUrl } from "@/api";
import { useSite } from "@/context/SiteContext";
import { IMAGES } from "@/data/siteData";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "@/styles/partners.css";

export default function Partners() {
  const site = useSite();
  const list = site.partners?.length
    ? site.partners.map((p) => ({ name: p.name, logo: assetUrl(p.logo) ?? undefined }))
    : IMAGES.partners;

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="section partners-section trusted-partners">
      <div className="container">
        <SectionTitle>Trusted Partners</SectionTitle>
        <div className="partners-slider-container">
          <button ref={prevRef} className="partners-prev" aria-label="Previous partner">‹</button>
          <button ref={nextRef} className="partners-next" aria-label="Next partner">›</button>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={18}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="partners-swiper"
          >
            {list.map(({ name, logo }) => (
              <SwiperSlide key={name}>
                <div className="partner-card">
                  <ImageSlot className="partner-logo" src={logo} alt={`${name} logo`} label={name} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
