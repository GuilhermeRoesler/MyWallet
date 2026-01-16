import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(2, "Informe um nome com pelo menos 2 caracteres."),
  description: z.string().max(300, "Máximo de 300 caracteres.").optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; description: string }) => void;
  isLoading?: boolean;
  projectToEdit?: Project | null;
}

export function ProjectFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  projectToEdit,
}: ProjectFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: projectToEdit?.name ?? "",
        description: projectToEdit?.description ?? "",
      });
    }
  }, [isOpen, projectToEdit, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      description: values.description ?? "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {projectToEdit ? "Editar projeto" : "Novo projeto"}
          </DialogTitle>
          <DialogDescription>
            {projectToEdit
              ? "Atualize o nome e a descrição do projeto."
              : "Crie um workspace financeiro isolado no navegador."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Finanças 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Opcional — contexto do projeto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {projectToEdit ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
