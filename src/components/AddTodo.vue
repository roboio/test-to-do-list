<template>
  <form @submit.prevent="addTodo">
    <div class="wrapper">
      <input v-model="task" placeholder="New todo" class="input"/>
      <button type="submit" class="button button_primary">
        <v-icon name='bi-plus-lg' scale="1"/>
        Create
      </button>
    </div>
  </form>
</template>

<script>
import gql from 'graphql-tag';
import {ref} from "vue";
import {toast} from 'vue3-toastify';
import {useMutation} from '@vue/apollo-composable';
import {addTodo as ADD_TODO} from "@/graphql/mutations";

export default {
  name: 'AddTodo',
  setup() {
    const task = ref('');
    const {mutate: addTodoMutation} = useMutation(gql(ADD_TODO));

    const addTodo = () => {
      if (task.value.trim() === '') {
        return toast("Please write todo name!", {
          autoClose: 1500,
          transition: 'flip',
          type: 'info'
        });
      }

      addTodoMutation({
        task: task.value,
        completed: false
      });

      task.value = '';
    };

    return {
      task,
      addTodo,
    };
  },
};
</script>

<style scoped>
.wrapper {
  gap: 8px;
  display: flex;
}
</style>
