// ============================================================
// taskManager.js — Regras de negócio do gerenciador de tarefas
// ============================================================

// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------

let _nextId = 1;

/**
 * Reseta o contador de IDs (útil para testes determinísticos).
 */
export function resetId() {
  _nextId = 1;
}

export function validateTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  const trimmed = title.trim();
  return trimmed.length >= 3;
}

// ------------------------------------------------------------
// Criação
// ------------------------------------------------------------

export function createTask(title, priority = 'medium') {
  return {
    id: _nextId++,
    title: title.trim(),
    completed: false,
    priority
  };
}

// ------------------------------------------------------------
// Validação de duplicatas
// ------------------------------------------------------------
export function isDuplicate(tasks, title) {
  const normalizedTitle = title.trim().toLowerCase();
  return tasks.some(t => t.title.toLowerCase() === normalizedTitle);
}

// ------------------------------------------------------------
// Adição com validação
// ------------------------------------------------------------

export function addTask(tasks, title) {
  if (!validateTitle(title)) {
    throw new Error(
      'Título inválido: deve ser uma string com pelo menos 3 caracteres.'
    );
  }
  if (isDuplicate(tasks, title)) {
    throw new Error('Tarefa duplicada');
  }

  const newTask = createTask(title);
  return [...tasks, newTask];
}

// ------------------------------------------------------------
// Remoção
// ------------------------------------------------------------
export function removeTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

// ------------------------------------------------------------
// Filtro
// ------------------------------------------------------------
export function filterTasks(tasks, status) {
  switch (status) {
    case 'completed':
      return tasks.filter((t) => t.completed === true);
    case 'pending':
      return tasks.filter((t) => t.completed === false);
    default:
      return [...tasks];
  }
}

// ------------------------------------------------------------
// Contagens
// ------------------------------------------------------------
export function countTasks(tasks) {
  return tasks.length;
}

export function countCompleted(tasks) {
  return tasks.filter((t) => t.completed === true).length;
}

export function countPending(tasks) {
  return tasks.filter((t) => t.completed === false).length;
}

// ------------------------------------------------------------
// Prioridades
// ------------------------------------------------------------
export function validatePriority(priority) {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
}

export function filterByPriority(tasks, priority) {
  return tasks.filter(t => t.priority === priority);
}

// ------------------------------------------------------------
// Ordenação
// ------------------------------------------------------------
export function sortTasks(tasks) {
    
  return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
}

// ------------------------------------------------------------
// Busca
// ------------------------------------------------------------
export function searchTasks(tasks, query) {
  const q = query.toLowerCase();
  return tasks.filter(t => t.title.toLowerCase().includes(q));
}