import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateTitle,
  createTask,
  addTask,
  resetId,
  removeTask,
  filterTasks,
  countTasks,
  countCompleted,
  countPending,
  validatePriority,
  filterByPriority,
  isDuplicate,
  sortTaks,
} from '../src/taskManager.js';

// ============================================================
// 1. validateTitle
// ============================================================
describe('validateTitle', () => {
  it('deve retornar true para um título válido', () => {
    expect(validateTitle('Estudar Vitest')).toBe(true);
  });

  it('deve retornar true para título com exatamente 3 caracteres', () => {
    expect(validateTitle('abc')).toBe(true);
  });

  it('deve retornar false para string vazia', () => {
    expect(validateTitle('')).toBe(false);
  });

  it('deve retornar false para string com apenas espaços', () => {
    expect(validateTitle('   ')).toBe(false);
  });

  it('deve retornar false para título com menos de 3 caracteres', () => {
    expect(validateTitle('ab')).toBe(false);
  });

  it('deve retornar false para null', () => {
    expect(validateTitle(null)).toBe(false);
  });

  it('deve retornar false para undefined', () => {
    expect(validateTitle(undefined)).toBe(false);
  });

  it('deve retornar false para número', () => {
    expect(validateTitle(123)).toBe(false);
  });

  it('deve retornar false para booleano', () => {
    expect(validateTitle(true)).toBe(false);
  });

  it('deve retornar false para array', () => {
    expect(validateTitle(['tarefa'])).toBe(false);
  });

  it('deve considerar o título após trim', () => {
    expect(validateTitle('  abc  ')).toBe(true);
  });
});

// ============================================================
// 2. createTask
// ============================================================
describe('createTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar uma tarefa com as propriedades corretas', () => {
    const task = createTask('Estudar TDD');

    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title', 'Estudar TDD');
    expect(task).toHaveProperty('completed', false);
  });

  it('deve atribuir IDs incrementais', () => {
    const task1 = createTask('Tarefa 1');
    const task2 = createTask('Tarefa 2');

    expect(task2.id).toBe(task1.id + 1);
  });

  it('deve iniciar com completed = false', () => {
    const task = createTask('Nova tarefa');

    expect(task.completed).toBe(false);
  });

  it('deve fazer trim do título', () => {
    const task = createTask('  Título com espaços  ');

    expect(task.title).toBe('Título com espaços');
  });
});

// ============================================================
// 3. addTask
// ============================================================
describe('addTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve adicionar uma tarefa a uma lista vazia', () => {
    const tasks = addTask([], 'Primeira tarefa');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Primeira tarefa');
  });

  it('deve adicionar uma tarefa a uma lista existente', () => {
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');

    expect(tasks).toHaveLength(2);
    expect(tasks[1].title).toBe('Tarefa 2');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const original = [];
    const updated = addTask(original, 'Nova tarefa');

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
  });

  it('deve lançar erro para título vazio', () => {
    expect(() => addTask([], '')).toThrow('Título inválido');
  });

  it('deve lançar erro para título null', () => {
    expect(() => addTask([], null)).toThrow('Título inválido');
  });

  it('deve lançar erro para título undefined', () => {
    expect(() => addTask([], undefined)).toThrow('Título inválido');
  });

  it('deve lançar erro para título com menos de 3 caracteres', () => {
    expect(() => addTask([], 'ab')).toThrow('Título inválido');
  });

  it('deve lançar erro para título numérico', () => {
    expect(() => addTask([], 42)).toThrow('Título inválido');
  });
});

// ============================================================
// Exercício 1: removeTask
// ============================================================
describe('removeTask', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
  });

  it('deve remover uma tarefa pelo ID', () => {
    const updated = removeTask(tasks, 2);
    expect(updated).toHaveLength(2);
    expect(updated.find((t) => t.id === 2)).toBeUndefined();
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const updated = removeTask(tasks, 1);
    expect(updated).not.toBe(tasks);
    expect(tasks).toHaveLength(3); // Original não muda
  });

  it('deve retornar a lista completa se o ID não existir', () => {
    const updated = removeTask(tasks, 99);
    expect(updated).toHaveLength(3);
  });
});

