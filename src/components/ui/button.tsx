import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
const buttonVariants = cva('btn', {
  variants: { variant: { default: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', success: 'btn-success', destructive: 'btn-danger' }, size: { default: '', sm: 'btn-sm', icon: 'btn-icon', lg: 'btn-lg' } },
  defaultVariants: { variant: 'default', size: 'default' },
});
export function Button({ className, variant, size, asChild, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
