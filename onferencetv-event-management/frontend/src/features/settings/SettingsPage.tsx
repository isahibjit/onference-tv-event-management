import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Building2,
  Palette,
  Sparkles,
  FileText,
  UserCircle,
  Shield,
  Save,
  KeyRound,
  MonitorSmartphone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "./settingsApi";
import { Skeleton } from "@/components/ui/skeleton";

const settingsSchema = z.object({
  organizationName: z.string().min(2),
  timezone: z.string(),
  language: z.string(),
  theme: z.string(),
  brandColor: z.string(),
  geminiApiKey: z.string(),
  aiModel: z.string(),
  aiTemperature: z.number().min(0).max(2),
  pdfPaperSize: z.enum(["A4", "Letter"]),
  pdfOrientation: z.enum(["Portrait", "Landscape"]),
  pdfIncludeImage: z.boolean(),
  pdfIncludeAi: z.boolean(),
  pdfFooterText: z.string(),
});

export function SettingsPage() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings || {},
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateSettings(data).unwrap();
      toast.success("Settings saved successfully");
      reset(data);
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleTestConnection = async () => {
    const apiKey = watch("geminiApiKey");
    const aiModel = watch("aiModel") || "gemini-pro";
    if (!apiKey) {
      toast.error("Please enter a Gemini API Key first");
      return;
    }

    setTestStatus("testing");
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: aiModel });
      const result = await model.generateContent("Say exactly: OK");
      if (result.response.text().includes("OK")) {
        setTestStatus("success");
        toast.success(`Connection to ${aiModel} successful!`);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error: any) {
      console.error("Test Connection Error:", error);
      setTestStatus("error");
      toast.error(`Connection failed: ${error?.message || "Unknown error"}. Check your API key or try selecting 'Gemini Pro (Classic)'.`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-9xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="flex gap-8">
          <Skeleton className="w-64 h-[400px]" />
          <Skeleton className="flex-1 h-[600px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto pb-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and application preferences.
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex flex-row md:flex-col justify-start h-auto bg-transparent gap-2 overflow-x-auto w-full md:w-64 p-0">
          <TabsTrigger
            value="general"
            className="justify-start gap-3 w-full data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-lg px-4 py-2.5"
          >
            <Building2 className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="justify-start gap-3 w-full data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-lg px-4 py-2.5"
          >
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="justify-start gap-3 w-full data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-lg px-4 py-2.5"
          >
            <Sparkles className="h-4 w-4" /> AI Configuration
          </TabsTrigger>
          <TabsTrigger
            value="pdf"
            className="justify-start gap-3 w-full data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-lg px-4 py-2.5"
          >
            <FileText className="h-4 w-4" /> PDF Exports
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="justify-start gap-3 w-full data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-lg px-4 py-2.5"
          >
            <UserCircle className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="justify-start gap-3 w-full data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-lg px-4 py-2.5"
          >
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* General Tab */}
            <TabsContent
              value="general"
              className="mt-0 space-y-6 outline-none"
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>
                    Update your company info and localization settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      {...register("organizationName")}
                      className="max-w-md"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={watch("timezone")}
                        onValueChange={(v) =>
                          setValue("timezone", v, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">
                            UTC (Universal Coordinated Time)
                          </SelectItem>
                          <SelectItem value="EST">
                            EST (Eastern Standard Time)
                          </SelectItem>
                          <SelectItem value="PST">
                            PST (Pacific Standard Time)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={watch("language")}
                        onValueChange={(v) =>
                          setValue("language", v, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="es">Spanish (ES)</SelectItem>
                          <SelectItem value="fr">French (FR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent
              value="appearance"
              className="mt-0 space-y-6 outline-none"
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="flex flex-wrap gap-4">
                      {["light", "dark", "system"].map((t) => (
                        <div
                          key={t}
                          className={`
                            border-2 rounded-xl p-4 cursor-pointer w-32 flex flex-col items-center gap-3 transition-all
                            ${watch("theme") === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                          `}
                          onClick={() =>
                            setValue("theme", t, { shouldDirty: true })
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${t === "dark" ? "bg-zinc-950 text-white" : "bg-slate-100"}`}
                          >
                            {t === "dark" ? "🌙" : t === "light" ? "☀️" : "💻"}
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {t}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="brandColor">Brand Color (Hex)</Label>
                    <div className="flex items-center gap-3 max-w-xs">
                      <Input id="brandColor" {...register("brandColor")} />
                      <div
                        className="w-9 h-9 rounded-md border shadow-sm shrink-0"
                        style={{ backgroundColor: watch("brandColor") }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Configuration Tab */}
            <TabsContent value="ai" className="mt-0 space-y-6 outline-none">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Google Gemini API</CardTitle>
                  <CardDescription>
                    Configure your AI content generation settings. Keys are
                    stored locally in your browser.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2 max-w-xl">
                    <Label htmlFor="geminiApiKey">API Key</Label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="geminiApiKey"
                          type="password"
                          placeholder="AIzaSy..."
                          className="pl-9 font-mono"
                          {...register("geminiApiKey")}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleTestConnection}
                        disabled={testStatus === "testing"}
                      >
                        {testStatus === "testing"
                          ? "Testing..."
                          : "Test Connection"}
                      </Button>
                    </div>
                    {testStatus === "success" && (
                      <p className="text-sm text-emerald-600 font-medium flex items-center gap-1.5 mt-2">
                        <CheckCircle2 className="h-4 w-4" /> Connection
                        successful
                      </p>
                    )}
                    {testStatus === "error" && (
                      <p className="text-sm text-red-600 font-medium flex items-center gap-1.5 mt-2">
                        <AlertCircle className="h-4 w-4" /> Connection failed
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Select
                        value={watch("aiModel")}
                        onValueChange={(v) =>
                          setValue("aiModel", v, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini-1.5-flash">
                            Gemini 1.5 Flash (Fast)
                          </SelectItem>
                          <SelectItem value="gemini-1.5-pro">
                            Gemini 1.5 Pro (Advanced)
                          </SelectItem>
                          <SelectItem value="gemini-pro">
                            Gemini Pro (Classic)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Creativity Temperature (0-2)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        {...register("aiTemperature", { valueAsNumber: true })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher values produce more creative output.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PDF Exports Tab */}
            <TabsContent value="pdf" className="mt-0 space-y-6 outline-none">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>PDF Export Preferences</CardTitle>
                  <CardDescription>
                    Default settings for generated event documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Paper Size</Label>
                      <Select
                        value={watch("pdfPaperSize")}
                        onValueChange={(v: string) =>
                          setValue("pdfPaperSize", v as any, {
                            shouldDirty: true,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4</SelectItem>
                          <SelectItem value="Letter">US Letter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Orientation</Label>
                      <Select
                        value={watch("pdfOrientation")}
                        onValueChange={(v: string) =>
                          setValue("pdfOrientation", v as any, {
                            shouldDirty: true,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select orientation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Portrait">Portrait</SelectItem>
                          <SelectItem value="Landscape">Landscape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Include Speaker Image</Label>
                        <p className="text-sm text-muted-foreground">
                          Add generated avatar to the PDF.
                        </p>
                      </div>
                      <Switch
                        checked={watch("pdfIncludeImage")}
                        onCheckedChange={(v) =>
                          setValue("pdfIncludeImage", v, { shouldDirty: true })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Include AI Description</Label>
                        <p className="text-sm text-muted-foreground">
                          Include generated event details.
                        </p>
                      </div>
                      <Switch
                        checked={watch("pdfIncludeAi")}
                        onCheckedChange={(v) =>
                          setValue("pdfIncludeAi", v, { shouldDirty: true })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="pdfFooterText">Footer Text</Label>
                    <Input id="pdfFooterText" {...register("pdfFooterText")} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent
              value="account"
              className="mt-0 space-y-6 outline-none"
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 max-w-xl">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center border text-3xl font-bold text-muted-foreground overflow-hidden">
                      <img
                        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        alt="Avatar"
                      />
                    </div>
                    <Button variant="outline" type="button">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      defaultValue="John Doe"
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      defaultValue="john.doe@example.com"
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your profile information is managed by your identity
                    provider. Please contact your administrator to make changes.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent
              value="security"
              className="mt-0 space-y-6 outline-none"
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and active sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 max-w-md">
                    <h3 className="font-semibold text-sm">Change Password</h3>
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <Button variant="secondary" type="button">
                      Update Password
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-sm mb-4">
                      Active Sessions
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-4">
                          <MonitorSmartphone className="h-6 w-6 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Windows PC - Chrome
                            </p>
                            <p className="text-xs text-muted-foreground">
                              San Francisco, CA • Active now
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 shadow-none border-0">
                          Current
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </div>
      </Tabs>
    </div>
  );
}
