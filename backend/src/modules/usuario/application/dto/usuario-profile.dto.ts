import { Exclude } from 'class-transformer';

export class UsuarioProfileDto {
  id: number;
  firebaseUid: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  criadoEm: Date;
  atualizadoEm: Date;

  @Exclude()
  notificacoes: any[];
}
