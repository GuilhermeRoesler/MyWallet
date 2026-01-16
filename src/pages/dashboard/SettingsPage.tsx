import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/dashboard/settings/ProfileForm";
import { AppearanceForm } from "@/components/dashboard/settings/AppearanceForm";
import { NotificationsForm } from "@/components/dashboard/settings/NotificationsForm";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-lg text-muted-foreground">
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
