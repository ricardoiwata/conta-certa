import { PartialType } from '@nestjs/mapped-types';
import { CreatePreferenciasNotificacaoDto } from './create-preferencias-notificacao.dto';

export class UpdatePreferenciasNotificacaoDto extends PartialType(CreatePreferenciasNotificacaoDto) {}
