import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository, Between } from 'typeorm';
import { CreateDespesaDto } from '../dto/create-despesa.dto';
import { UpdateDespesaDto } from '../dto/update-despesa.dto';
import { Despesa } from '../../domain/entities/despesa.entity';
import { Categoria } from '../../../categoria/domain/entities/categoria.entity';
import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa)
    private despesaRepository: Repository<Despesa>,
    @InjectRepository(Categoria)
    private categoriaRepositorio: Repository<Categoria>,
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async create(createDespesaDto: CreateDespesaDto) {
    const categoria = await this.categoriaRepositorio.findOne({
      where: { id: createDespesaDto.categoriaId },
    });

    if (!categoria) {
      throw new NotFoundException(
        `Categoria com id #${createDespesaDto.categoriaId} não encontrada`,
      );
    }

    const despesa = this.despesaRepository.create({
      ...createDespesaDto,
      categoria,
      data: new Date(createDespesaDto.data),
    });

    return this.despesaRepository.save(despesa);
  }

  async findAll() {
    return await this.despesaRepository.find({
      relations: ['categoria'],
    });
  }

  async findAllRecorrentes() {
    return await this.despesaRepository.find({
      where: { recorrentePai: true },
      relations: ['categoria'],
    });
  }

  async findAllRecorrentesFilhas(id: number) {
    return await this.despesaRepository.find({
      where: { recorrentePaiId: id },
    });
  }

  async findOne(id: number) {
    const despesa = await this.despesaRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!despesa) throw new NotFoundException(`Despesa #${id} não encontrada`);

    return despesa;
  }

  async update(id: number, updateDespesaDto: UpdateDespesaDto) {
    this.findOne(id);

    await this.despesaRepository.update(id, updateDespesaDto);

    return this.findOne(id);
  }

  remove(id: number) {
    return this.despesaRepository.delete(id);
  }

  async getDespesasFuturas(usuarioId: number) {
    const usuario = await this.usuarioRepositorio.findOne({
      where: { id: usuarioId },
    });

    if (!usuario)
      throw new NotFoundException(`Usuario #${usuarioId} não encontrado`);

    const agora = new Date();
    const inicioProximoMes = new Date(agora.getFullYear(), agora.getMonth());

    return this.despesaRepository.find({
      where: {
        usuarioId,
        data: MoreThanOrEqual(inicioProximoMes),
      },
      relations: ['categoria'],
      order: { data: 'ASC' },
    });
  }

  async getDespesasMes(usuarioId: number) {
    const usuario = await this.usuarioRepositorio.findOne({
      where: { id: usuarioId },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario #${usuarioId} não encontrado`);

    // Janela: do início do mes atual até o fim do 12º mês (12 meses no total)
    const agora = new Date();
    const inicioMesAtual = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const fimJanela = new Date(
      inicioMesAtual.getFullYear(),
      inicioMesAtual.getMonth() + 12,
      0,
      23,
      59,
      59,
      999,
    );

    return this.despesaRepository.find({
      where: {
        usuarioId,
        data: Between(inicioMesAtual, fimJanela),
      },
      order: { data: 'ASC' },
    });
  }

  async getDespesasMesesPassados(usuarioId: number) {
    const usuario = await this.usuarioRepositorio.findOne({
      where: { id: usuarioId },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario #${usuarioId} não encontrado`);

    const agora = new Date();
    // início do mês atual
    const inicioMesAtual = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    // início da janela: 11 meses antes (total = 12 meses contando o atual)
    const inicioJanela = new Date(
      inicioMesAtual.getFullYear(),
      inicioMesAtual.getMonth() - 11,
      1,
      0,
      0,
      0,
      0,
    );
    // fim da janela: último dia do mês atual, 23:59:59.999
    const fimJanela = new Date(
      inicioMesAtual.getFullYear(),
      inicioMesAtual.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return this.despesaRepository.find({
      where: {
        usuarioId,
        data: Between(inicioJanela, fimJanela),
      },
      order: { data: 'ASC' },
    });
  }

  async getDespesasDia(usuarioId: number, data: string) {
    const usuario = await this.usuarioRepositorio.findOne({
      where: { id: usuarioId },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario #${usuarioId} não encontrado`);

    const dataObj = new Date(data);

    return this.despesaRepository.find({
      where: { usuarioId, data: dataObj },
      order: { data: 'ASC' },
    });
  }
}
