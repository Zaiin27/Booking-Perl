import React, { useState } from "react";
import { BiHelpCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useScrapeUberEatsOrderMutation } from "../../services/Api";
import { useGetSiteSettingsQuery } from "../../services/admin/adminApi";
import { toastUtils } from "../../utils/toastUtils";
import { getServiceStatus } from "../../utils/serviceAvailability";

const LinkInputSection = () => {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [scrapeUberEatsOrder, { isLoading: isScraping }] = useScrapeUberEatsOrderMutation();
  
  const { data: siteSettings } = useGetSiteSettingsQuery();
  const serviceStatus = getServiceStatus(siteSettings);
  const isServiceActive = serviceStatus.isAvailable;

  const handleFetchOrder = async () => {
    // Check if user is verified
    if (!user?.isVerified) {
      toastUtils.error("Please verify your account to access this resource");
      return;
    }

    if (!link.trim()) {
      toastUtils.error("Please enter a valid cart link");
      return;
    }

    try {
      const url = new URL(link);
      
      if (!url.hostname.includes('uber.com') && !url.hostname.includes('eats.uber.com')) {
        toastUtils.error("Please enter a valid Uber Eats group order link");
        return;
      }
    } catch (error) {
      toastUtils.error("Please enter a valid URL");
      return;
    }

    const loadingToast = toastUtils.loading("Fetching your order details...");

    try {
      const requestData = {
        url: link
      };
      
      const result = await scrapeUberEatsOrder(requestData);

      toastUtils.dismiss(loadingToast);

      if (result.data) {
        toastUtils.success("Order details fetched successfully!");
        
        navigate('/order-now', { 
          state: { 
            scrapedData: result.data,
            fromProfile: true 
          } 
        });
      } else if (result.error) {
        console.log("Scraping error:", result.error);
        let errorMessage = "Failed to fetch order details. Please try again.";
        
        if (result.error.status === 401) {
          errorMessage = "Authentication required. Please login again.";
        } else if (result.error.data?.message) {
          errorMessage = result.error.data.message;
        } else if (result.error.data?.error) {
          errorMessage = result.error.data.error;
        } else if (result.error.status === 404) {
          errorMessage = "Order not found. Please check your link and try again.";
        } else if (result.error.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (result.error.status === 'FETCH_ERROR') {
          errorMessage = "Network error. Please check your connection.";
        }
        
        toastUtils.error(errorMessage);
      }
    } catch (error) {
      toastUtils.dismiss(loadingToast);
      
      let errorMessage = "Network error. Please try again.";
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toastUtils.error(errorMessage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div
        className="rounded-3xl p-4 border border-[#FFFFFF3B] w-full"
        style={{
          background: "#FFFFFF33",
          backdropFilter: "blur(1px)",
          boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
        }}
      >
        <div className="bg-white rounded-xl p-6">
          {/* Instructions */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-[#111827] mb-8">
              Paste your link to save upto 70% instantly!
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-[#6B7280] font-inter font-medium text-lg">
                Add your Cart Link
              </span>
              <BiHelpCircle className="text-[#E33629] w-4 h-4" />
            </div>
          </div>

          {/* Input Section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                disabled={!isServiceActive}
                className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#374151] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9945FF] focus:border-[#9945FF] font-inter transition-colors ${
                  !isServiceActive ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Refresh Button */}
            <button 
              disabled={!isServiceActive}
              className={`w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center transition-colors ${
                !isServiceActive 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <svg
                width="27"
                height="20"
                viewBox="0 0 27 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.90622 6.866C6.17814 6.93905 6.40996 7.11704 6.55074 7.36089C6.69153 7.60473 6.72976 7.89449 6.65705 8.1665C6.29445 9.51977 6.34129 10.9502 6.79166 12.2768C7.24203 13.6034 8.07569 14.7667 9.18721 15.6196C10.2987 16.4724 11.6382 16.9764 13.0362 17.068C14.4342 17.1595 15.828 16.8344 17.0412 16.1338C17.1621 16.0641 17.2956 16.0188 17.434 16.0006C17.5725 15.9825 17.7131 15.9917 17.8479 16.0279C17.9828 16.0641 18.1092 16.1264 18.2199 16.2115C18.3306 16.2965 18.4235 16.4025 18.4933 16.5234C18.5631 16.6443 18.6083 16.7778 18.6265 16.9162C18.6447 17.0547 18.6354 17.1953 18.5992 17.3301C18.5631 17.465 18.5007 17.5914 18.4157 17.7021C18.3306 17.8128 18.2246 17.9057 18.1037 17.9755C16.5263 18.8857 14.7145 19.3078 12.8973 19.1885C11.08 19.0691 9.33896 18.4137 7.89416 17.305C6.44935 16.1964 5.36567 14.6843 4.78009 12.9598C4.19452 11.2354 4.13334 9.37604 4.6043 7.61684C4.64046 7.48204 4.70282 7.35568 4.78783 7.24499C4.87283 7.13429 4.97881 7.04143 5.09971 6.97171C5.22061 6.90198 5.35407 6.85676 5.49245 6.83862C5.63083 6.82048 5.77143 6.82979 5.90622 6.866ZM8.89538 2.02384C10.4727 1.1129 12.2847 0.690216 14.1023 0.809235C15.9198 0.928254 17.6613 1.58363 19.1063 2.69248C20.5514 3.80132 21.6351 5.31382 22.2205 7.03866C22.8058 8.76349 22.8665 10.6232 22.3948 12.3825C22.3219 12.6549 22.1438 12.8872 21.8996 13.0283C21.6555 13.1693 21.3653 13.2076 21.0929 13.1348C20.8205 13.0619 20.5882 12.8837 20.4471 12.6396C20.306 12.3954 20.2677 12.1052 20.3406 11.8328C20.7022 10.4799 20.6548 9.0501 20.2042 7.72411C19.7537 6.39812 18.9202 5.2354 17.8092 4.38284C16.6982 3.53027 15.3594 3.02611 13.962 2.93403C12.5645 2.84195 11.1712 3.16609 9.95788 3.8655C9.71366 4.0064 9.42348 4.04451 9.15116 3.97145C8.87884 3.89839 8.6467 3.72014 8.5058 3.47592C8.3649 3.2317 8.32679 2.94151 8.39986 2.66919C8.47292 2.39688 8.65116 2.16473 8.89538 2.02384Z"
                  fill="url(#paint0_linear_831_6353)"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.60417 6.41571C4.80339 6.21674 5.07344 6.10498 5.35501 6.10498C5.63657 6.10498 5.90662 6.21674 6.10584 6.41571L9.64751 9.95738C9.7519 10.0547 9.83562 10.172 9.8937 10.3023C9.95177 10.4326 9.983 10.5733 9.98551 10.716C9.98803 10.8586 9.96179 11.0003 9.90835 11.1326C9.85491 11.2649 9.77537 11.3851 9.67448 11.486C9.57358 11.5869 9.4534 11.6664 9.3211 11.7199C9.1888 11.7733 9.0471 11.7996 8.90443 11.7971C8.76177 11.7945 8.62108 11.7633 8.49074 11.7052C8.36041 11.6472 8.24311 11.5634 8.14584 11.459L5.35501 8.66821L2.56417 11.459C2.36276 11.6467 2.09636 11.7489 1.8211 11.744C1.54584 11.7392 1.28321 11.6277 1.08854 11.433C0.893875 11.2383 0.782366 10.9757 0.777509 10.7005C0.772653 10.4252 0.874827 10.1588 1.06251 9.95738L4.60417 6.41571ZM17.3542 8.54071C17.5534 8.34174 17.8234 8.22998 18.105 8.22998C18.3866 8.22998 18.6566 8.34174 18.8558 8.54071L21.6467 11.3315L24.4375 8.54071C24.5348 8.43632 24.6521 8.35259 24.7824 8.29452C24.9127 8.23645 25.0534 8.20522 25.1961 8.20271C25.3388 8.20019 25.4805 8.22643 25.6128 8.27987C25.7451 8.33331 25.8653 8.41285 25.9661 8.51374C26.067 8.61463 26.1466 8.73482 26.2 8.86712C26.2535 8.99942 26.2797 9.14112 26.2772 9.28379C26.2747 9.42645 26.2434 9.56714 26.1854 9.69747C26.1273 9.82781 26.0436 9.94511 25.9392 10.0424L22.3975 13.584C22.1983 13.783 21.9282 13.8948 21.6467 13.8948C21.3651 13.8948 21.0951 13.783 20.8958 13.584L17.3542 10.0424C17.1552 9.84316 17.0434 9.57311 17.0434 9.29155C17.0434 9.00998 17.1552 8.73993 17.3542 8.54071Z"
                  fill="url(#paint1_linear_831_6353)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_831_6353"
                    x1="4.29102"
                    y1="9.99891"
                    x2="22.7089"
                    y2="9.99891"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#9945FF" />
                    <stop offset="1" stop-color="#14F195" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_831_6353"
                    x1="0.777344"
                    y1="9.99988"
                    x2="26.2773"
                    y2="9.99988"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#9945FF" />
                    <stop offset="1" stop-color="#14F195" />
                  </linearGradient>
                </defs>
              </svg>
            </button>

            {/* Fetch Order Button */}
            {!isServiceActive ? (
              <div className="px-8 py-3 bg-red-50 border border-red-200 rounded-full text-center">
                <div className="text-red-600 font-inter font-bold">
                  {serviceStatus.message}
                </div>
                {serviceStatus.showHoursLink && serviceStatus.hoursLink && (
                  <div className="text-red-600 font-inter text-sm mt-2">
                    {serviceStatus.hoursLink.includes('me.senew-tech.com') ? (
                      <>
                        Visit{' '}
                        <a 
                          href="https://me.senew-tech.com" 
                          className="underline hover:text-red-700" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          me.senew-tech.com
                        </a>
                        {' '}to check when we're open
                      </>
                    ) : (
                      serviceStatus.hoursLink
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleFetchOrder}
                disabled={isScraping}
                className="px-8 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-inter disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isScraping ? "FETCHING..." : "FETCH ORDER"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkInputSection;
