import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/dashboard/settings/ProfileForm";
import { AppearanceForm } from "@/components/dashboard/settings/AppearanceForm";
import { NotificationsForm } from "@/components/dashboard/settings/NotificationsForm";

const SettingsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Configurações
        </h1>
        <p className="mt-1 text-muted-foreground">
          Preferências deste projeto (persistidas no localStorage).
        </p>
      </div>
      <Separator />
      <ProfileForm />
      <Separator />
      <AppearanceForm />
      <Separator />
      <NotificationsForm />
    </div>
  );
};

export default SettingsPage;
