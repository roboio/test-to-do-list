import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerTodo = {
  readonly completed: boolean;
  readonly id: string;
  readonly task: string;
}

type LazyTodo = {
  readonly completed: boolean;
  readonly id: string;
  readonly task: string;
}

export declare type Todo = LazyLoading extends LazyLoadingDisabled ? EagerTodo : LazyTodo

export declare const Todo: (new (init: ModelInit<Todo>) => Todo)

