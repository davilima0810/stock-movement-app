import { z } from 'zod';

export const stockMovementSchema = z
  .object({
    productId: z
      .number({ error: 'Produto é obrigatório' })
      .int()
      .positive('Selecione um produto'),
    movementType: z.enum(['ENTRY', 'EXIT'], {
      error: 'Tipo de movimentação é obrigatório',
    }),
    salePrice: z
      .number({ error: 'Preço de venda deve ser um número' })
      .min(0, 'Preço não pode ser negativo'),
    quantity: z
      .number({ error: 'Quantidade deve ser um número' })
      .int('Quantidade deve ser inteira')
      .min(1, 'Quantidade deve ser pelo menos 1'),
  })
  .refine(
    (data) => {
      if (data.movementType === 'EXIT' && data.salePrice <= 0) {
        return false;
      }
      return true;
    },
    {
      message: 'Preço de venda é obrigatório para saídas',
      path: ['salePrice'],
    }
  );

export type StockMovementFormValues = z.infer<typeof stockMovementSchema>;
