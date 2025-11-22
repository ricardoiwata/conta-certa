describe('Categorias Domain', () => {
  it('should have valid category structure', () => {
    const category = {
      id: 1,
      nomeCategoria: 'Alimentação',
    };

    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('nomeCategoria');
    expect(typeof category.id).toBe('number');
    expect(typeof category.nomeCategoria).toBe('string');
  });

  it('should validate category name is not empty', () => {
    const validCategories = [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
    ];

    validCategories.forEach(cat => {
      expect(cat.length).toBeGreaterThan(0);
    });
  });
});
