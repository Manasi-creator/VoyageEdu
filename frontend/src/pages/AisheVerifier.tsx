import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { verifyAisheCode, type AisheVerificationResponse } from "@/services/aisheService";
import { ShieldCheck, ShieldX, Search, Loader2, MapPin } from "lucide-react";

const AisheVerifier = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AisheVerificationResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Please enter an AISHE code before verifying.");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyAisheCode(trimmedCode);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify the AISHE code right now.");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (!result.verified) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50/80 p-4 flex items-start gap-3 text-sm text-red-700">
          <ShieldX className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-semibold">No institution found for this AISHE code.</p>
            <p>Please check the code and try again.</p>
          </div>
        </div>
      );
    }

    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-green-900">Verified Institution</CardTitle>
            <CardDescription>This AISHE code belongs to the institution below.</CardDescription>
          </div>
          <Badge className="bg-green-600 hover:bg-green-600 text-white flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            Verified
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">AISHE Code</p>
            <p className="text-lg font-semibold">{result.aisheCode}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Institution Name</p>
            <p className="text-lg font-semibold">{result.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Location</p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>
                {[result.district, result.state].filter(Boolean).join(", ") || "Not available"}
                {result.location ? ` (${result.location})` : ""}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Year of Establishment</p>
            <p className="text-lg font-semibold">
              {result.yearOfEstablishment ? result.yearOfEstablishment : "Not available"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-border/60">
            <CardHeader className="text-center space-y-4">
              <Badge variant="outline" className="mx-auto text-xs uppercase tracking-wider">
                Compliance Tool
              </Badge>
              <div>
                <CardTitle className="text-3xl font-bold">AISHE Code Verifier</CardTitle>
                <CardDescription className="text-base mt-2">
                  Instantly verify Indian higher-education institutions by their official AISHE code.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="aishe-code" className="text-sm font-medium text-muted-foreground">
                    Enter AISHE Code
                  </label>
                  <Input
                    id="aishe-code"
                    placeholder="e.g. C-6560 or U-0006"
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    aria-invalid={!!error}
                    aria-describedby={error ? "aishe-error" : undefined}
                  />
                </div>
                {error && (
                  <p id="aishe-error" className="text-sm text-red-600">
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" /> Verify
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-8">{renderResult()}</div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AisheVerifier;
