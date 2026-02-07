import { LanguageProvider } from "@/contexts/language-context"
import { ContactsProvider } from "@/contexts/contacts-context"
import Navbar from "@/components/navbar"
import SecurityTest from "@/components/admin/security-test"

export default function SecurityTestPage() {
  return (
    <LanguageProvider>
      <ContactsProvider>
        <div className="min-h-screen page-transition">
          <Navbar />
          <main className="pt-20">
            <SecurityTest />
          </main>
        </div>
      </ContactsProvider>
    </LanguageProvider>
  )
}
