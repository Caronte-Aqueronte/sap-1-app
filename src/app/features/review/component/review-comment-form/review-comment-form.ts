import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../../service/review-service';
import { CreateReviewRequestDTO } from '../../model/CreateReviewRequestDTO';
import { ErrorRenderService } from '../../../../core/services/error-render-service';

@Component({
  selector: 'app-review-comment-form',
  standalone: true,
  imports: [NzFormModule, ReactiveFormsModule, NzRateModule, NzInputModule, NzButtonModule],
  templateUrl: './review-comment-form.html',
})
export class ReviewCommentForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  @Input({ required: true }) targetId!: string;
  @Output() submitted = new EventEmitter<void>();

  form = this.fb.group({
    nationalId: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    rating: [null as number | null, [Validators.required]],
    comment: ['', [Validators.maxLength(255)]],
  });

  submitting = false;

  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private errRender: ErrorRenderService
  ) {}

  ngOnInit(): void {}

  submit(): void {
    if (!this.targetId) {
      this.toastr.error('No se ha definido el objetivo de la reseña');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Completa los campos requeridos');
      return;
    }

    const dto: CreateReviewRequestDTO = {
      targetId: this.targetId,
      rating: this.form.value.rating!,
      comment: this.form.value.comment || undefined,
      nationalId: this.form.value.nationalId!,
    };

    this.submitting = true;
    this.reviewService.createRoomReview(dto).subscribe({
      next: () => {
        this.toastr.success('Reseña enviada con éxito');
        this.form.reset();
        this.submitting = false;
        this.submitted.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.toastr.error(this.errRender.render(err.error));
      },
    });
  }
}

