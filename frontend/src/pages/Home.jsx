import { useState } from "react";
import {
  ShieldCheckIcon,
  LockIcon,
  FlagIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

import MeetCard from "../components/MeetCard";
import MeetsMap from "../components/MeetsMap";
import HeroBanner from "../components/HeroBanner";
import { useMeet } from "../hooks/useMeets";

const INFO = [
  {
    icon: FlagIcon,
    t: "Hosted meets",
    d: "Hosts and admins publish date, time and exact location.",
  },
  {
    icon: ShieldCheckIcon,
    t: "RC verified rides",
    d: "Registration checked against the government registry.",
  },
  {
    icon: LockIcon,
    t: "Private passes",
    d: "Paid, capped guest lists for exclusive garage nights.",
  },
];

const MEETS_PER_PAGE = 6;

function Home() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useMeet({page, limit: MEETS_PER_PAGE});

  const meets = data?.data ?? [];
  console.log(data,"===data");

  const currentPage = data?.meta.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= totalPages &&
      newPage !== page
    ) {
      setPage(newPage);

      // Optional: scroll back to meet section
      document
        .getElementById("meet-cards")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };

  return (
    <main className="relative w-full overflow-x-hidden bg-black">

      {/*  HERO  */}
      <section className="relative z-0 h-[70vh] min-h-[500px] overflow-hidden sm:h-[75vh] lg:h-[78vh]">
        <HeroBanner />
      </section>

      {/*  INFO  */}
      <section className="mb-10 border-y border-white/10 bg-[#141414] px-4 sm:mb-14 sm:px-6 lg:px-8">
        <div
          className="
            mx-auto grid max-w-7xl
            grid-cols-1
            gap-8
            py-12
            sm:grid-cols-2
            sm:gap-10
            sm:py-14
            lg:grid-cols-3
            lg:gap-12
            lg:py-20
          "
        >
          {INFO.map(({ icon: Icon, t, d }) => (
            <div
              key={t}
              className="flex items-start gap-4"
            >
              <div className="shrink-0">
                <Icon
                  size={30}
                  weight="bold"
                  className="text-[#E21D48] sm:size-[32px]"
                />
              </div>

              <div>
                <h3
                  className="
                    mb-2
                    text-base
                    font-bold
                    uppercase
                    tracking-wide
                    text-white
                    sm:text-lg
                    lg:text-xl
                  "
                >
                  {t}
                </h3>

                <p className="text-sm leading-6 text-white/70 sm:text-base">
                  {d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*  MEETS */}
      <section
        id="meet-cards"
        className="w-full px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mb-6 sm:mb-8">
            <p
              className="
                mb-2
                text-xs
                uppercase
                tracking-[0.3em]
                text-red-600
                sm:text-sm
                sm:tracking-[0.35em]
              "
            >
              On the calendar
            </p>

            <h2
              className="
                text-3xl
                font-black
                uppercase
                leading-tight
                text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              Upcoming meets
            </h2>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: MEETS_PER_PAGE }).map((_, index) => (
                <div
                  key={index}
                  className="h-[400px] animate-pulse rounded-lg bg-white/10"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <p className="text-white/70">
                Failed to load meets.
              </p>
            </div>
          )}

          {/* Meets */}
          {!isLoading && !isError && (
            <>
              {meets.length > 0 ? (
                <div
                  className={`
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    lg:grid-cols-3
                    lg:gap-6
                    ${isFetching ? "opacity-60 transition-opacity" : ""}
                  `}
                >
                  {meets.map((meet) => (
                    <MeetCard
                      key={meet.id}
                      meet={meet}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center border border-white/10 bg-white/5">
                  <p className="text-white/70">
                    No upcoming meets found.
                  </p>
                </div>
              )}

              {/* ================= PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2 sm:mt-12">

                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isFetching}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      border
                      border-white/10
                      text-white
                      transition-colors
                      hover:border-[#E21D48]
                      hover:text-[#E21D48]
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                    aria-label="Previous page"
                  >
                    <CaretLeftIcon size={18} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() =>
                          handlePageChange(pageNumber)
                        }
                        disabled={isFetching}
                        className={`
                          flex
                          h-10
                          min-w-10
                          items-center
                          justify-center
                          border
                          px-3
                          text-sm
                          transition-colors

                          ${
                            currentPage === pageNumber
                              ? "border-[#E21D48] bg-[#E21D48] text-white"
                              : "border-white/10 text-white/70 hover:border-[#E21D48] hover:text-[#E21D48]"
                          }

                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        `}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={
                      page === totalPages ||
                      isFetching
                    }
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      border
                      border-white/10
                      text-white
                      transition-colors
                      hover:border-[#E21D48]
                      hover:text-[#E21D48]
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                    aria-label="Next page"
                  >
                    <CaretRightIcon size={18} />
                  </button>

                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section
        id="map"
        className="w-full px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8"
      >
        <div className="mx-auto max-w-7xl py-6 sm:py-8 lg:py-10">

          <h2
            className="
              mb-6
              text-3xl
              font-black
              uppercase
              leading-tight
              text-white
              sm:mb-8
              sm:text-4xl
              lg:text-5xl
            "
          >
            Meet Map
          </h2>

          <div className="w-full overflow-hidden rounded-lg">
            <MeetsMap />
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;