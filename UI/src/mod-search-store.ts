import { useEffect, useState } from "react";

let query = "";
const listeners = new Set<(value: string) => void>();

export const getModSearchQuery = () => query;

export const setModSearchQuery = (value: string) => {
    if (value === query) return;
    query = value;
    listeners.forEach((listener) => listener(value));
};

export const useModSearchQuery = () => {
    const [value, setValue] = useState(query);
    useEffect(() => {
        listeners.add(setValue);
        setValue(query);
        return () => {
            listeners.delete(setValue);
        };
    }, []);
    return value;
};

let gameSearchActive = false;

export const isGameSearchActive = () => gameSearchActive;

export const setGameSearchActive = (value: boolean) => {
    gameSearchActive = value;
};
