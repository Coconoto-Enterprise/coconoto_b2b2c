import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import FigmaNav from '../../components/figma/FigmaNav';
import FigmaFooter from '../../components/figma/FigmaFooter';
import ImageSlot from '../../components/figma/ImageSlot';
import { supabase } from '../../lib/supabase';
import { sendContactEmails } from '../../utils/vercelEmailService';

const DETAILS = [
  { icon: Mail, label: 'Email:', value: 'coconotoenterprise@gmail.com', href: 'mailto:coconotoenterprise@gmail.com' },
  { icon: Phone, label: 'Phone:', value: '+234 813 777 5689', href: 'tel:+2348137775689' },
  {
    icon: MapPin,
    label: 'Address:',
    value: 'No 67. Cele estate, mowo kekere, Ikorodu, Lagos, Nigeria',
    href: null,
  },
];

const fieldClass =
  'h-[52px] w-full rounded-[6px] border border-[#DCDCDC] bg-white px-4 font-lora text-[15px] text-black outline-none transition-colors placeholder:text-[#9A9A9A] focus:border-[#17AD10] disabled:opacity-60';

const EMPTY = { name: '', email: '', message: '' };

/**
 * Desktop 43 — Contact us. Palm background, one white card holding the contact
 * details on the left and the enquiry form on the right.
 *
 * The form is wired to the same backend the old hand-built contact page used:
 * a row in the Supabase `service_contacts` table plus the notification email
 * via `sendContactEmails`. The Figma frame draws three fields (name, email,
 * message) where the old page had four — the table's `phone` column is filled
 * with an empty string so the insert shape stays identical.
 */
export default function FigmaContact() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const { error: supaError } = await supabase.from('service_contacts').insert([
      {
        name: form.name,
        phone: '',
        email: form.email,
        message: form.message,
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (supaError) {
      setError('Submission failed. Please try again.');
      return;
    }

    setSuccess('Your message has been sent!');
    setForm(EMPTY);

    // Notification email is best-effort: the lead is already saved, so a mail
    // failure must not surface to the visitor as a failed submission.
    try {
      await sendContactEmails({
        name: form.name,
        email: form.email,
        phone: '',
        message: form.message,
        subject: 'Contact Inquiry',
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <FigmaNav />

      {/* ── Background band with the contact card ────────────────────────── */}
      <section className="relative">
        <ImageSlot
          slot="contact-bg"
          label="Palm frond background"
          hint="1440 × 916"
          labelPosition="corner"
          className="absolute inset-0 h-full w-full"
          overlay="bg-black/55"
        />

        <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-[147px] lg:py-[100px]">
          <div className="relative rounded-[16px] bg-white p-8 sm:p-12 lg:p-[66px]">
            {/* Coconut illustration, flush with the card corner */}
            <ImageSlot
              slot="contact-coconut-icon"
              label="Coconut illustration"
              hint="128 × 128"
              className="pointer-events-none absolute left-3 top-2 hidden h-[128px] w-[128px] !bg-transparent [&>div]:border-0 [&>div]:bg-transparent lg:block"
              imgClassName="object-contain"
            />

            <div className="grid gap-12 lg:grid-cols-[1fr_485px] lg:gap-14">
              {/* Left: contact information */}
              <div className="lg:pt-[120px]">
                <h1 className="font-montserrat text-[26px] font-bold text-[#151515] sm:text-[32px]">
                  Contact Information
                </h1>
                <p className="mt-5 max-w-[400px] font-montserrat text-[16px] leading-[1.7] text-[#101010]">
                  Have questions, ideas, or want to learn more about what we do? Get in touch with
                  our team today.
                </p>

                <dl className="mt-12 space-y-7">
                  {DETAILS.map(({ icon: Icon, label, value, href }) => (
                    <div key={label}>
                      <dt className="flex items-center gap-2 font-quicksand text-[14px] text-[#5B5B5B]">
                        <Icon className="h-[15px] w-[15px]" strokeWidth={1.7} aria-hidden="true" />
                        {label}
                      </dt>
                      <dd className="mt-2 max-w-[330px] font-quicksand text-[16px] font-semibold leading-[1.55] text-[#151515]">
                        {href ? (
                          <a href={href} className="underline underline-offset-2 hover:text-[#17AD10]">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right: enquiry form */}
              <div className="rounded-[12px] bg-[#F7F5F5] p-7 sm:p-8">
                <p className="font-montserrat text-[16px] leading-[1.6] text-[#101010]">
                  Fill out this form correctly and submit to Contact Our Services Team
                </p>

                <form className="mt-7" onSubmit={handleSubmit}>
                  <label htmlFor="contact-name" className="block font-montserrat text-[16px] text-[#101010]">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`${fieldClass} mt-3`}
                  />

                  <label
                    htmlFor="contact-email"
                    className="mt-6 block font-montserrat text-[16px] text-[#101010]"
                  >
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`${fieldClass} mt-3`}
                  />

                  <label
                    htmlFor="contact-message"
                    className="mt-6 block font-montserrat text-[16px] text-[#101010]"
                  >
                    How can we help you
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-3 w-full resize-none rounded-[6px] border border-[#DCDCDC] bg-white px-4 py-3 font-lora text-[15px] text-black outline-none transition-colors focus:border-[#17AD10] disabled:opacity-60"
                  />

                  {success && (
                    <p
                      role="status"
                      className="mt-5 flex items-start gap-2 rounded-[6px] bg-[#DFFCDE] px-4 py-3 font-lora text-[14px] text-[#167911]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {success}
                    </p>
                  )}
                  {error && (
                    <p
                      role="alert"
                      className="mt-5 rounded-[6px] bg-[#FDECEC] px-4 py-3 font-lora text-[14px] text-[#B42318]"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-7 h-[52px] w-full rounded-[6px] bg-[#1AC212] font-montserrat text-[16px] text-white transition-colors hover:bg-[#17ad10] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Sending…' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FigmaFooter />
    </div>
  );
}
