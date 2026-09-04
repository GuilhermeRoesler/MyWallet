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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Budget } from "@/types"; // Assuming you have a types file

const budgetSchema = z.object({
  category: z.string().min(1, { error: "A categoria é obrigatória." }),
  allocated: z.coerce.number().positive({ error: "O valor alocado deve ser positivo." }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BudgetFormValues) => void;
  isLoading: boolean;
  budgetToEdit?: Budget | null;
}

import { BUDGET_CATEGORY_OPTIONS } from "@/lib/labels";

const categories = BUDGET_CATEGORY_OPTIONS;

export function BudgetFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  budgetToEdit,
}: BudgetFormDialogProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      allocated: 0,
    },
  });

  useEffect(() => {
    if (budgetToEdit) {
      form.reset(budgetToEdit);
    } else {
      form.reset({ category: "", allocated: 0 });
    }
  }, [budgetToEdit, form]);

  const isEditing = !!budgetToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Orçamento" : "Novo Orçamento"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os detalhes do orçamento." : "Adicione um novo orçamento mensal."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allocated" render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Alocado</FormLabel>
                <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}