import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

function getVisibleTodos(todos: Todo[], selectedFilter: Filter) {
  if (selectedFilter === Filter.All) {
    return todos;
  }

  return todos.filter(
    todo => todo.completed === (selectedFilter === Filter.Completed),
  );
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const visibleTodos = getVisibleTodos(todos, selectedFilter);

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  }, []);

  const activeTodosCount = todos.filter(
    todo => todo.completed === false,
  ).length;

  const completedTodosCount = todos.filter(
    todo => todo.completed === true,
  ).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList todos={visibleTodos} />

            <Footer
              activeTodosCount={activeTodosCount}
              completedTodosCount={completedTodosCount}
              selectedFilter={selectedFilter}
              onFilterChange={newFilter => setSelectedFilter(newFilter)}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
