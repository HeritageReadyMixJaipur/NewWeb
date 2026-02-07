"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Globe, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import ProfileDropdown from "@/components/admin/profile-dropdown"
import LoginModal from "@/components/auth/login-modal"
import styles from "./navbar.module.css"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link href="/">
              <img src="/heritage-logo.png" alt="Heritage Readymix" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>
              {t("home")}
            </Link>
            <Link href="/projects" className={styles.navLink}>
              {t("projects")}
            </Link>
            <Link href="/gallery" className={styles.navLink}>
              {t("gallery")}
            </Link>
            <Link href="/blog" className={styles.navLink}>
              Blog
            </Link>
            <Link href="/contact" className={styles.navLink}>
              {t("contact")}
            </Link>

            <div
              className={styles.dropdown}
              onMouseEnter={() => setIsAboutOpen(true)}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <button className={styles.dropdownButton}>
                {t("aboutUs")} <ChevronDown className={styles.chevron} />
              </button>
              {isAboutOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/about/team" className={styles.dropdownItem}>
                    {t("ourTeam")}
                  </Link>
                  <Link href="/about/plant" className={styles.dropdownItem}>
                    {t("plant")}
                  </Link>
                  <Link href="/about/vision" className={styles.dropdownItem}>
                    {t("ourVision")}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            {user ? (
              <ProfileDropdown />
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className={styles.signInButton}>
                <User size={18} />
                Admin
              </button>
            )}

            <Link href="/contact" className={styles.orderButton}>
              {t("orderNow")}
            </Link>

            <button className={styles.mobileMenuButton} onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={styles.mobileNav}>
            <Link href="/" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              {t("home")}
            </Link>
            <Link href="/projects" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              {t("projects")}
            </Link>
            <Link href="/gallery" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              {t("gallery")}
            </Link>
            <Link href="/blog" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              Blog
            </Link>
            <Link href="/contact" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              {t("contact")}
            </Link>
            <Link href="/about/team" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              {t("ourTeam")}
            </Link>
            <Link href="/about/plant" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              {t("plant")}
            </Link>
            <Link href="/about/vision" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
              {t("ourVision")}
            </Link>
          </div>
        )}
      </nav>

      {/* Language Toggle - Bottom Left like WhatsApp */}
      <button onClick={toggleLanguage} className={styles.languageToggle}>
        <Globe size={20} />
        {language === "en" ? "हिं" : "EN"}
      </button>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
