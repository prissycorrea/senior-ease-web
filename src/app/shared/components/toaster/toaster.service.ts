import { Injectable, signal } from '@angular/core';

/** Tipos de alertas suportados pelo sistema */
export type MessageType = 'success' | 'error' | 'info' | 'warning';

/** Estrutura da mensagem de alerta */
export interface Message {
  text: unknown;
  type: MessageType;
  duration?: number;
}

/**
 * Serviço global para disparar alertas flutuantes (Toasts).
 * Centraliza a comunicação com o usuário de forma não intrusiva.
 */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  /** Signal que armazena a mensagem atual. Se null, nenhum alerta é exibido. */
  public currentMessage = signal<Message | null>(null);

  /**
   * Exibe uma mensagem de sucesso (Verde).
   * @param text Texto a ser exibido.
   */
  public success(text: string): void {
    this._showMessage(text, 'success');
  }

  /**
   * Exibe uma mensagem de erro (Vermelho).
   * @param text Texto a ser exibido.
   */
  public error(text: unknown): void {
    this._showMessage(text, 'error');
  }

  /**
   * Exibe uma mensagem de alerta/aviso (Amarelo/Laranja).
   * @param text Texto a ser exibido.
   */
  public warning(text: string): void {
    this._showMessage(text, 'warning');
  }

  /**
   * Lógica interna para configurar e limpar a mensagem após o tempo determinado.
   */
  private _showMessage(text: unknown, type: MessageType, duration: number = 4000): void {
    this.currentMessage.set({ text, type });

    // Limpa a mensagem após o tempo definido
    setTimeout(() => {
      this.clear();
    }, duration);
  }

  /**
   * Remove a mensagem da tela imediatamente.
   */
  public clear(): void {
    this.currentMessage.set(null);
  }
}
