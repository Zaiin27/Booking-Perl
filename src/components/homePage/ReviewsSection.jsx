import React from "react";
import { FaStar } from "react-icons/fa";
import ChRoseImg from "../../assets/images/ch-rose.jpg";
import SarahJImg from "../../assets/images/sarah-j.png";
import DavidRImg from "../../assets/images/David-r.png";
import reviewbg from "../../assets/images/reviewbg.png";


const ReviewsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Christine Rose",
      location: "",
      avatar: ChRoseImg,
      testimonial:
        "The product exceeded my expectations in both quality and design. Delivery was on time and the packaging was secure. Overall, a great shopping experience—highly recommended!",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Sarah J.",
      location: "Austin, TX",
      avatar: SarahJImg,
      testimonial:
        "At first I was skeptical, but the savings are real. Paying with $FORK has cut my delivery costs by more than half, and the meals are just as great.",
      rating: 4.5,
    },
    {
      id: 3,
      name: "David R.",
      location: "Chicago",
      avatar: DavidRImg,
      testimonial:
        "Forkward makes eating out affordable. I've saved money on my weekly orders, and the service is excellent. Definitely recommending this to friends!",
      rating: 4.5,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      const isHalfFilled = !isFilled && starValue - 0.5 <= rating;

      return (
        <svg
          key={index}
          className="text-lg w-5 h-5"
          viewBox="0 0 24 24"
          fill={isFilled ? "#F29D00" : "none"}
          stroke="#F29D00"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isHalfFilled ? (
            <>
              <defs>
                <linearGradient id={`halfStar-${index}`}>
                  <stop offset="50%" stopColor="#F29D00" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={`url(#halfStar-${index})`}
              />
            </>
          ) : (
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          )}
        </svg>
      );
    });
  };

  return (
    <section
      id="reviews"
      className="pt-32 pb-20 relative overflow-hidden"
      style={{
        background: `url(${reviewbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* CUSTOMER TESTIMONIALS Label */}
          <div
            className="inline-flex items-center px-4 py-2 mb-6 rounded-full relative "
            style={{
              background:
                "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(153, 69, 255, 0.3) 0%, rgba(20, 241, 149, 0.3) 100%)",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                padding: "1px",
              }}
            ></div>
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-sm font-inter font-medium">
              CUSTOMER TESTIMONIALS
            </span>
          </div>

          <h2 className="text-4xl lg:text-[32px] font-inter !font-bold text-white mb-4">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonial Cards - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl p-6 border border-[#FFFFFF3B]"
              style={{
                background: "#FFFFFF33",
                backdropFilter: "blur(1px)",
              }}
            >
              <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 shadow-lg">
                {/* Decorative Quote Icon */}
                <div className="absolute bottom-4 right-4">
                  <svg
                    width="35"
                    height="24"
                    viewBox="0 0 35 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.4">
                      <g clipPath="url(#clip0_540_187138)">
                        <path
                          d="M14.3785 7.37377C14.3783 5.94396 13.91 4.55353 13.0453 3.41485C12.1805 2.27617 10.9668 1.45185 9.58956 1.06778C8.2123 0.683724 6.74717 0.761038 5.41798 1.28792C4.08878 1.8148 2.96859 2.76229 2.22849 3.98565C1.4884 5.20902 1.16909 6.64101 1.31934 8.0629C1.46959 9.4848 2.08114 10.8184 3.06058 11.8601C4.04001 12.9018 5.3335 13.5942 6.74346 13.8316C8.15342 14.0691 9.60234 13.8385 10.8689 13.175C10.4312 14.7989 9.8138 16.1589 9.07485 17.244C7.59694 19.4178 5.66069 20.4692 3.62155 20.4692C3.24943 20.4692 2.89255 20.617 2.62942 20.8801C2.3663 21.1432 2.21847 21.5001 2.21847 21.8722C2.21847 22.2444 2.36629 22.6012 2.62942 22.8644C2.89255 23.1275 3.24943 23.2753 3.62155 23.2753C6.74761 23.2753 9.49016 21.6234 11.3965 18.8229C13.286 16.0429 14.3785 12.1199 14.3785 7.37377Z"
                          fill="url(#paint0_linear_540_187138)"
                        />
                      </g>
                      <g clipPath="url(#clip1_540_187138)">
                        <path
                          d="M34.57 7.37475C34.5698 5.94494 34.1015 4.5545 33.2368 3.41582C32.3721 2.27715 31.1584 1.45282 29.7811 1.06876C28.4038 0.6847 26.9387 0.762015 25.6095 1.2889C24.2803 1.81578 23.1601 2.76326 22.42 3.98663C21.6799 5.20999 21.3606 6.64199 21.5109 8.06388C21.6611 9.48578 22.2727 10.8194 23.2521 11.8611C24.2315 12.9027 25.525 13.5952 26.935 13.8326C28.3449 14.07 29.7939 13.8394 31.0604 13.176C30.6227 14.7998 30.0053 16.1599 29.2664 17.2449C27.7885 19.4188 25.8522 20.4701 23.8131 20.4701C23.441 20.4701 23.0841 20.618 22.821 20.8811C22.5578 21.1442 22.41 21.5011 22.41 21.8732C22.41 22.2453 22.5578 22.6022 22.821 22.8653C23.0841 23.1285 23.441 23.2763 23.8131 23.2763C26.9391 23.2763 29.6817 21.6244 31.588 18.8239C33.4775 16.0439 34.57 12.1209 34.57 7.37475Z"
                          fill="url(#paint1_linear_540_187138)"
                        />
                      </g>
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_540_187138"
                        x1="1.28308"
                        y1="12.0512"
                        x2="14.3785"
                        y2="12.0512"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9945FF" />
                        <stop offset="1" stopColor="#14F195" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_540_187138"
                        x1="21.4746"
                        y1="12.0522"
                        x2="34.57"
                        y2="12.0522"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9945FF" />
                        <stop offset="1" stopColor="#14F195" />
                      </linearGradient>
                      <clipPath id="clip0_540_187138">
                        <rect
                          width="13.6886"
                          height="22.8143"
                          fill="white"
                          transform="translate(0.986328 0.643555)"
                        />
                      </clipPath>
                      <clipPath id="clip1_540_187138">
                        <rect
                          width="13.6886"
                          height="22.8143"
                          fill="white"
                          transform="translate(21.1777 0.644531)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                {/* Testimonial Content */}
                <div className="relative z-10">
                  {/* Customer Info - Top Left */}
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 className="font-inter !font-semibold text-[#0E1317] text-md">
                        {testimonial.name}
                        {testimonial.location && (
                          <span className="text-[#0E1317] font-inter !font-semibold text-md">
                            {" "}
                            - {testimonial.location}
                          </span>
                        )}
                      </h4>
                      <p className="text-[#34AD54] font-inter font-semibold text-xs uppercase tracking-wide">
                        CUSTOMER
                      </p>
                    </div>
                  </div>

                  {/* Testimonial Text - Center */}
                  <p className="text-[#374151] font-inter text-xs leading-relaxed mb-6">
                    "{testimonial.testimonial}"
                  </p>

                  {/* Rating - Bottom Left */}
                  <div className="flex items-center">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
