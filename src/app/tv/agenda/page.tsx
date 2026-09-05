import { TvAgendaClient } from './TvAgendaClient'

// ===========================================
// /tv/agenda?loc=1&token=... — therapist work-area TV display.
// Bookmark the full URL (with token) on the Android TV browser.
// ===========================================

export const metadata = {
  title: 'Agenda | Mimosa Spa',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function TvAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; token?: string; debug?: string }>
}) {
  const params = await searchParams
  const location = params.loc === '2' ? 2 : 1
  const token = params.token ?? ''

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f1e7] p-8 text-center text-xl text-[#7a6f5d]">
        Falta el token de acceso. Abra la URL completa: /tv/agenda?loc=1&token=…
      </div>
    )
  }

  return <TvAgendaClient location={location} token={token} debug={params.debug === '1'} />
}
