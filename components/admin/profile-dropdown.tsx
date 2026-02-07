'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, User, Settings, LogOut, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import styles from './profile-dropdown.module.css'

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.profileButton}
      >
        <img
          src={
            user.avatar ||
            'https://cdn-icons-png.flaticon.com/512/3781/3781986.png'
          }
          alt={user.name}
          className={styles.avatar}
        />
        <span className={styles.userName}>{user.name}</span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.userInfo}>
            <img
              src={
                user.avatar ||
                'https://cdn-icons-png.flaticon.com/512/3781/3781986.png'
              }
              alt={user.name}
              className={styles.menuAvatar}
            />
            <div className={styles.userDetails}>
              {/* <h4>{user.name}</h4>
              <p>{user.email}</p> */}
              <span className={styles.role}>{user.role}</span>
            </div>
          </div>

          <div className={styles.menuDivider} />

          <Link
            href="/admin/dashboard"
            className={styles.menuItem}
            onClick={() => setIsOpen(false)}
          >
            <BarChart3 size={18} />
            <span>Admin Dashboard</span>
          </Link>

          <Link
            href="/admin/profile"
            className={styles.menuItem}
            onClick={() => setIsOpen(false)}
          >
            <User size={18} />
            <span>Profile Settings</span>
          </Link>

          <Link
            href="/admin/settings"
            className={styles.menuItem}
            onClick={() => setIsOpen(false)}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>

          <div className={styles.menuDivider} />

          <button onClick={logout} className={styles.logoutButton}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
