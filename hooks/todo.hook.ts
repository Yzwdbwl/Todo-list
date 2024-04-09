import {useState} from "react";
import {TodoItem} from "../model";
import {getTodos} from "../firebase";


export const useTodoHook = () => {

    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const refreshTodos = async () => {
        setIsLoading(true);
        try {
            const fetchedTodos = await getTodos();
            setTodos(fetchedTodos);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }


    return {
        todos,
        isLoading,
        error,
        refreshTodos
    }
}