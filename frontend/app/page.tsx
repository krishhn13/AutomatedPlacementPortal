import { AuthForm } from "@/components/auth-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-balance mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PlacementPro
              </h1>
              <p className="text-muted-foreground text-pretty">Your gateway to career opportunities</p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}
