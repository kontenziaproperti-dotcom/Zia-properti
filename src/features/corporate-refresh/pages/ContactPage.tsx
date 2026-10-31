import React from 'react';
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CompanySettings } from '../../../types';
import { LeadCaptureForm } from '../../../components/LeadCaptureForm';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../../../lib/contactUtils';
import { CorporatePageHero } from '../components/CorporatePageHero';

interface ContactPageProps {
  settings: CompanySettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const hasVerifiedAddress = Boolean(settings.fullAddress?.trim());
  const hasMarketingAddress = Boolean(settings.marketingAddress?.trim());
  const headOfficeMapUrl = hasVerifiedAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.fullAddress)}`
    : '';
  const marketingOfficeMapUrl = hasMarketingAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.marketingAddress || '')}`
    : '';
  const channels = [
    { name: 'ZIA Emerald', sector: 'Properti · Residensial', number: settings.emeraldWhatsApp, message: 'Halo Tim ZIA Emerald, saya ingin informasi mengenai hunian.' },
    { name: 'Kav Hillside', sector: 'Properti · Kavling', number: settings.kavWhatsApp, message: 'Halo Tim Kav Hillside, saya ingin informasi mengenai kavling.' },
    { name: 'ZIA Farm', sector: 'Peternakan & Agribisnis', number: settings.farmWhatsApp, message: 'Halo Tim ZIA Farm, saya ingin informasi layanan peternakan.' },
    { name: 'Altara ZIA International', sector: 'Vanilla · B2B Export', number: settings.altaraWhatsApp, message: 'Hello Altara ZIA International, I would like to inquire about Indonesian vanilla.' },
    { name: 'ZIA Raya', sector: 'Retail & Perdagangan' },
    { name: 'ZIA Direct', sector: 'Direct Selling' },
  ];

  return (
    <div className="se-corporate-page se-contact-page">
      <CorporatePageHero
        eyebrow="Kontak · ZIA Corporate"
        title="Mari mulai percakapan bersama tim ZIA."
        description="Untuk informasi produk, layanan, kemitraan, dan kebutuhan masing-masing lini bisnis, hubungi kantor korporat atau kirimkan pertanyaan melalui formulir."
        compact
      />

      <section className="se-section">
        <div className="se-page-container se-contact-layout">
          <div className="se-contact-information">
            <div className="se-section-heading se-section-heading--left">
              <p className="se-section-eyebrow">Kantor korporat</p>
              <h2 className="se-section-title">Kami siap membantu.</h2>
            </div>
            <div className="se-contact-detail-card">
              <MapPin size={20} aria-hidden="true" />
              <div>
                <strong>ZIA Corporate Head Office</strong>
                <p>{hasVerifiedAddress ? settings.fullAddress : 'Alamat kantor pusat belum tersedia.'}</p>
                {hasVerifiedAddress ? <a href={headOfficeMapUrl} target="_blank" rel="noreferrer">Lihat Head Office di Google Maps <ArrowUpRight size={14} aria-hidden="true" /></a> : null}
              </div>
            </div>
            <div className="se-contact-detail-card">
              <MapPin size={20} aria-hidden="true" />
              <div>
                <strong>Kantor Marketing Pemasaran ZIA Properti Indonesia</strong>
                <p>{hasMarketingAddress ? settings.marketingAddress : 'Alamat kantor marketing belum tersedia.'}</p>
                {hasMarketingAddress ? <a href={marketingOfficeMapUrl} target="_blank" rel="noreferrer">Lihat Marketing Office di Google Maps <ArrowUpRight size={14} aria-hidden="true" /></a> : null}
              </div>
            </div>
            <div className="se-contact-detail-card">
              <Clock3 size={20} aria-hidden="true" />
              <div><strong>Jam operasional</strong><p>{settings.officeHours}</p></div>
            </div>
            <div className="se-contact-detail-card">
              <Phone size={20} aria-hidden="true" />
              <div><strong>Telepon</strong><p>{formatIndonesianPhone(settings.phone)}</p></div>
            </div>
            <div className="se-contact-detail-card">
              <Mail size={20} aria-hidden="true" />
              <div><strong>Email</strong><a href={`mailto:${settings.email}`}>{settings.email}</a></div>
            </div>
          </div>

          <div className="se-contact-form-wrap">
            <LeadCaptureForm
              projectSlug="contact-page-inquiry"
              projectName="ZIA Corporate"
              propertyOptions={[
                'Konsultasi ZIA Emerald (Residensial)',
                'Konsultasi Kav Hillside (Kavling)',
                'Layanan ZIA Farm (Peternakan & Agribisnis)',
                'Altara ZIA International (Ekspor Vanilla)',
                'ZIA Raya (Retail & Perdagangan)',
                'ZIA Direct (Direct Selling)',
                'Kemitraan Usaha & Investasi Lainnya',
              ]}
              title="Sampaikan kebutuhan Anda"
              subtitle="Pilih lini bisnis yang ingin dihubungi. Tim terkait akan menindaklanjuti sesuai informasi kontak yang tersedia."
            />
          </div>
        </div>
      </section>

      <section className="se-section se-section--soft">
        <div className="se-page-container">
          <div className="se-section-heading">
            <p className="se-section-eyebrow">Kontak per lini bisnis</p>
            <h2 className="se-section-title">Pilih tim yang tepat.</h2>
            <p className="se-section-description">Nomor WhatsApp ditampilkan berdasarkan pengaturan yang terdaftar. Unit yang belum memiliki nomor khusus dapat dihubungi melalui formulir di atas.</p>
          </div>
          <div className="se-contact-channel-grid">
            {channels.map((channel) => {
              const cleanNumber = channel.number ? cleanWhatsAppNumber(channel.number) : '';
              const isConfigured = cleanNumber.length >= 8;
              return (
                <article className="se-contact-channel" key={channel.name}>
                  <span>{channel.sector}</span>
                  <h3>{channel.name}</h3>
                  {isConfigured ? (
                    <>
                      <p>{formatIndonesianPhone(channel.number || '')}</p>
                      <a href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(channel.message || 'Halo Tim ZIA, saya ingin informasi.')}`} target="_blank" rel="noreferrer">
                        <MessageCircle size={15} aria-hidden="true" /> WhatsApp tim
                      </a>
                    </>
                  ) : (
                    <>
                      <p>Nomor khusus belum dicantumkan.</p>
                      <span className="se-contact-channel__fallback">Gunakan formulir konsultasi korporat.</span>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="se-section">
        <div className="se-page-container">
          <div className="se-section-heading se-section-heading--left">
            <p className="se-section-eyebrow">Lokasi resmi ZIA</p>
            <h2 className="se-section-title">Head Office & Marketing Office.</h2>
            <p className="se-section-description">Dua alamat kantor dengan fungsi yang berbeda dalam operasional ZIA.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="se-contact-map se-contact-map--link">
              <span className="se-contact-map__icon"><MapPin size={24} aria-hidden="true" /></span>
              <p className="se-section-eyebrow">Kantor Pusat</p>
              <h3>ZIA Corporate Head Office</h3>
              <p className="se-contact-map__address">{settings.fullAddress}</p>
              <a href={headOfficeMapUrl} target="_blank" rel="noreferrer">
                Buka Head Office di Google Maps <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="se-contact-map se-contact-map--link">
              <span className="se-contact-map__icon"><MapPin size={24} aria-hidden="true" /></span>
              <p className="se-section-eyebrow">Kantor Pemasaran</p>
              <h3>ZIA Properti Indonesia · Marketing Office</h3>
              <p className="se-contact-map__address">{settings.marketingAddress}</p>
              <a href={marketingOfficeMapUrl} target="_blank" rel="noreferrer">
                Buka Marketing Office di Google Maps <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <small>Alamat ditampilkan sesuai informasi yang diberikan oleh perusahaan. Titik peta dibuka melalui pencarian alamat pada Google Maps.</small>
        </div>
      </section>
    </div>
  );
};
