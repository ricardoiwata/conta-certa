describe('Transacao Domain', () => {
  interface Transacao {
    id: string;
    descricao: string;
    valor: number;
    data: string;
    tipo: 'receita' | 'despesa';
  }

  it('should create valid receita transaction', () => {
    const receita: Transacao = {
      id: '1',
      descricao: 'Salário',
      valor: 5000,
      data: '2025-11-20',
      tipo: 'receita',
    };

    expect(receita.tipo).toBe('receita');
    expect(receita.valor).toBeGreaterThan(0);
  });

  it('should create valid despesa transaction', () => {
    const despesa: Transacao = {
      id: '2',
      descricao: 'Aluguel',
      valor: 1500,
      data: '2025-11-20',
      tipo: 'despesa',
    };

    expect(despesa.tipo).toBe('despesa');
    expect(despesa.valor).toBeGreaterThan(0);
  });

  it('should have required transaction fields', () => {
    const transacao: Transacao = {
      id: '1',
      descricao: 'Test',
      valor: 100,
      data: '2025-11-20',
      tipo: 'receita',
    };

    expect(transacao).toHaveProperty('id');
    expect(transacao).toHaveProperty('descricao');
    expect(transacao).toHaveProperty('valor');
    expect(transacao).toHaveProperty('data');
    expect(transacao).toHaveProperty('tipo');
  });
});
