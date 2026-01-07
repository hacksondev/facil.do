'use client'

/**
 * Componente WaitlistForm - DaisyUI + Facil Design
 *
 * Formulario de captura de leads con validación.
 */

import { useState, FormEvent, useEffect, forwardRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  submitWaitlist,
  resetWaitlistState,
  selectWaitlistStatus,
  selectWaitlistError,
  selectWaitlistSuccess,
  WaitlistFormData,
} from '../store/waitlistSlice'

const businessTypes = [
  { value: '', label: 'Selecciona el tipo de negocio' },
  { value: 'retail', label: 'Comercio / Retail' },
  { value: 'servicios', label: 'Servicios profesionales' },
  { value: 'restaurante', label: 'Restaurante / Food service' },
  { value: 'tecnologia', label: 'Tecnología / Software' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'transporte', label: 'Transporte / Logística' },
  { value: 'salud', label: 'Salud / Farmacia' },
  { value: 'educacion', label: 'Educación' },
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'otro', label: 'Otro' },
]

const initialFormState: WaitlistFormData = {
  company_name: '',
  contact_name: '',
  email: '',
  business_type: '',
}

interface FormErrors {
  company_name?: string
  contact_name?: string
  email?: string
  business_type?: string
}

const WaitlistForm = forwardRef<HTMLDivElement>((_, ref) => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectWaitlistStatus)
  const serverError = useAppSelector(selectWaitlistError)
  const successMessage = useAppSelector(selectWaitlistSuccess)

  const [formData, setFormData] = useState<WaitlistFormData>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (status === 'success') {
      setFormData(initialFormState)
      setTouched({})
    }
  }, [status])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.company_name.trim()) newErrors.company_name = 'Requerido'
    if (!formData.contact_name.trim()) newErrors.contact_name = 'Requerido'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) newErrors.email = 'Requerido'
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.business_type) newErrors.business_type = 'Selecciona una opción'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ company_name: true, contact_name: true, email: true, business_type: true })
    if (!validateForm()) return
    dispatch(submitWaitlist(formData))
  }

  // Success state
  if (status === 'success') {
    return (
      <section ref={ref} className="section relative overflow-hidden" id="waitlist">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-custom relative">
          <div className="card bg-base-100 max-w-lg mx-auto shadow-xl">
            <div className="card-body text-center">
              {/* Success icon */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold">¡Tu cupo está separado!</h3>
              <p className="text-base-content/70">{successMessage}</p>

              {/* Social share */}
              <div className="divider">Comparte</div>
              <div className="flex justify-center gap-2">
                {['whatsapp', 'linkedin', 'twitter'].map((social) => (
                  <button key={social} className="btn btn-circle btn-ghost">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'whatsapp' && <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />}
                      {social === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                      {social === 'twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
                    </svg>
                  </button>
                ))}
              </div>

              <button onClick={() => dispatch(resetWaitlistState())} className="btn btn-ghost btn-sm mt-4">
                Registrar otra empresa
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Form
  return (
    <section ref={ref} className="section relative overflow-hidden" id="waitlist">
      <div className="absolute inset-0" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-10 left-[5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-[5%] w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="badge badge-primary badge-outline mb-4">Separa tu cupo</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Recibe acceso primero</h2>
            <p className="text-base-content/70">Sé de los primeros en acceder. Sin compromisos.</p>
          </div>

          {/* Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Server Error */}
              {status === 'error' && serverError && (
                <div className="alert alert-error mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Company Name */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Nombre de la empresa</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Mi Empresa SRL"
                    className={`input input-bordered w-full ${touched.company_name && errors.company_name ? 'input-error' : ''}`}
                  />
                  {touched.company_name && errors.company_name && (
                    <label className="label"><span className="label-text-alt text-error">{errors.company_name}</span></label>
                  )}
                </div>

                {/* Contact Name */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Nombre del contacto</span>
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Juan Pérez"
                    className={`input input-bordered w-full ${touched.contact_name && errors.contact_name ? 'input-error' : ''}`}
                  />
                  {touched.contact_name && errors.contact_name && (
                    <label className="label"><span className="label-text-alt text-error">{errors.contact_name}</span></label>
                  )}
                </div>

                {/* Email */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Email corporativo</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="contacto@miempresa.com"
                    className={`input input-bordered w-full ${touched.email && errors.email ? 'input-error' : ''}`}
                  />
                  {touched.email && errors.email && (
                    <label className="label"><span className="label-text-alt text-error">{errors.email}</span></label>
                  )}
                </div>

                {/* Business Type */}
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text font-medium">Tipo de negocio</span>
                  </label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`select select-bordered w-full ${touched.business_type && errors.business_type ? 'select-error' : ''}`}
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {touched.business_type && errors.business_type && (
                    <label className="label"><span className="label-text-alt text-error">{errors.business_type}</span></label>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className={`btn btn-primary w-full ${status === 'loading' ? 'loading' : ''}`} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Procesando...' : (
                    <>
                      Contactame
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-base-content/50 mt-4">
                Nunca compartiremos tu información con terceros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

WaitlistForm.displayName = 'WaitlistForm'
export default WaitlistForm
