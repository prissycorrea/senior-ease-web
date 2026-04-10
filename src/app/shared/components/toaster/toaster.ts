import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from './toaster.service';

/**
 * Componente visual para exibição de mensagens flutuantes (Toasts).
 * Escuta o Signal do MessageService e reage automaticamente.
 */
@Component({
  selector: 'app-toast',
  standalone: true, // Recomendado para componentes globais assim
  imports: [CommonModule],
  templateUrl: './toaster.html',
  styleUrls: ['./toaster.scss'],
})
export class ToasterComponent {
  /** Injeção do serviço de mensagens para acesso ao Signal currentMessage */
  public readonly messageService = inject(MessageService);

  /**
   * Nota: Não precisamos de lógica adicional aqui porque o
   * MessageService já lida com o setTimeout para limpar a mensagem.
   * O template HTML usa o signal messageService.currentMessage()
   * de forma declarativa.
   */
}
