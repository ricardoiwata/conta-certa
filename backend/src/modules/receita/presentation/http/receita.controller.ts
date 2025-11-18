import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReceitaService } from '../../application/services/receita.service';
import { CreateReceitaDto } from '../../application/dto/create-receita.dto';
import { UpdateReceitaDto } from '../../application/dto/update-receita.dto';

@Controller('receita')
export class ReceitaController {
  constructor(private readonly receitaService: ReceitaService) {}

  @Post()
  create(@Body() createReceitaDto: CreateReceitaDto) {
    return this.receitaService.create(createReceitaDto);
  }

  @Get()
  findAll() {
    return this.receitaService.findAll();
  }

  @Get('/recorrentes')
  findAllRecorrentes() {
    return this.receitaService.findAllRecorrentes();
  }

  @Get('/recorrentes/:id')
  findAllRecorrentesFilhas(@Param('id') id: string) {
    return this.receitaService.findAllRecorrentesFilhas(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receitaService.findOne(+id);
  }

  @Get('/futuras/:usuarioId')
  getReceitasFuturas(@Param('usuarioId') usuarioId: string) {
    return this.receitaService.getReceitasFuturas(+usuarioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceitaDto: UpdateReceitaDto) {
    return this.receitaService.update(+id, updateReceitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receitaService.remove(+id);
  }
}
