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
import { ReceitaService } from '../../application/services/receita.service';
import { CreateReceitaDto } from '../../application/dto/create-receita.dto';
import { UpdateReceitaDto } from '../../application/dto/update-receita.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('receita')
export class ReceitaController {
  constructor(private readonly receitaService: ReceitaService) {}

  @Post()
  create(@Body() createReceitaDto: CreateReceitaDto) {
    return this.receitaService.create(createReceitaDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/recorrentes/:id')
  findAllRecorrentesFilhas(@Param('id') id: string, @Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.receitaService.findAllRecorrentesFilhas(+id, firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/recorrentes')
  findAllRecorrentes(@Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.receitaService.findAllRecorrentes(firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.receitaService.findOne(+id, firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.receitaService.findAll(firebaseUid);
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
