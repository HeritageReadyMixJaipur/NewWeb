import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "@/components/navbar"
import FirebaseAdminSetup from "@/components/firebase-admin-setup"

export default function FirebaseAdminSetupPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen page-transition">
        <Navbar />
        <main>
          <FirebaseAdminSetup />
        </main>
      </div>
    </LanguageProvider>
  )
}
