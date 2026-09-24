import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import Home from "@/pages/Home";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <SignedOut>
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">
            Stream<span className="text-primary">ify</span>
          </h1>
          <p className="text-muted">Sign in to start listening with friends.</p>
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-3">
          <h1 className="text-lg font-bold">
            Stream<span className="text-primary">ify</span>
          </h1>
          <UserButton afterSignOutUrl="/" />
        </header>
        <Home />
      </SignedIn>
    </div>
  );
}
