import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PreferenciasNotificacaoService } from '../../application/services/preferencias-notificacao.service';
import { CreatePreferenciasNotificacaoDto } from '../../application/dto/create-preferencias-notificacao.dto';
import { UpdatePreferenciasNotificacaoDto } from '../../application/dto/update-preferencias-notificacao.dto';

@Controller('preferencias-notificacao')
export class PreferenciasNotificacaoController {
  constructor(
    private readonly preferenciasNotificacaoService: PreferenciasNotificacaoService,
  ) {}

  @Post()
  create(
    @Body() createPreferenciasNotificacaoDto: CreatePreferenciasNotificacaoDto,
  ) {
    return this.preferenciasNotificacaoService.create(
      createPreferenciasNotificacaoDto,
    );
  }

  @Get()
  findAll() {
    return this.preferenciasNotificacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preferenciasNotificacaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePreferenciasNotificacaoDto: UpdatePreferenciasNotificacaoDto,
  ) {
    return this.preferenciasNotificacaoService.update(
      +id,
      updatePreferenciasNotificacaoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preferenciasNotificacaoService.remove(+id);
  }
}
