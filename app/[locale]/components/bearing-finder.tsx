'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslate } from '@/lib/i18n-client'

type FinderResult = {
  brand: string
  partNumber: string
  equivalents: string[]
  notes: string
}

type SampleRule = {
  id: string
  od: string
  width: string
  type: string
  key: string
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : []
}

function safeRecord<T>(value: unknown): Record<string, T> {
  return (value && typeof value === 'object' && !Array.isArray(value)) ? value as Record<string, T> : {}
}

export default function BearingFinder() {
  const { t, locale } = useTranslate()
  const [id, setId] = useState('')
  const [od, setOd] = useState('')
  const [width, setWidth] = useState('')
  const [bearingType, setBearingType] = useState('')
  const [result, setResult] = useState<FinderResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isFormValid = useMemo(() => id && od && width && bearingType, [id, od, width, bearingType])

  const bearingTypes = useMemo(
    () => safeArray<{ value: string; label: string }>(t('landing.bearingFinder.types', { returnObjects: true })),
    [locale, t]
  )

  const sampleRules = useMemo<SampleRule[]>(
    () => [
      { id: '25', od: '52', width: '15', type: 'deep-groove-ball', key: 'rule6205' },
      { id: '80', od: '140', width: '26', type: 'single-row-angular-contact', key: 'rule7016' },
    ],
    []
  )

  const sampleOutputs = useMemo(
    () => safeRecord<FinderResult>(t('landing.bearingFinder.sampleOutputs', { returnObjects: true })),
    [locale, t]
  )

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!isFormValid) {
      setError(t('landing.bearingFinder.errors.incomplete'))
      setResult(null)
      return
    }

    const matchedRule = sampleRules.find(
      (rule) =>
        rule.id === id.trim() &&
        rule.od === od.trim() &&
        rule.width === width.trim() &&
        rule.type === bearingType
    )

    if (matchedRule) {
      const lookup = sampleOutputs[matchedRule.key]
      if (lookup) {
        setResult(lookup)
        return
      }
    }

    setError(t('landing.bearingFinder.errors.noMatch'))
    setResult(null)
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900">{t('landing.bearingFinder.toolTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder={t('landing.bearingFinder.inputs.id')}
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder={t('landing.bearingFinder.inputs.od')}
              value={od}
              onChange={(event) => setOd(event.target.value)}
            />
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder={t('landing.bearingFinder.inputs.width')}
              value={width}
              onChange={(event) => setWidth(event.target.value)}
            />
            <Select value={bearingType} onValueChange={setBearingType}>
              <SelectTrigger>
                <SelectValue placeholder={t('landing.bearingFinder.inputs.type')} />
              </SelectTrigger>
              <SelectContent>
                {bearingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={!isFormValid}>
              {t('landing.bearingFinder.cta')}
            </Button>
            <span className="text-xs text-slate-500">{t('landing.bearingFinder.disclaimer')}</span>
          </div>
        </form>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {result.brand}
              </Badge>
              <p className="text-lg font-semibold text-slate-900">{result.partNumber}</p>
            </div>
            <p className="mt-3 text-sm text-slate-600">{result.notes}</p>
            <div className="mt-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{t('landing.bearingFinder.equivalentLabel')}</span>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {safeArray<string>(result.equivalents).map((reference) => (
                  <li key={reference}>{reference}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
