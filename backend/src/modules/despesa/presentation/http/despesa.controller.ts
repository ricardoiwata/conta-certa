import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDespesaDto: UpdateDespesaDto) {
    return this.despesaService.update(+id, updateDespesaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despesaService.remove(+id);
  }
}
