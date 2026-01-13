import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { TreatmentMenu } from '@/components/menu/TreatmentMenu'

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="py-16 bg-beige-50">
          <div className="container-spa">
            <div className="text-center mb-12">
              <h1 className="section-title">—TRATAMIENTOS—</h1>
              <p className="text-warm-gray mt-4 max-w-2xl mx-auto">
                Descubre nuestra amplia variedad de tratamientos diseñados para 
                renovar tu cuerpo y mente. Todos los precios no incluyen ITBM (7%).
              </p>
            </div>
            
            <TreatmentMenu />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
