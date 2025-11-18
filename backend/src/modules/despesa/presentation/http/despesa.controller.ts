import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DespesaService } from '../../application/services/despesa.service';
import { CreateDespesaDto } from '../../application/dto/create-despesa.dto';
import { UpdateDespesaDto } from '../../application/dto/update-despesa.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('despesa')
export class DespesaController {
  constructor(private readonly despesaService: DespesaService) {}

  @Post()
  create(@Body() createDespesaDto: CreateDespesaDto) {
    return this.despesaService.create(createDespesaDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/recorrentes/:id')
  findAllRecorrentesFilhas(@Param('id') id: string, @Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.despesaService.findAllRecorrentesFilhas(+id, firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/recorrentes')
  findAllRecorrentes(@Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.despesaService.findAllRecorrentes(firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.despesaService.findOne(+id, firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.despesaService.findAll(firebaseUid);
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
