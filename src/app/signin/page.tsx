"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react" // Import the signIn function from next-auth/react
import { useRouter } from "next/navigation" // Use router to redirect after sign-in

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null) // To handle errors
  const router = useRouter() // Router to redirect after successful sign-in

  type SignInFormEvent = React.FormEvent<HTMLFormElement>

  const handleSubmit = async (e: SignInFormEvent): Promise<void> => {
    e.preventDefault()

    // Call signIn method from next-auth
    const res = await signIn("credentials", {
      redirect: false, // Don't redirect automatically
      email,
      password,
    })

    if (res?.error) {
      setError("Invalid email or password") // Show error message
    } else {
      router.push("/dashboard") // Redirect to home or dashboard after successful sign-in
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>} {/* Show error message */}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => window.location.href = '/signup'}>
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
