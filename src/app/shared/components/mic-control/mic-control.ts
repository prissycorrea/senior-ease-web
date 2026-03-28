import { CommonModule } from '@angular/common';
import { Component, effect, output, signal } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-mic-control',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './mic-control.html',
  styleUrl: './mic-control.scss',
})
export class MicControl {
  isRecording = signal<boolean>(false);
  startRecording = output<boolean>();
  stopRecording = output<string>();
  mediaStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioUrl: string | null = null;

  recognition: any;
  transcricao: string = '';

  constructor() {
    this.initSpeechRecognition();

    effect(() => {
      this.startRecording.emit(this.isRecording());
    });
  }

  initSpeechRecognition() {
    const { webkitSpeechRecognition }: any = window as any;
    if (webkitSpeechRecognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'pt-BR';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event: any) => {
        let textoFinal = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          textoFinal += event.results[i][0].transcript;
        }
        this.transcricao = textoFinal;
      };
    }
  }

  async toggleMic() {
    if (this.isRecording()) {
      this.stopMic();
    } else {
      await this.startMic();
    }
  }

  async startMic() {
    try {
      this.audioChunks = [];
      this.transcricao = '';
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Inicia Gravação de Áudio
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.ondataavailable = (event) => this.audioChunks.push(event.data);
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(audioBlob);
      };

      this.mediaRecorder.start();

      this.recognition?.start();

      this.isRecording.set(true);
    } catch (err) {
      console.error('Erro:', err);
    }
  }

  stopMic() {
    if (this.isRecording()) {
      this.mediaRecorder?.stop();
      this.recognition?.stop();

      this.mediaStream?.getTracks().forEach((track) => track.stop());
      this.isRecording.set(false);
      this.stopRecording.emit(this.transcricao);
    }
  }
}
