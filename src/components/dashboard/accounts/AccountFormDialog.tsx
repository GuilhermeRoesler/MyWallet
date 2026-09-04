import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

const accountSchema = z.object({
  name: z.string().min(2, { error: "O nome deve ter pelo menos 2 caracteres." }),
  type: z.enum(["Bank", "Credit Card", "Investment", "Savings"]),
  balance: z.coerce.number(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface AccountFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AccountFormValues) => void;
  isLoading: boolean;
  accountToEdit?: Account | null;
}

export function AccountFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  accountToEdit,
}: AccountFormDialogProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema) as Resolver<AccountFormValues>,
    defaultValues: {
      name: "",
      type: "Bank",
      balance: 0,
    },
  });

  useEffect(() => {
    if (accountToEdit) {
      form.reset({
        name: accountToEdit.name,
        type: accountToEdit.type as any,
        balance: accountToEdit.balance,
      });
    } else {
      form.reset();
    }
  }, [accountToEdit, form]);

  const isEditing = !!accountToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Conta" : "Nova Conta"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os detalhes da sua conta."
              : "Adicione uma nova conta para rastrear."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Conta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Banco Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bank">Banco</SelectItem>
                      <SelectItem value="Credit Card">Cartão de Crédito</SelectItem>
                      <SelectItem value="Investment">Investimento</SelectItem>
                      <SelectItem value="Savings">Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Inicial</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}