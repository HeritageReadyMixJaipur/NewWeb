import { LanguageProvider } from '@/contexts/language-context'
import { ContactsProvider } from '@/contexts/contacts-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import WhatsAppIcon from '@/components/whatsapp-icon'
import ContactForm from '@/components/contact-form'

export default function ContactPage() {
  return (
    <LanguageProvider>
      <ContactsProvider>
        <div className="min-h-screen page-transition">
          <Navbar />
          <main className="pt-20">
            <ContactForm />
          </main>
          <Footer />
          <WhatsAppIcon />
        </div>
      </ContactsProvider>
    </LanguageProvider>
  )
}
