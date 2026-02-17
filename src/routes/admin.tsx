/**
 * Admin Panel Route
 * Direct access to administrative interface
 */

import { createFileRoute } from '@tanstack/react-router'
import { AdminPanel } from '~/shared/components/AdminPanel'

export const Route = createFileRoute('/admin')({
  component: AdminPanel,
})
