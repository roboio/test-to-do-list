<template>
  <div class="main">
    <h1>Todo List</h1>

    <AddTodo/>

    <div class="divider"/>

    <LoadingSpinner v-if="loading" :center="true"/>

    <ul v-if="todos && todos.length > 0" class="list">
      <li
          :key="todo.id"
          v-for="todo in todos"
          class="list-item show-animation"
          :class="{
            completed: todo.completed,
            loading: todoLoadings.indexOf(todo.id) !== -1
          }"
          @click.prevent="()=>updateTodo(todo)"
      >
        <div class="list-item-main">
          <div class="custom-checkbox">
            <v-icon
                name="bi-check2-all"
                animation="pulse"
                :fill="todo.completed ? 'var(--primary)' : 'var(--grey-extra-dark)'"
            />
          </div>
          <span class="list-item-text">{{ todo.task }}</span>
        </div>
        <button @click.stop="deleteTodo(todo.id)" class="button button_danger">
          <v-icon name='bi-trash' scale="1"/>
          Delete
        </button>
      </li>
    </ul>
    <p class="no-todos" v-else>No todos found.</p>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import {ref, watch} from "vue";
import {useQuery, useMutation, useSubscription} from '@vue/apollo-composable';

import AddTodo from './AddTodo.vue';
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {getTodos as GET_TODOS} from "@/graphql/queries";
import {onCreateTodo, onDeleteTodo, onUpdateTodo} from "@/graphql/subscriptions";
import {updateTodo as UPDATE_TODO, deleteTodo as DELETE_TODO} from "@/graphql/mutations";

export default {
  name: 'TodoList',
  components: {
    AddTodo,
    LoadingSpinner,
  },
  setup() {
    const todos = ref([]);
    const todoLoadings = ref([]);
    const {onResult: onGetTodoResult, loading} = useQuery(gql(GET_TODOS));
    const {mutate: updateTodoMutation, onDone: onUpdateDoneHandler} = useMutation(gql(UPDATE_TODO));
    const {mutate: deleteTodoMutation, onDone: onDeleteDoneHandler} = useMutation(gql(DELETE_TODO));
    const {onResult: onCreateTodoResult} = useSubscription(gql(onCreateTodo))
    const {onResult: onUpdateTodoResult} = useSubscription(gql(onUpdateTodo))
    const {onResult: onDeleteTodoResult} = useSubscription(gql(onDeleteTodo))

    const updateTodo = (todo) => {
      if (todoLoadings.value.indexOf(todo.id) !== -1) return;

      todoLoadings.value.push(todo.id)
      updateTodoMutation({
        id: todo.id,
        completed: !todo.completed,
      });
    };

    const deleteTodo = (id) => {
      if (todoLoadings.value.indexOf(id) !== -1) return;

      todoLoadings.value.push(id)
      deleteTodoMutation({id});
    };

    onGetTodoResult(result => {
      if (result?.data?.getTodos) {
        todos.value = result.data.getTodos
      }
    })

    onCreateTodoResult(result => {
      if (result?.data?.onCreateTodo) {
        const newTodo = result?.data?.onCreateTodo;
        if (newTodo) {
          todos.value = [newTodo, ...todos.value];
        }
      }
    })

    onUpdateTodoResult(result => {
      if (result?.data?.onUpdateTodo) {
        const updatedTodo = result?.data?.onUpdateTodo;
        if (updatedTodo) {
          todos.value = todos.value.map(todo => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo
            }
            return todo;
          });
        }
      }
    })

    onDeleteTodoResult(result => {
      if (result?.data?.onDeleteTodo) {
        const id = result?.data?.onDeleteTodo?.id;
        if (id) {
          todos.value = todos.value.filter(todo => todo.id !== id);
        }
      }
    })

    onUpdateDoneHandler(result => {
      const todo = result?.data?.updateTodo;
      if (todo) {
        todoLoadings.value = todoLoadings.value.filter(todoId => todoId !== todo.id)
      }
    })

    onDeleteDoneHandler(result => {
      const todo = result?.data?.deleteTodo;
      console.log(todo)
      if (todo) {
        todoLoadings.value = todoLoadings.value.filter(todoId => todoId !== todo.id)
      }
    })

    watch(todoLoadings, (res) => {
      console.log(res)
    })

    return {
      todos,
      loading,
      updateTodo,
      deleteTodo,
      todoLoadings
    };
  },
};
</script>

<style scoped lang="scss">
.main {
  gap: 16px;
  padding: 16px;
  display: flex;
  margin: 32px auto;
  max-width: 660px;
  border-radius: 16px;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list {
  gap: 12px;
  padding: 0;
  display: flex;
  list-style-type: none;
  flex-direction: column;

  .list-item {
    display: flex;
    padding: 15px;
    cursor: pointer;
    border-radius: 8px;
    position: relative;
    align-items: center;
    background-color: var(--grey-light);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .list-item-main {
      flex-grow: 1;
      display: flex;
      align-items: center;
    }

    .custom-checkbox {
      width: 28px;
      height: 28px;
      padding: 4px;
      border-radius: 50%;
      align-items: center;
      display: inline-flex;
      justify-content: center;
      background-color: var(--white);
      transition: background-color 0.3s ease-in-out;
    }

    .list-item-text {
      font-size: 18px;
      margin-left: 10px;
      position: relative;
      text-decoration: none;
      transition: color 0.3s ease-in-out;

      &::before {
        left: 0;
        top: 50%;
        width: 0;
        content: '';
        height: 1px;
        position: absolute;
        display: inline-block;
        transition: width 0.3s ease-in-out;
        background-color: var(--grey-extra-dark);
      }
    }

    &:hover {
      .custom-checkbox {
        background-color: var(--primary-light);

        svg {
          fill: var(--primary)
        }
      }
    }

    &.completed {
      background-color: var(--primary-light);

      .list-item-text {
        color: var(--grey-extra-dark);

        &::before {
          width: 100%;
        }
      }
    }

    &.loading {
      &::before {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        color: var(--white);
        position: absolute;
        border-radius: 8px;
        text-align: center;
        align-items: center;
        display: inline-flex;
        justify-content: center;
        content: 'Processing...';
        animation-name: fadeIn;
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}

.no-todos {
  font-size: 18px;
  text-align: center;
  color: var(--grey-extra-dark);
}
</style>

