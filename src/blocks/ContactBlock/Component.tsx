'use client'

import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'
import type {
  ContactBlock as ContactBlockProps,
  Form,
} from '@/payload-types'

import {
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import type { FieldValues, SubmitHandler } from 'react-hook-form'

import { fields } from '@/blocks/Form/fields'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

const iconMap = {
  clock: Clock,
  facebook: Facebook,
  globe: Globe,
  linkedin: Linkedin,
  mail: Mail,
  mapPin: MapPin,
  phone: Phone,
  twitter: Twitter,
  instagram: Instagram,
} as const

export const ContactBlock: React.FC<ContactBlockProps> = (props) => {
  const { contactDetails, description, eyebrow, form: formFromProps, heading, mapEmbedUrl } =
    props

  const form =
  formFromProps && typeof formFromProps === 'object'
    ? (formFromProps as Form)
    : undefined

  return (
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        {/* Info column */}
        <div>
          {eyebrow && (
            <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {eyebrow}
            </span>
          )}

          <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-brand-ink mb-4">
            {heading}
          </h2>

          {description && (
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-[36rem]">
              {description}
            </p>
          )}

          {contactDetails && contactDetails.length > 0 && (
            <ul className="space-y-5 mb-8">
              {contactDetails.map((detail, index) => {
                const Icon = iconMap[detail.icon as keyof typeof iconMap] ?? MapPin
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                        {detail.label}
                      </span>
                      <span className="block text-foreground font-medium">{detail.value}</span>
                    </span>
                  </>
                )

                return (
                  <li key={index} className="flex items-start gap-4">
                    {detail.link ? (
                      <a
                        href={detail.link}
                        className="flex items-start gap-4 group"
                        target={detail.link.startsWith('http') ? '_blank' : undefined}
                        rel={detail.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {mapEmbedUrl && (
            <div className="overflow-hidden rounded-xl border border-brand-line aspect-[4/3] lg:aspect-[16/11]">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office location"
              />
            </div>
          )}
        </div>

        {/* Form column */}
        <div className="rounded-2xl border border-brand-line bg-card p-6 md:p-8 shadow-sm">
          {form ? (
            <ContactFormPanel form={form} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Select a form in the admin panel to display it here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const ContactFormPanel: React.FC<{ form: Form }> = ({ form }) => {
  const { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = form

  const formMethods = useForm({
    defaultValues: {},
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
  (data) => {
    let loadingTimerID: ReturnType<typeof setTimeout>

    const submitForm = async () => {
      setError(undefined)

      const dataToSend = Object.entries(data).map(([name, value]) => ({
        field: name,
        value,
      }))

      loadingTimerID = setTimeout(() => {
        setIsLoading(true)
      }, 1000)

      try {
        const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
          body: JSON.stringify({
            form: formID,
            submissionData: dataToSend,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        const res = await req.json()

        clearTimeout(loadingTimerID)

        if (req.status >= 400) {
          setIsLoading(false)
          setError({
            message: res.errors?.[0]?.message || 'Internal Server Error',
            status: res.status,
          })
          return
        }

        setIsLoading(false)
        setHasSubmitted(true)

        if (confirmationType === 'redirect' && redirect?.url) {
          router.push(redirect.url)
        }
      } catch (err) {
        console.warn(err)
        setIsLoading(false)
        setError({
          message: 'Something went wrong.',
        })
      }
    }

    void submitForm()
  },
  [router, formID, redirect, confirmationType],
)

  return (
    <FormProvider {...formMethods}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <div className="text-center py-6">
          <p className="font-display text-xl text-brand-ink">Thank you!</p>
          <p className="text-muted-foreground text-sm mt-2">
            Your message has been sent — we&apos;ll be in touch shortly.
          </p>
        </div>
      )}

      {isLoading && !hasSubmitted && (
        <p className="text-muted-foreground text-sm">Sending your message…</p>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-error bg-error/10 px-4 py-3 text-sm text-error">
          {`${error.status || '500'}: ${error.message || ''}`}
        </div>
      )}

      {!hasSubmitted && (
        <form id={String(formID)} onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 last:mb-0">
            {form.fields?.map((field, index) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
              if (!Field) return null
              return (
                <div className="mb-5 last:mb-0" key={index}>
                  <Field
                    form={form}
                    {...field}
                    {...formMethods}
                    control={control}
                    errors={errors}
                    register={register}
                  />
                </div>
              )
            })}
          </div>

          <Button className={cn('w-full md:w-auto')} form={String(formID)} type="submit" variant="default">
            {submitButtonLabel || 'Send Message'}
          </Button>
        </form>
      )}
    </FormProvider>
  )
}
