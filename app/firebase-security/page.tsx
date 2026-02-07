import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FirebaseSecuritySetup from "@/components/firebase-security-setup"

export default function FirebaseSecurityPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen page-transition">
        <Navbar />
        <main className="pt-20">
          <FirebaseSecuritySetup />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
