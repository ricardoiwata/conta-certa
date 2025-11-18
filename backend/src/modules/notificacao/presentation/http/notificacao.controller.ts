import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificacaoService } from '../../application/services/notificacao.service';
import { CreateNotificacaoDto } from '../../application/dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from '../../application/dto/update-notificacao.dto';

@Controller('notificacao')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Post()
  create(@Body() createNotificacaoDto: CreateNotificacaoDto) {
    return this.notificacaoService.create(createNotificacaoDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificacaoService.findOne(+id);
  }

  // Lista todas as notificações de um usuário
  @Get('user/:id')
  findAllByUser(@Param('id') id: string) {
    return this.notificacaoService.findAllByUser(+id);
  }

  // Lista somente notificações ativas de um usuário
  @Get('user/:id/active')
  findAllActivesByUser(@Param('id') id: string) {
    return this.notificacaoService.findAllActivesByUser(+id);
  }

  // Deleção lógica de várias notificações (body: { ids: number[] })
  @Patch('deactivate')
  deactivateMany(@Body('ids') ids: number[]) {
    return this.notificacaoService.deactivateMany(ids);
  }

  // Deleção lógica de todas as notificações de um usuário
  @Patch('user/:id/deactivate')
  deactivateAllByUser(@Param('id') id: string) {
    return this.notificacaoService.deactivateAllByUser(+id);
  }

  // Atualiza -> deleção lógica (ativa = false) para uma notificação
  @Patch(':id')
  deactivate(@Param('id') id: string) {
    return this.notificacaoService.deactivate(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificacaoService.remove(+id);
  }
}
