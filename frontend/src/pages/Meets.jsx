import { useState } from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

import MeetCard from "../components/MeetCard";
import MeetsMap from "../components/MeetsMap";
import { useMeet } from "../hooks/useMeets";

const limit = 4;

function Meets() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useMeet({page, limit});


  const meets = data?.data ?? [];
  
   const currentPage = data?.meta.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);

    // Scroll to top of meet cards after changing page
    document
      .getElementById("meet-list")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading meets...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-red-500">
        Failed to load meets.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black pb-12">
      {/* ================= HEADER ================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-extralight uppercase tracking-[0.35em] text-red-600 sm:text-sm">
            Schedule
          </p>

          <h1 className="text-3xl font-extrabold uppercase text-white sm:text-4xl md:text-5xl">
            Car Meets
          </h1>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section
        id="meet-list"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8"
      >
        {/* ================= MEETS ================= */}
        <div className="lg:col-span-3">
          {meets.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center border border-white/10 bg-[#141414]">
              <p className="text-white/60">
                No meets found.
              </p>
            </div>
          ) : (
            <>
              <div
                className={`
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                  ${isFetching ? "opacity-60" : "opacity-100"}
                  transition-opacity duration-200
                `}
              >
                {meets.map((meet) => (
                  <MeetCard
                    meet={meet}
                    key={meet.id}
                  />
                ))}
              </div>

              {/* ================= PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(page - 1)
                    }
                    disabled={
                      currentPage === 1 ||
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
                      hover:border-red-500
                      hover:text-red-500
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                    aria-label="Previous page"
                  >
                    <CaretLeftIcon size={18} />
                  </button>

                  {/* Page Numbers */}
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
                        disabled:cursor-not-allowed

                        ${
                          currentPage === pageNumber
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-white/10 text-white hover:border-red-500 hover:text-red-500"
                        }
                      `}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(page + 1)
                    }
                    disabled={
                      currentPage === totalPages ||
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
                      hover:border-red-500
                      hover:text-red-500
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

        {/* ================= MAP ================= */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <MeetsMap />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Meets;