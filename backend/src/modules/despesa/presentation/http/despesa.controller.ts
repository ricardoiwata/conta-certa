import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DespesaService } from '../../application/services/despesa.service';
import { CreateDespesaDto } from '../../application/dto/create-despesa.dto';
import { UpdateDespesaDto } from '../../application/dto/update-despesa.dto';

@Controller('despesa')
export class DespesaController {
  constructor(private readonly despesaService: DespesaService) {}

  @Post()
  create(@Body() createDespesaDto: CreateDespesaDto) {
    return this.despesaService.create(createDespesaDto);
  }

  @Get()
  findAll() {
    return this.despesaService.findAll();
  }
  @Get('/recorrentes')
  findAllRecorrentes() {
    return this.despesaService.findAllRecorrentes();
  }

  @Get('/recorrentes/:id')
  findAllRecorrentesFilhas(@Param('id') id: string) {
    return this.despesaService.findAllRecorrentesFilhas(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.despesaService.findOne(+id);
  }

  @Get('/futuras/:usuarioId')
  getDespesasFuturas(@Param('usuarioId') usuarioId: string) {
    return this.despesaService.getDespesasFuturas(+usuarioId);
  }

  @Get('/mes/:usuarioId')
  getDespesasMes(@Param('usuarioId') usuarioId: string) {
    return this.despesaService.getDespesasMes(+usuarioId);
  }

  @Get('/mesRetroativo/:usuarioId')
  getDespesasMesesPassados(@Param('usuarioId') usuarioId: string) {
    return this.despesaService.getDespesasMesesPassados(+usuarioId);
  }

  @Get('/dia/:usuarioId')
  getDespesasDia(
    @Param('usuarioId') usuarioId: string,
    @Query('data') data: string,
  ) {
    return this.despesaService.getDespesasDia(+usuarioId, data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDespesaDto: UpdateDespesaDto) {
    return this.despesaService.update(+id, updateDespesaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despesaService.remove(+id);
  }
}
