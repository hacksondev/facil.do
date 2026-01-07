import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import supabaseService from '../../../services/supabaseService'

type Step =
  | 'company_info'
  | 'company_address'
  | 'owner'
  | 'expected_activity'
  | 'follow_up'

type SavePayload = {
  step: Step
  caseId?: string
  companyId?: string
  personId?: string
  data?: Record<string, any>
}

export const runtime = 'nodejs'

const isMissingColumnError = (err: any) =>
  err?.code === 'PGRST204' || (typeof err?.message === 'string' && err.message.includes('schema cache'))

export async function POST(req: NextRequest) {
  const supabaseAuth = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser()
  const userId = user?.id ?? null

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Falta SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
  }

  const supabase = supabaseService

  let body: SavePayload
  try {
    body = (await req.json()) as SavePayload
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const { step, caseId, companyId, personId, data = {} } = body

  if (!step) {
    return NextResponse.json({ error: 'Paso requerido' }, { status: 400 })
  }

  try {
    if (step === 'company_info') {
      const { companyName, rnc, country, phone, industry, description } = data

      if (!companyName || !rnc) {
        return NextResponse.json({ error: 'Faltan datos de empresa' }, { status: 400 })
      }

      let currentCompanyId = companyId

      if (currentCompanyId) {
        const updatePayload: Record<string, any> = {
          name: companyName,
          rnc,
          country: country || 'DO',
          phone,
          industry,
          updated_at: new Date().toISOString(),
        }
        if (userId) updatePayload.created_by = userId

        const { error: updateError } = await supabase
          .from('companies')
          .update(updatePayload)
          .eq('id', currentCompanyId)

        if (updateError) {
          if (isMissingColumnError(updateError)) {
            delete updatePayload.created_by
            const { error: retryError } = await supabase
              .from('companies')
              .update(updatePayload)
              .eq('id', currentCompanyId)
            if (retryError) throw retryError
          } else {
            throw updateError
          }
        }
      } else {
        const insertPayload: Record<string, any> = {
          name: companyName,
          rnc,
          country: country || 'DO',
          phone,
          industry,
          updated_at: new Date().toISOString(),
        }
        if (userId) insertPayload.created_by = userId

        let insertCompany
        let insertError
        ({ data: insertCompany, error: insertError } = await supabase
          .from('companies')
          .insert(insertPayload)
          .select('id')
          .single())

        if (insertError && isMissingColumnError(insertError)) {
          delete insertPayload.created_by
          const retry = await supabase.from('companies').insert(insertPayload).select('id').single()
          insertCompany = retry.data
          insertError = retry.error
        }

        if (insertError) throw insertError
        currentCompanyId = insertCompany.id
      }

      let currentCaseId = caseId
      if (currentCaseId) {
        const { error: updateCaseError } = await supabase
          .from('onboarding_cases')
          .update({ updated_at: new Date().toISOString(), user_id: userId })
          .eq('id', currentCaseId)

        if (updateCaseError) {
          if (isMissingColumnError(updateCaseError)) {
            const { error: retry } = await supabase
              .from('onboarding_cases')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', currentCaseId)
            if (retry) throw retry
          } else {
            throw updateCaseError
          }
        }
      } else if (currentCompanyId) {
        const casePayload: Record<string, any> = {
          company_id: currentCompanyId,
          status: 'collecting',
        }
        if (userId) casePayload.user_id = userId

        let caseRow
        let caseError
        ;({ data: caseRow, error: caseError } = await supabase
          .from('onboarding_cases')
          .insert(casePayload)
          .select('id')
          .single())

        if (caseError && isMissingColumnError(caseError)) {
          delete casePayload.user_id
          const retry = await supabase.from('onboarding_cases').insert(casePayload).select('id').single()
          caseRow = retry.data
          caseError = retry.error
        }

        if (caseError) throw caseError
        currentCaseId = caseRow.id
      }

      return NextResponse.json({ caseId: currentCaseId, companyId: currentCompanyId })
    }

    if (step === 'company_address') {
      if (!companyId) {
        return NextResponse.json({ error: 'Falta companyId' }, { status: 400 })
      }

      const { address, city, province, postalCode, country } = data

      const addressPayload: Record<string, any> = {
        company_id: companyId,
        address_line: address,
        city,
        province,
        postal_code: postalCode,
        country: country || 'DO',
      }
      if (userId) addressPayload.user_id = userId

      let insertError
      ;({ error: insertError } = await supabase.from('company_addresses').insert(addressPayload))

      if (insertError && isMissingColumnError(insertError)) {
        delete addressPayload.user_id
        const retry = await supabase.from('company_addresses').insert(addressPayload)
        insertError = retry.error
      }

      if (insertError) throw insertError

      return NextResponse.json({ caseId, companyId })
    }

    if (step === 'owner') {
      if (!companyId) {
        return NextResponse.json({ error: 'Falta companyId' }, { status: 400 })
      }

      const { ownerName, ownerId, pep, ownershipPct, livenessScore } = data

      let currentPersonId = personId

      if (currentPersonId) {
        const personUpdate: Record<string, any> = {
          full_name: ownerName,
          document_number: ownerId,
          pep: !!pep,
          liveness_score: livenessScore,
          updated_at: new Date().toISOString(),
        }
        if (userId) personUpdate.user_id = userId

        const { error: updatePersonError } = await supabase
          .from('persons')
          .update(personUpdate)
          .eq('id', currentPersonId)

        if (updatePersonError) {
          if (isMissingColumnError(updatePersonError)) {
            delete personUpdate.user_id
            const retry = await supabase.from('persons').update(personUpdate).eq('id', currentPersonId)
            if (retry.error) throw retry.error
          } else {
            throw updatePersonError
          }
        }
      } else {
        const personInsert: Record<string, any> = {
          full_name: ownerName,
          document_number: ownerId,
          pep: !!pep,
          liveness_score: livenessScore,
        }
        if (userId) personInsert.user_id = userId

        let personRow
        let insertPersonError
        ;({ data: personRow, error: insertPersonError } = await supabase
          .from('persons')
          .insert(personInsert)
          .select('id')
          .single())

        if (insertPersonError && isMissingColumnError(insertPersonError)) {
          delete personInsert.user_id
          const retry = await supabase.from('persons').insert(personInsert).select('id').single()
          personRow = retry.data
          insertPersonError = retry.error
        }

        if (insertPersonError) throw insertPersonError
        currentPersonId = personRow.id
      }

      const ownerPayload: Record<string, any> = {
        company_id: companyId,
        person_id: currentPersonId,
        ownership_pct: ownershipPct ? Number(ownershipPct) : 0,
        is_ubo: true,
      }
      if (userId) ownerPayload.user_id = userId

      const doInsertOwner = async (payload: Record<string, any>) =>
        supabase.from('owners').insert(payload).select('id').single()

      // Prefer upsert si existe constraint; si no, caer a insert
      const { error: ownerError } = await supabase
        .from('owners')
        .upsert(ownerPayload, { onConflict: 'company_id,person_id' })

      if (ownerError) {
        if (isMissingColumnError(ownerError) || ownerError.code === '42P10') {
          // sin constraint único; intentar insert
          const retryPayload = { ...ownerPayload }
          if (retryPayload.user_id && isMissingColumnError(ownerError)) {
            delete retryPayload.user_id
          }
          const { error: retryInsert, data: retryData } = await doInsertOwner(retryPayload)
          if (retryInsert && retryInsert.code !== '23505') {
            throw retryInsert
          }
          // si 23505 (duplicado), lo ignoramos
        } else if (ownerError.code === '23505') {
          // duplicado permitido
        } else {
          throw ownerError
        }
      }

      return NextResponse.json({ caseId, companyId, personId: currentPersonId })
    }

    if (step === 'expected_activity') {
      if (!companyId) {
        return NextResponse.json({ error: 'Falta companyId' }, { status: 400 })
      }
      const { monthlyVolume, countries, fundingSource, notes } = data

      const { error: insertError } = await supabase.from('expected_activity').insert({
        company_id: companyId,
        monthly_volume: monthlyVolume,
        countries,
        funding_source: fundingSource,
        notes,
        user_id: userId,
      })

      if (insertError && isMissingColumnError(insertError)) {
        const { error: retry } = await supabase.from('expected_activity').insert({
          company_id: companyId,
          monthly_volume: monthlyVolume,
          countries,
          funding_source: fundingSource,
          notes,
        })
        if (retry) throw retry
      } else if (insertError) {
        throw insertError
      }

      return NextResponse.json({ caseId, companyId, personId })
    }

    if (step === 'follow_up') {
      if (!caseId) {
        return NextResponse.json({ error: 'Falta caseId' }, { status: 400 })
      }
      const { additionalInfo } = data

      const { error: updateError } = await supabase
        .from('onboarding_cases')
        .update({
          status: 'pending_review',
          decision_reason: additionalInfo,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseId)

      if (updateError) throw updateError

      // Crear cuenta corriente inicial al finalizar onboarding
      if (companyId) {
        const accountPayload: Record<string, any> = {
          company_id: companyId,
          type: 'checking',
          currency: 'DOP',
          number: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          alias: 'Cuenta Corriente',
          balance: 0,
          status: 'pending_activation',
          limits_daily: 0,
          limits_monthly: 0,
        }
        const { error: accountError } = await supabase.from('accounts').insert(accountPayload)
        if (accountError && accountError.code !== '23505') {
          console.error('Error creando cuenta inicial:', accountError)
        }
      }

      return NextResponse.json({ caseId, companyId, personId })
    }

    return NextResponse.json({ error: 'Paso no soportado' }, { status: 400 })
  } catch (err: any) {
    console.error('Error guardando onboarding:', err)
    return NextResponse.json(
      { error: 'No se pudo guardar el avance. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}
