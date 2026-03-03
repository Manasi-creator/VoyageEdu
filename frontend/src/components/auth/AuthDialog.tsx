import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loginUser, signupUser } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

const STREAM_OPTIONS = ["Engineering", "Medical", "Business", "Design", "Arts", "Science", "Law", "Other"];

type AuthDialogProps = {
  open: boolean;
  activeTab: "signin" | "signup";
  onTabChange: (value: "signin" | "signup") => void;
  onOpenChange: (value: boolean) => void;
};

const AuthDialog = ({ open, activeTab, onTabChange, onOpenChange }: AuthDialogProps) => {
  const { login } = useAuth();

  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    state: "",
    preferredStream: "",
  });

  const [signinLoading, setSigninLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signinError, setSigninError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const passwordsMatchRequirements = useMemo(() => signupForm.password.length >= 8, [signupForm.password]);

  const validateSignup = () => {
    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password.trim()) {
      setSignupError("Name, email, and password are required.");
      return false;
    }
    if (!passwordsMatchRequirements) {
      setSignupError("Password must be at least 8 characters long.");
      return false;
    }
    setSignupError(null);
    return true;
  };

  const handleSigninSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigninError(null);

    if (!signinForm.email.trim() || !signinForm.password.trim()) {
      setSigninError("Email and password are required.");
      return;
    }

    try {
      setSigninLoading(true);
      const response = await loginUser({
        email: signinForm.email.trim(),
        password: signinForm.password,
      });
      login(response);
      onOpenChange(false);
      setSigninForm({ email: "", password: "" });
    } catch (error) {
      setSigninError(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setSigninLoading(false);
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateSignup()) return;

    try {
      setSignupLoading(true);
      const response = await signupUser({
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        password: signupForm.password,
        city: signupForm.city.trim() || undefined,
        state: signupForm.state.trim() || undefined,
        preferredStreams: signupForm.preferredStream ? [signupForm.preferredStream] : undefined,
      });
      login(response);
      onOpenChange(false);
      setSignupForm({
        name: "",
        email: "",
        password: "",
        city: "",
        state: "",
        preferredStream: "",
      });
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : "Unable to sign up. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to VoyageEdu</DialogTitle>
          <DialogDescription>
            {activeTab === "signin"
              ? "Sign in to continue exploring personalized experiences."
              : "Create an account to plan your educational journey."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "signin" | "signup")} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-6">
            <form className="space-y-4" onSubmit={handleSigninSubmit}>
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@email.com"
                  value={signinForm.email}
                  onChange={(event) => setSigninForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signinForm.password}
                  onChange={(event) => setSigninForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </div>

              {signinError && (
                <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{signinError}</div>
              )}

              <Button type="submit" className="w-full" disabled={signinLoading}>
                {signinLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Enter your name"
                    value={signupForm.name}
                    onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@email.com"
                    value={signupForm.email}
                    onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={signupForm.password}
                  onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">Use 8 or more characters with a mix of letters and numbers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-city">City (optional)</Label>
                  <Input
                    id="signup-city"
                    placeholder="City"
                    value={signupForm.city}
                    onChange={(event) => setSignupForm((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-state">State (optional)</Label>
                  <Input
                    id="signup-state"
                    placeholder="State"
                    value={signupForm.state}
                    onChange={(event) => setSignupForm((prev) => ({ ...prev, state: event.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Stream (optional)</Label>
                <Select
                  value={signupForm.preferredStream}
                  onValueChange={(value) => setSignupForm((prev) => ({ ...prev, preferredStream: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAM_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {signupError && (
                <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{signupError}</div>
              )}

              <Button type="submit" className="w-full" disabled={signupLoading}>
                {signupLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
