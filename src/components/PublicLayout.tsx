import { useCallback, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { BookingModal } from "../features/booking/BookingModal";
import { Footer } from "./Footer";
import { Header } from "./Header";

type PublicLayoutContext = {
  openBooking: () => void;
};

export function PublicLayout() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = useCallback(() => setBookingOpen(true), []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);

  return (
    <>
      <Header onBook={openBooking} />
      <Outlet context={{ openBooking } satisfies PublicLayoutContext} />
      <Footer onBook={openBooking} />
      <BookingModal isOpen={bookingOpen} onClose={closeBooking} />
    </>
  );
}

export function usePublicLayout() {
  return useOutletContext<PublicLayoutContext>();
}
