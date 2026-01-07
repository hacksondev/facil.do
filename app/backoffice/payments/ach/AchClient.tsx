'use client'

import { useRef } from 'react'
import { BackofficeShell, CardPanel } from '../../components'
import type { Company } from '../../utils'

type Ach = {
  id: string
  amount: number
  currency: string
  description: string | null
  status: string
  created_at: string
}

type Props = {
  companies: Company[]
  activeCompany: Company
  ach: Ach[]
}

export default function AchClient({ companies, activeCompany, ach }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const selectedRef = useRef<Ach | null>(null)

  const openModal = (item: Ach) => {
    selectedRef.current = item
    dialogRef.current?.showModal()
  }

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/payments"
      title="Autorizaciones ACH"
      subtitle="Pagos"
      actionLabel="Enviar dinero"
    >
      <CardPanel title="Transacciones pendientes">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Fecha</th>
                <th>Descripción</th>
                <th className="text-right">Monto</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ach.map((a) => (
                <tr key={a.id} className="cursor-pointer hover:bg-base-200" onClick={() => openModal(a)}>
                  <td className="text-sm text-base-content/70">{new Date(a.created_at).toLocaleDateString('es-DO')}</td>
                  <td className="font-medium">{a.description || 'ACH'}</td>
                  <td className="text-right font-semibold">
                    {a.currency} {Number(a.amount ?? 0).toFixed(2)}
                  </td>
                  <td className="text-right">
                    <span
                      className={`badge border ${
                        a.status === 'approved'
                          ? 'bg-success/10 text-success border-success/30'
                          : a.status === 'rejected'
                            ? 'bg-error/10 text-error border-error/30'
                            : 'bg-warning/10 text-warning border-warning/30'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {ach.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-base-content/60 py-4">
                    No hay transacciones pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardPanel>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-xl">
          <h3 className="font-semibold text-lg mb-2">Detalle de transacción ACH</h3>
          {selectedRef.current ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Monto:</span> {selectedRef.current.currency} {Number(selectedRef.current.amount ?? 0).toFixed(2)}</p>
              <p><span className="font-semibold">Descripción:</span> {selectedRef.current.description || 'N/D'}</p>
              <p><span className="font-semibold">Estado:</span> {selectedRef.current.status}</p>
            </div>
          ) : (
            <p className="text-sm text-base-content/60">Selecciona una transacción.</p>
          )}
          <div className="modal-action">
            <div className="flex gap-2">
              <button className="btn btn-ghost">Rechazar</button>
              <button className="btn btn-primary text-primary-content">Aprobar</button>
              <form method="dialog">
                <button className="btn">Cerrar</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </BackofficeShell>
  )
}
