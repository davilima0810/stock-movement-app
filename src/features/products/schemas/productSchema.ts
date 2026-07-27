import { z } from 'zod';

export const productSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['ELECTRONIC', 'HOME_APPLIANCE', 'FURNITURE'], {
    error: 'Tipo de produto é obrigatório',
  }),
  supplierPrice: z
    .number({ error: 'Preço de fornecedor deve ser um número' })
    .min(0.01, 'Preço deve ser maior que zero'),
  stockQuantity: z
    .number({ error: 'Quantidade deve ser um número' })
    .int('Quantidade deve ser inteira')
    .min(0, 'Quantidade não pode ser negativa'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