// ============================================================
// Exercício 2: filterTasks
// ============================================================
describe('filterTasks', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1'); // pendente
    tasks = addTask(tasks, 'Tarefa 2'); 
    tasks[1].completed = true; // Força uma como concluída para o teste
  });

  it('deve filtrar apenas concluídas', () => {
    const result = filterTasks(tasks, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

  it('deve retornar todas para filtro "all"', () => {
    const result = filterTasks(tasks, 'all');
    expect(result).toHaveLength(2);
  });
});

// ============================================================
// Exercício 3: Contagens
// ============================================================
describe('Contagens', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1'); // pendente
    tasks = addTask(tasks, 'Tarefa 2'); // pendente
    // Vamos marcar uma como concluída manualmente para testar a contagem
    tasks[0].completed = true; 
  });

  it('countTasks deve retornar o total de tarefas', () => {
    expect(countTasks(tasks)).toBe(2);
  });

  it('countCompleted deve contar apenas as concluídas', () => {
    expect(countCompleted(tasks)).toBe(1);
  });

  it('countPending deve contar apenas as pendentes', () => {
    expect(countPending(tasks)).toBe(1);
  });

  it('deve retornar 0 para lista vazia em todas as funções', () => {
    expect(countTasks([])).toBe(0);
    expect(countCompleted([])).toBe(0);
    expect(countPending([])).toBe(0);
  });
});

// ============================================================
// Exercício 4: Prioridade
// ============================================================
describe('Prioridade', () => {
  it('createTask deve incluir priority: "medium" por padrão', () => {
    const task = createTask('Estudar DevOps');
    expect(task.priority).toBe('medium');
  });

  it('createTask deve aceitar uma prioridade específica', () => {
    const task = createTask('Trabalho Urgente', 'high');
    expect(task.priority).toBe('high');
  });

  it('validatePriority deve aceitar apenas low, medium e high', () => {
    expect(validatePriority('high')).toBe(true);
    expect(validatePriority('low')).toBe(true);
    expect(validatePriority('urgente')).toBe(false);
  });

  it('filterByPriority deve filtrar corretamente por prioridade', () => {
    const tasks = [
      { title: 'A', priority: 'high' },
      { title: 'B', priority: 'low' },
      { title: 'C', priority: 'high' }
    ];
    const result = filterByPriority(tasks, 'high');
    expect(result).toHaveLength(2);
    expect(result.every(t => t.priority === 'high')).toBe(true);
  });
});

// ============================================================
// Exercício 5: Impedir duplicatas
// ============================================================
describe('Impedir duplicatas', () => {
  it('isDuplicate deve retornar true para títulos idênticos', () => {
    const tasks = [{ title: 'Estudar' }];
    expect(isDuplicate(tasks, 'Estudar')).toBe(true);
  });

  it('isDuplicate deve ignorar maiúsculas e espaços extras (case-insensitive)', () => {
    const tasks = [{ title: 'Estudar' }];
    expect(isDuplicate(tasks, '  estudar  ')).toBe(true);
  });

  it('addTask deve lançar erro ao tentar adicionar título duplicado', () => {
    const tasks = addTask([], 'Aprender TDD');
    expect(() => addTask(tasks, 'Aprender TDD')).toThrow('Tarefa duplicada');
  });
});

// ============================================================
// Exercício 6: Ordenação
// ============================================================
describe('sortTasks', () => {
  it('deve ordenar colocando pendentes antes de concluídas', () => {
    const tasks = [
      { title: 'A', completed: true },
      { title: 'B', completed: false },
      { title: 'C', completed: false }
    ];
    const sorted = sortTasks(tasks);
    
    expect(sorted[0].title).toBe('B');
    expect(sorted[1].title).toBe('C');
    expect(sorted[2].title).toBe('A');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const tasks = [{ title: 'A', completed: true }];
    const sorted = sortTasks(tasks);
    expect(sorted).not.toBe(tasks);
  });
});