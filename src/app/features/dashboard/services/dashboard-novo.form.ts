import { inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

export function dashboardNovoForm() {
  const builder = inject(NonNullableFormBuilder);

  const form = builder.group({
    step1: builder.group({
      task: builder.control('', Validators.required),
    }),
    step2: builder.group({
      period: builder.control('', []),
    }),
  });

  return { form };
}
