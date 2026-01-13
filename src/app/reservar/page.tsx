import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { BookingWidget } from '@/components/booking/BookingWidget'

export default function ReservarPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <BookingWidget />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
