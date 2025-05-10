
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          form.reset({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
          });
        }
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (!user) return;

      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Profile</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input value={user?.email || ""} disabled />
                    </FormControl>
                  </FormItem>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" type="button" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
