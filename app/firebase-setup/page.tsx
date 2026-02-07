import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FirebaseSetupGuide from "@/components/firebase-setup-guide"

export default function FirebaseSetupPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen page-transition">
        <Navbar />
        <main className="pt-20">
          <FirebaseSetupGuide />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
