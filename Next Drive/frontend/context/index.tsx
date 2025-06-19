'use client'
import { createContext, useContext, useState } from "react";

type User = {
    _id: string;
    name?: string;
    email?: string;
    picture?: string;
  };

  type AppContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
  };

  const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({children}:{children: React.ReactNode}){
    const [user, setUser] = useState<User>({
        _id: '123',
        name: 'Aryan123',
        email: 'a@a.com',
        picture: 'https://variety.com/wp-content/uploads/2023/05/spider-2.jpg?w=1000&h=563&crop=1&resize=681%2C383'
    })
    return (
        <AppContext.Provider value={{user, setUser}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(): AppContextType{
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppWrapper');
    }
    return context;
}