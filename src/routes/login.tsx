/**
 * Login Route
 * Authentication page for admin access
 */

import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '~/shared/components/Login'
import { isAuthenticated } from '~/shared/utils/authManager'
import { z } from 'zod'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  component: Login,
  validateSearch: loginSearchSchema,
  beforeLoad: () => {
    // If already authenticated, redirect to admin
    if (isAuthenticated()) {
      throw redirect({
        to: '/admin',
      })
    }
  },
})
