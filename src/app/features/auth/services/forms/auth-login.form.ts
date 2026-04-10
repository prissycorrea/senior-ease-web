import { inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

export function authLoginForm() {
  const builder = inject(NonNullableFormBuilder);

  const form = builder.group({
    step1: builder.group({
      email: builder.control('', [Validators.required, Validators.email]),
    }),
    step2: builder.group({
      password: builder.control('', Validators.required),
    }),
  });

  return { form };
}
