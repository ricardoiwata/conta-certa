import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUsuarioDto } from '../../application/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../../application/dto/update-usuario.dto';
import { UsuarioService } from '../../application/services/usuario.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get('firebase/:firebaseUid')
  findByFirebaseUid(@Param('firebaseUid') firebaseUid: string) {
    return this.usuarioService.findByFirebaseUid(firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('perfil/me')
  async getMyProfile(@Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.usuarioService.findByFirebaseUid(firebaseUid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('perfil/me')
  async updateMyProfile(
    @Request() req: any,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const firebaseUid = req.firebaseUid;
    return this.usuarioService.updateByFirebaseUid(firebaseUid, updateUsuarioDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Patch('firebase/:firebaseUid')
  updateByFirebaseUid(
    @Param('firebaseUid') firebaseUid: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.updateByFirebaseUid(firebaseUid, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
