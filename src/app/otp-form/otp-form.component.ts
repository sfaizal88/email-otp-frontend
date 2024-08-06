import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrl: './otp-form.component.css'
})
export class OtpFormComponent {
  otpForm: FormGroup;
  message!: string;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
    });
  }

  sendOtp() {
    const email = this.otpForm.get('email')?.value;
    this.http.post<{ status: string }>('http://localhost:3000/generate-otp', { email }).subscribe(
      response => {
        if (response.status === 'STATUS_EMAIL_OK') {
          this.message = 'OTP sent successfully.';
        } else if (response.status === 'STATUS_EMAIL_INVALID') {
          this.message = 'Invalid email domain.';
        } else {
          this.message = 'Failed to send OTP.';
        }
      },
      error => {
        this.message = 'Failed to send OTP.';
      }
    );
  }

  verifyOtp() {
    const email = this.otpForm.get('email')?.value;
    const otp = this.otpForm.get('otp')?.value;
    this.http.post<{ status: string }>('http://localhost:3000/check-otp', { email, otp }).subscribe(
      response => {
        if (response.status === 'STATUS_OTP_OK') {
          this.message = 'OTP verified successfully.';
        } else {
          this.message = 'Failed to verify OTP.';
        }
      },
      error => {
        this.message = 'Failed to verify OTP.';
      }
    );
  }
}
