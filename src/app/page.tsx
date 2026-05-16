import { signIn } from '@/app/actions/auth'

interface Props {
  searchParams: Promise<{ error?: string; redirected?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams
  const error = params.error
  const redirected = params.redirected

  return (
    <div className="min-h-screen bg-[#F8F8F7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Beyond Thesis
          </h1>
          <p className="text-sm text-[#666666] mt-1">
            Beyond Research Unit · Thesis Support Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-6 shadow-sm">
          {redirected && (
            <div className="mb-4 px-3 py-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded text-sm text-[#666666]">
              Please sign in to continue.
            </div>
          )}

          {error === 'disabled' && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-[#9B1C1C]">
              Your account has been disabled. Please contact support.
            </div>
          )}

          {error === 'invalid_credentials' && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-[#9B1C1C]">
              Invalid email or password.
            </div>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1A1A1A] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm text-[#1A1A1A] bg-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1A1A1A] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm text-[#1A1A1A] bg-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#1A3A5C] hover:bg-[#16324f] text-white text-sm font-medium rounded-md transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="mailto:support@beyondthesis.in"
              className="text-sm text-[#1A3A5C] hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-[#666666] mt-6">
          © {new Date().getFullYear()} Beyond Research Unit
        </p>
      </div>
    </div>
  )
}
