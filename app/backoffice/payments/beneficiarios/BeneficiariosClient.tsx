'use client'

import { useRef } from 'react'
import { BackofficeShell, CardPanel } from '../../components'
import type { Company } from '../../utils'
import BeneficiarioForm from './BeneficiarioForm'

type Beneficiary = {
  id: string
  name: string
  email: string | null
  bank_name: string | null
  account_number: string | null
  account_type: string | null
  currency: string
  status: string
  created_at: string
}

type Props = {
  companies: Company[]
  activeCompany: Company
  beneficiaries: Beneficiary[]
}

export default function BeneficiariosClient({ companies, activeCompany, beneficiaries }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/payments"
      title="Beneficiarios"
      subtitle="Pagos"
      actionLabel="Nuevo beneficiario"
    >
      <CardPanel title="Beneficiarios">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Nombre</th>
                <th>Banco</th>
                <th>Cuenta</th>
                <th className="text-right">Moneda</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-base-content/60">{b.email}</div>
                  </td>
                  <td className="text-sm text-base-content/70">{b.bank_name}</td>
                  <td className="text-sm text-base-content/70">{b.account_number}</td>
                  <td className="text-right text-sm font-semibold">{b.currency}</td>
                  <td className="text-right">
                    <span
                      className={`badge border ${
                        b.status === 'active'
                          ? 'bg-success/10 text-success border-success/30'
                          : b.status === 'pending'
                            ? 'bg-warning/10 text-warning border-warning/30'
                            : 'bg-error/10 text-error border-error/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {beneficiaries.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-base-content/60 py-4">
                    No hay beneficiarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardPanel>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-semibold text-lg mb-3">Nuevo beneficiario</h3>
          <BeneficiarioForm companyId={activeCompany.id} />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </BackofficeShell>
  )
}
