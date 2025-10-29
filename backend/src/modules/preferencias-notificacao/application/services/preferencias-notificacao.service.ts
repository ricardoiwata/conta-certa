import { Injectable } from '@nestjs/common';
import { CreatePreferenciasNotificacaoDto } from '../dto/create-preferencias-notificacao.dto';
import { UpdatePreferenciasNotificacaoDto } from '../dto/update-preferencias-notificacao.dto';

@Injectable()
export class PreferenciasNotificacaoService {
  create(createPreferenciasNotificacaoDto: CreatePreferenciasNotificacaoDto) {
    return 'This action adds a new preferenciasNotificacao';
  }

  findAll() {
    return `This action returns all preferenciasNotificacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preferenciasNotificacao`;
  }

  update(
    id: number,
    updatePreferenciasNotificacaoDto: UpdatePreferenciasNotificacaoDto,
  ) {
    return `This action updates a #${id} preferenciasNotificacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} preferenciasNotificacao`;
  }
}
